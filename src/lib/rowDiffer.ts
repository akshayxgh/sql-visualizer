import type { Row, StageRow, RowStatus } from '@/types/transformation'

function rowKey(row: Row): string {
  return JSON.stringify(row)
}

export function diffRows(before: Row[], after: Row[]): StageRow[] {
  const afterKeys = new Set(after.map(rowKey))
  const afterKeyOrder = after.map(rowKey)
  
  // Filter the "before" list to only include rows that survived.
  // This lets us compare true relative ordering changes among survivors.
  const inputSurvivors = before.filter(row => afterKeys.has(rowKey(row)))
  const inputSurvivorOrder = inputSurvivors.map(rowKey)

  return before.map((row): StageRow => {
    const key = rowKey(row)
    const existsInAfter = afterKeys.has(key)
    let status: RowStatus = 'normal'
    
    if (!existsInAfter) {
      status = 'removed'
    } else {
      // Find where this row sits relative to other survivors
      const indexInBeforeSurvivors = inputSurvivorOrder.indexOf(key)
      const indexInAfter = afterKeyOrder.indexOf(key)
      
      if (indexInBeforeSurvivors !== indexInAfter) {
        status = 'reordered'
      }
    }
    
    return {
      ...row,
      _rowId: key,
      _status: status,
    }
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
  return {
    kept: diffed.length - removed,
    removed,
  }
}