import { useEffect, useRef, useCallback, useState } from 'react'
import { createDatabase, executeQuery, closeDatabase } from '@/lib/sqlEngine'
import { parseIncrementalStages } from '@/lib/queryParser'
import { diffRows, keptRows, countDiff } from '@/lib/rowDiffer'
import { matchesExpectedOutput } from '@/lib/resultMatcher'
import { isSqlError } from '@/types/sql'
import type { Database } from 'sql.js'
import type { TransformationStage, Row } from '@/types/transformation'
import type { Exercise } from '@/types/exercise'

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface SqlEngineState {
  status: EngineStatus
  stages: TransformationStage[]
  isCorrect: boolean
  errorMessage: string | null
}

export interface SqlEngineActions {
  execute: (sql: string) => void
  reset: () => void
}

export function useSqlEngine(
  exercise: Exercise | null,
  seedSql: string | null
): SqlEngineState & SqlEngineActions {
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
        if (cancelled) {
          closeDatabase(db)
          return
        }
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
    return () => {
      cancelled = true
    }
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
      
      // CRITICAL: We always track the initial base table rows (FROM) separately 
      // so sorting and filtering stages can accurately determine row offsets!
      let baseTableRows: Row[] = []
      let isFirstStage = true

      for (const parsed of parsedStages) {
        const result = executeQuery(db, parsed.cumulativeSql)
        if (isSqlError(result)) {
          break
        }
        const currentRows = result.rows
        
        if (isFirstStage) {
          const annotated = keptRows(currentRows)
          const counts = countDiff(annotated)
          newStages.push({
            id: parsed.keyword.toLowerCase().replace(' ', '_'),
            label: parsed.label,
            clauseKeyword: parsed.keyword,
            rows: annotated,
            keptCount: counts.kept,
            removedCount: counts.removed,
          })
          
          // Save a static snapshot of the raw table data
          baseTableRows = currentRows
          isFirstStage = false
        } else {
          // Diff the current active clause rows against the static base table snapshot
          const diffed = diffRows(baseTableRows, currentRows)
          const counts = countDiff(diffed)
          
          // CRITICAL FIX: If the data row status is reordered or normal, 
          // ensure the card displays the row values in their actual sorted SQLite array order!
          const visualRows = [...diffed].sort((a, b) => {
            const keyA = JSON.stringify({ ...a, _rowId: undefined, _status: undefined })
            const keyB = JSON.stringify({ ...b, _rowId: undefined, _status: undefined })
            
            const idxA = currentRows.findIndex(r => JSON.stringify(r) === keyA)
            const idxB = currentRows.findIndex(r => JSON.stringify(r) === keyB)
            
            // Keeps deleted rows cleanly appended at the bottom of the grid
            if (idxA === -1) return 1
            if (idxB === -1) return -1
            return idxA - idxB
          })

          newStages.push({
            id: parsed.keyword.toLowerCase().replace(' ', '_'),
            label: parsed.label,
            clauseKeyword: parsed.keyword,
            rows: visualRows,
            keptCount: counts.kept,
            removedCount: counts.removed,
          })
        }
      }
      
      setStages(newStages)

      if (newStages.length > 0 && exercise.expectedOutput.length > 0) {
        const lastStageRows = newStages[newStages.length - 1].rows
          .filter((r) => r._status !== 'removed')
          .map(({ _rowId: _r, _status: _s, ...rest }) => rest as Row)
          
        const correct = matchesExpectedOutput(
          lastStageRows,
          exercise.expectedOutput,
          exercise.validationStrategy
        )
        setIsCorrect(correct)
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