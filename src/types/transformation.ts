export type RowStatus = 'normal' | 'removed' | 'added' | 'reordered'

export interface Row {
  [columnName: string]: string | number | null
}

export interface StageRow extends Row {
  _rowId: string       // stable identity key for diffing
  _status: RowStatus
}

export interface TransformationStage {
  id: string           // e.g. 'from', 'where', 'order_by'
  label: string        // e.g. 'FROM employees'
  clauseKeyword: string
  rows: StageRow[]
  keptCount: number
  removedCount: number
}