import type { Row } from '@/types/transformation'
import type { ExpectedOutputRow, ValidationStrategy } from '@/types/exercise'

function normalize(value: string | number | null): string {
  if (value === null || value === undefined) return 'null'
  return String(value).trim().toLowerCase()
}

function rowToKey(row: Row | ExpectedOutputRow): string {
  return Object.entries(row)
    .filter(([key]) => !key.startsWith('_'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => normalize(v))
    .join('|')
}

export function matchesExpectedOutput(
  userRows: Row[],
  expectedRows: ExpectedOutputRow[],
  strategy: ValidationStrategy
): boolean {
  if (userRows.length !== expectedRows.length) return false
  if (userRows.length === 0 && expectedRows.length === 0) return true
  
  const userKeys = userRows.map(rowToKey)
  const expectedKeys = expectedRows.map(rowToKey)
  
  if (strategy === 'exact_match') {
    return userKeys.every((key, i) => key === expectedKeys[i])
  }
  
  const sortedUser = [...userKeys].sort()
  const sortedExpected = [...expectedKeys].sort()
  return sortedUser.every((key, i) => key === sortedExpected[i])
}