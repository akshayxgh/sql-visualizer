export interface SqlResult {
  columns: string[]
  rows: Array<Record<string, string | number | null>>
}

export interface SqlError {
  isError: true
  message: string
}

// The union type used as the return type of executeQuery
export type SqlExecutionResult = SqlResult | SqlError

// Correctly typed predicate — this is what tells TypeScript to narrow the type
export function isSqlError(result: SqlExecutionResult): result is SqlError {
  return (result as SqlError).isError === true
}