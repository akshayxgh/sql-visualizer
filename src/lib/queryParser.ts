export const TRACKED_CLAUSES = [
  'SELECT',
  'FROM',
  'WHERE',
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

function findClauseKeyword(upperSql: string, keyword: TrackedClause): number {
  const pattern = keyword === 'ORDER BY'
    ? /\bORDER\s+BY\b/
    : new RegExp(`\\b${keyword}\\b`)
  const match = upperSql.match(pattern)
  if (!match || match.index === undefined) return -1
  return match.index
}

function isExecutable(sql: string): boolean {
  const upper = sql.toUpperCase().trim()
  if (!/\bSELECT\b/.test(upper)) return false
  if (!/\bFROM\s+\w+/.test(upper)) return false
  
  const singleQuoteCount = (sql.match(/'/g) || []).length
  if (singleQuoteCount % 2 !== 0) return false
  if (/[,=<>!+\-*/]\s*$/.test(sql.trim())) return false
  if (/\bWHERE\s*$/i.test(sql.trim())) return false
  
  return true
}

function buildStageLabel(
  keyword: TrackedClause,
  rawSql: string,
  startIndex: number,
  endIndex: number
): string {
  if (keyword === 'SELECT') {
    return 'SELECT — full table'
  }
  const clauseText = rawSql.slice(startIndex, endIndex).trim()
  const normalized = clauseText.replace(/\s+/g, ' ')
  if (normalized.length > 48) {
    return normalized.slice(0, 45) + '...'
  }
  return normalized
}