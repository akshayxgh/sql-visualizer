import type { SqlJsStatic, Database } from 'sql.js'
import type { SqlExecutionResult, SqlResult } from '@/types/sql'

let sqlJsInstance: SqlJsStatic | null = null

export async function getSqlJs(): Promise<SqlJsStatic> {
  if (sqlJsInstance) return sqlJsInstance
  const initSqlJs = (await import('sql.js')).default
  sqlJsInstance = await initSqlJs({
    locateFile: () => '/sql-wasm.wasm',
  })
  return sqlJsInstance
}

export async function createDatabase(seedSql: string): Promise<Database> {
  const SQL = await getSqlJs()
  const db = new SQL.Database()
  db.run(seedSql)
  return db
}

export function executeQuery(db: Database, sql: string): SqlExecutionResult {
  const trimmed = sql.trim()
  if (!trimmed) {
    return { isError: true, message: 'Empty query' }
  }
  try {
    const results = db.exec(trimmed)
    if (results.length === 0) {
      return { columns: [], rows: [] }
    }
    const { columns, values } = results[0]
    const rows = values.map((valueRow) => {
      const rowObject: Record<string, string | number | null> = {}
      columns.forEach((col, index) => {
        rowObject[col] = valueRow[index] as string | number | null
      })
      return rowObject
    })
    return { columns, rows } satisfies SqlResult
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown SQL error'
    return { isError: true, message }
  }
}

export function closeDatabase(db: Database): void {
  try {
    db.close()
  } catch {
    // Database instance already closed securely
  }
}