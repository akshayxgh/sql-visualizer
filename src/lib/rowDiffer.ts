import type { Row, StageRow, RowStatus, GroupBucket } from '@/types/transformation'

function rowKey(row: Row): string {
  return JSON.stringify(
    Object.entries(row)
      .filter(([k]) => !k.startsWith('_'))
      .sort(([a], [b]) => a.localeCompare(b))
  )
}

export function diffRows(before: Row[], after: Row[]): StageRow[] {
  const afterKeys = new Set(after.map(rowKey))
  const afterKeyOrder = after.map(rowKey)

  return before.map((row, beforeIndex): StageRow => {
    const key = rowKey(row)
    const existsInAfter = afterKeys.has(key)

    let status: RowStatus = 'normal'
    if (!existsInAfter) {
      status = 'removed'
    } else {
      const afterIndex = afterKeyOrder.indexOf(key)
      if (afterIndex !== beforeIndex) status = 'reordered'
    }

    return { ...row, _rowId: key, _status: status }
  })
}

export function keptRows(after: Row[]): StageRow[] {
  return after.map((row): StageRow => ({
    ...row,
    _rowId: rowKey(row),
    _status: 'normal',
  }))
}

export function countDiff(diffed: StageRow[]): { kept: number; removed: number } {
  const removed = diffed.filter((r) => r._status === 'removed').length
  return { kept: diffed.length - removed, removed }
}

/**
 * Builds group buckets for GROUP BY visualization.
 *
 * @param sourceRows   The rows BEFORE grouping (from the previous stage)
 * @param groupedRows  The aggregated rows AFTER GROUP BY (from sql.js)
 * @param groupByCol   The column being grouped on (e.g. 'department')
 * @param havingRows   If HAVING is present, the rows that survived it.
 *                     Pass null if no HAVING clause.
 */
export function buildGroupBuckets(
  sourceRows: Row[],
  groupedRows: Row[],
  groupByCol: string,
  havingRows: Row[] | null
): GroupBucket[] {
  // Build a set of group values that survived HAVING
  const survivingKeys = havingRows
    ? new Set(havingRows.map((r) => String(r[groupByCol])))
    : null

  // Map each grouped output row to a bucket
  return groupedRows.map((aggregatedRow): GroupBucket => {
    const groupValue = aggregatedRow[groupByCol]
    const groupKey = String(groupValue)

    // Find all source rows that belong to this group
    const memberRows: StageRow[] = sourceRows
      .filter((r) => String(r[groupByCol]) === groupKey)
      .map((r) => ({
        ...r,
        _rowId: rowKey(r),
        _status: 'normal' as RowStatus,
      }))

    const isRemoved = survivingKeys ? !survivingKeys.has(groupKey) : false

    return {
      groupKey,
      groupByColumn: groupByCol,
      groupByValue: groupValue,
      rows: memberRows,
      aggregatedRow: {
        ...aggregatedRow,
        _rowId: rowKey(aggregatedRow),
        _status: isRemoved ? 'removed' : 'normal',
      },
      isRemoved,
    }
  })
}

/**
 * Extracts the GROUP BY column name from a SQL string.
 * Returns null if no GROUP BY clause found.
 */
export function extractGroupByColumn(sql: string): string | null {
  const match = sql.match(/GROUP\s+BY\s+(\w+)/i)
  return match ? match[1] : null
}