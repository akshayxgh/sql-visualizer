export interface SqlResult {
  columns: string[]
  rows: Array<Record<string, string | number | null>>
}

export interface SqlError {
  message: string
  isError: true
}

export type SqlExecutionResult = SqlResult | SqlError

export function isSqlError(result: SqlExecutionResult): result is SqlError {
  return (result as SqlError).isError === true
}