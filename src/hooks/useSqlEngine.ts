import { useEffect, useRef, useCallback, useState } from 'react'
import { createDatabase, executeQuery, closeDatabase } from '@/lib/sqlEngine'
import { parseIncrementalStages } from '@/lib/queryParser'
import {
  diffRows,
  keptRows,
  countDiff,
  buildGroupBuckets,
  extractGroupByColumn,
} from '@/lib/rowDiffer'
import { matchesExpectedOutput } from '@/lib/resultMatcher'
import { isSqlError } from '@/types/sql'
import type { SqlResult } from '@/types/sql'
import type { Database } from 'sql.js'
import type { TransformationStage, Row } from '@/types/transformation'
import type { Exercise } from '@/types/exercise'

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface SqlEngineState {
  status: EngineStatus
  stages: TransformationStage[]
  isCorrect: boolean
  errorMessage: string | null
  execute: (sql: string) => void
  reset: () => void
}

export interface SqlEngineActions {
  execute: (sql: string) => void
  reset: () => void
}

export function useSqlEngine(
  exercise: Exercise | null,
  seedSql: string | null
): SqlEngineState {
  const dbRef = useRef<Database | null>(null)

  const [status, setStatus] = useState<EngineStatus>('idle')
  const [stages, setStages] = useState<TransformationStage[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!exercise || !seedSql) {
      setStatus('idle')
      return
    }

    let cancelled = false

    async function init() {
      setStatus('loading')
      setStages([])
      setIsCorrect(false)
      setErrorMessage(null)

      if (dbRef.current) {
        closeDatabase(dbRef.current)
        dbRef.current = null
      }

      try {
        const db = await createDatabase(seedSql!)
        if (cancelled) { closeDatabase(db); return }
        dbRef.current = db
        setStatus('ready')
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage(
            err instanceof Error ? err.message : 'Failed to initialize database'
          )
        }
      }
    }

    init()
    return () => { cancelled = true }
  }, [exercise?.id, seedSql])

  useEffect(() => {
    return () => {
      if (dbRef.current) {
        closeDatabase(dbRef.current)
        dbRef.current = null
      }
    }
  }, [])

  const execute = useCallback(
    (sql: string) => {
      if (!dbRef.current || !exercise) return
      const db = dbRef.current

      const parsedStages = parseIncrementalStages(sql)

      if (parsedStages.length === 0) {
        setStages([])
        setIsCorrect(false)
        return
      }

      const newStages: TransformationStage[] = []
      let previousRows: Row[] = []
      let isFirstStage = true

      for (let i = 0; i < parsedStages.length; i++) {
        const parsed = parsedStages[i]
        const isGroupBy = parsed.keyword === 'GROUP BY'
        const isHaving  = parsed.keyword === 'HAVING'

        const result = executeQuery(db, parsed.cumulativeSql)

        if (isSqlError(result)) break

        const currentRows: Row[] = result.rows ?? []

        // ── GROUP BY stage ─────────────────────────────────────────────
        if (isGroupBy) {
          const groupByCol = extractGroupByColumn(parsed.cumulativeSql)
          if (!groupByCol) continue

          // Look ahead: if HAVING follows, execute it now so we can
          // mark removed groups on the same card
          let havingRows: Row[] | null = null
          const nextParsed = parsedStages[i + 1]
          if (nextParsed?.keyword === 'HAVING') {
            const havingResult = executeQuery(db, nextParsed.cumulativeSql)
            if (!isSqlError(havingResult)) {
              havingRows = havingResult.rows ?? []
            }
          }

          const buckets = buildGroupBuckets(
            previousRows,
            currentRows,
            groupByCol,
            havingRows
          )

          const keptGroups    = buckets.filter((b) => !b.isRemoved).length
          const removedGroups = buckets.filter((b) =>  b.isRemoved).length

          newStages.push({
            id: 'group_by',
            label: parsed.label,
            clauseKeyword: 'GROUP BY',
            stageType: 'grouped',
            rows: [],
            keptCount: keptGroups,
            removedCount: removedGroups,
            groups: buckets,
            groupByColumn: groupByCol,
          })

          previousRows = currentRows
          isFirstStage = false
          continue
        }

        // ── HAVING stage ───────────────────────────────────────────────
        // Already handled inside the GROUP BY branch above.
        // If a GROUP BY stage was already pushed, skip HAVING here.
        if (isHaving) {
          const prevGroupByStage = newStages.find(
            (s) => s.clauseKeyword === 'GROUP BY'
          )
          if (prevGroupByStage) {
            previousRows = currentRows
            continue
          }
          // No GROUP BY rendered yet — fall through to flat rendering
        }

        // ── Flat stages (FROM, WHERE, ORDER BY, LIMIT) ─────────────────
        if (isFirstStage) {
          const annotated = keptRows(currentRows)
          const counts = countDiff(annotated)
          newStages.push({
            id: parsed.keyword.toLowerCase().replace(/\s+/g, '_'),
            label: parsed.label,
            clauseKeyword: parsed.keyword,
            stageType: 'flat',
            rows: annotated,
            keptCount: counts.kept,
            removedCount: counts.removed,
          })
          previousRows = currentRows
          isFirstStage = false
        } else {
          const diffed = diffRows(previousRows, currentRows)
          const counts = countDiff(diffed)
          newStages.push({
            id: parsed.keyword.toLowerCase().replace(/\s+/g, '_'),
            label: parsed.label,
            clauseKeyword: parsed.keyword,
            stageType: 'flat',
            rows: diffed,
            keptCount: counts.kept,
            removedCount: counts.removed,
          })
          previousRows = currentRows
        }
      }

      setStages(newStages)

      // ── Completion check ───────────────────────────────────────────────
      if (newStages.length > 0 && exercise.expectedOutput.length > 0) {
        const lastStage = newStages[newStages.length - 1]

        let lastRows: Row[]
        if (lastStage.stageType === 'grouped' && lastStage.groups) {
          lastRows = lastStage.groups
            .filter((g) => !g.isRemoved)
            .map(({ aggregatedRow }) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { _rowId, _status, ...rest } = aggregatedRow
              return rest as Row
            })
        } else {
          lastRows = lastStage.rows
            .filter((r) => r._status !== 'removed')
            .map((r) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { _rowId, _status, ...rest } = r
              return rest as Row
            })
        }

        setIsCorrect(
          matchesExpectedOutput(
            lastRows,
            exercise.expectedOutput,
            exercise.validationStrategy
          )
        )
      } else {
        setIsCorrect(false)
      }
    },
    [exercise]
  )

  const reset = useCallback(() => {
    setStages([])
    setIsCorrect(false)
    setErrorMessage(null)
  }, [])

  return { status, stages, isCorrect, errorMessage, execute, reset }
}