export type RowStatus = 'normal' | 'removed' | 'added' | 'reordered'

export type StageType = 'flat' | 'grouped'

export interface Row {
  [columnName: string]: string | number | null
}

export interface StageRow extends Row {
  _rowId: string
  _status: RowStatus
}

// A single group bucket produced by GROUP BY
export interface GroupBucket {
  groupKey: string              // e.g. "Sales"
  groupByColumn: string         // e.g. "department"
  groupByValue: string | number | null
  rows: StageRow[]              // source rows that belong to this group
  aggregatedRow: StageRow       // the single output row after aggregation
  isRemoved: boolean            // true if HAVING filtered this group out
}

export interface TransformationStage {
  id: string
  label: string
  clauseKeyword: string
  stageType: StageType          // 'flat' for SELECT/WHERE/ORDER BY, 'grouped' for GROUP BY/HAVING

  // Flat stage fields
  rows: StageRow[]
  keptCount: number
  removedCount: number

  // Grouped stage fields (populated when stageType === 'grouped')
  groups?: GroupBucket[]
  groupByColumn?: string
}