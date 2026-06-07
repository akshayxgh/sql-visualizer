export const TRACKED_CLAUSES = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
] as const

export type TrackedClause = (typeof TRACKED_CLAUSES)[number]

export interface ParsedClause {
  keyword: TrackedClause
  cumulativeSql: string
  label: string
}

export function parseIncrementalStages(rawSql: string): ParsedClause[] {
  if (!rawSql.trim()) return []

  const upper = rawSql.toUpperCase()
  const clausePositions: Array<{ keyword: TrackedClause; index: number }> = []

  for (const keyword of TRACKED_CLAUSES) {
    const idx = findClauseKeyword(upper, keyword)
    if (idx !== -1) {
      clausePositions.push({ keyword, index: idx })
    }
  }

  clausePositions.sort((a, b) => a.index - b.index)

  if (clausePositions.length === 0) return []

  const stages: ParsedClause[] = []

  for (let i = 0; i < clausePositions.length; i++) {
    const current = clausePositions[i]
    const next = clausePositions[i + 1]

    const endIndex = next ? next.index : rawSql.length
    const cumulativeSql = rawSql.slice(0, endIndex).trim()

    if (!isExecutable(cumulativeSql)) continue

    stages.push({
      keyword: current.keyword,
      cumulativeSql,
      label: buildStageLabel(current.keyword, rawSql, current.index, endIndex),
    })
  }

  return stages
}

export function extractTableName(sql: string): string {
  const match = sql.match(/FROM\s+(\w+)/i)
  return match ? match[1] : 'table'
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function findClauseKeyword(upperSql: string, keyword: TrackedClause): number {
  let pattern: RegExp

  if (keyword === 'ORDER BY') {
    pattern = /\bORDER\s+BY\b/
  } else if (keyword === 'GROUP BY') {
    pattern = /\bGROUP\s+BY\b/
  } else {
    pattern = new RegExp(`\\b${keyword}\\b`)
  }

  const match = upperSql.match(pattern)
  if (!match || match.index === undefined) return -1
  return match.index
}

function isExecutable(sql: string): boolean {
  const upper = sql.toUpperCase().trim()

  if (!/\bSELECT\b/.test(upper)) return false
  if (!/\bFROM\s+\w+/.test(upper)) return false

  // Unclosed string literal
  const singleQuoteCount = (sql.match(/'/g) || []).length
  if (singleQuoteCount % 2 !== 0) return false

  // Dangling operator
  if (/[,=<>!+\-*/]\s*$/.test(sql.trim())) return false

  // Incomplete WHERE
  if (/\bWHERE\s*$/i.test(sql.trim())) return false

  // Incomplete GROUP BY — keyword present but no column yet
  if (/\bGROUP\s+BY\s*$/i.test(sql.trim())) return false

  // Incomplete HAVING
  if (/\bHAVING\s*$/i.test(sql.trim())) return false

  // GROUP BY requires an aggregate or grouping column in SELECT
  if (/\bGROUP\s+BY\b/.test(upper)) {
    const hasAggregate = /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(sql)
    const groupByMatch = sql.match(/GROUP\s+BY\s+(\w+)/i)
    if (!groupByMatch) return false
    // SELECT must reference either the group column or an aggregate
    if (!hasAggregate && !upper.includes('COUNT') && !upper.includes('SUM')
        && !upper.includes('AVG') && !upper.includes('MIN') && !upper.includes('MAX')) {
      return false
    }
  }

  return true
}

function buildStageLabel(
  keyword: TrackedClause,
  rawSql: string,
  startIndex: number,
  endIndex: number
): string {
  if (keyword === 'SELECT') return 'SELECT — full table'

  const clauseText = rawSql.slice(startIndex, endIndex).trim()
  const normalized = clauseText.replace(/\s+/g, ' ')

  if (normalized.length > 48) {
    return normalized.slice(0, 45) + '...'
  }

  return normalized
}