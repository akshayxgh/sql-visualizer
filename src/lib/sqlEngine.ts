import type { SqlJsStatic, Database } from 'sql.js'
import type { SqlExecutionResult, SqlResult, SqlError } from '@/types/sql'

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

// Explicit return type annotation — this is what fixes the assignability error
export function executeQuery(db: Database, sql: string): SqlExecutionResult {
  const trimmed = sql.trim()

  if (!trimmed) {
    const err: SqlError = { isError: true, message: 'Empty query' }
    return err
  }

  try {
    const results = db.exec(trimmed)

    if (results.length === 0) {
      const ok: SqlResult = { columns: [], rows: [] }
      return ok
    }

    const { columns, values } = results[0]

    const rows = values.map((valueRow) => {
      const rowObject: Record<string, string | number | null> = {}
      columns.forEach((col, index) => {
        rowObject[col] = valueRow[index] as string | number | null
      })
      return rowObject
    })

    const ok: SqlResult = { columns, rows }
    return ok

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown SQL error'
    const error: SqlError = { isError: true, message }
    return error
  }
}

export function closeDatabase(db: Database): void {
  try {
    db.close()
  } catch {
    // Already closed
  }
}