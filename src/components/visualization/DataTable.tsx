import { clsx } from 'clsx'
import type { StageRow } from '@/types/transformation'

interface DataTableProps {
  columns: string[]
  rows: StageRow[]
  showRemoved?: boolean
}

const cellBase = 'px-3 py-2 text-xs font-mono whitespace-nowrap'

const rowVariants: Record<string, string> = {
  normal:    'text-neutral-300',
  removed:   'text-red-500 opacity-40 line-through',
  reordered: 'text-neutral-300', // Changed from amber to normal white
  added:     'text-emerald-400',
}

const rowBgVariants: Record<string, string> = {
  normal:    '',
  removed:   'bg-red-950/20',
  reordered: '',                  // Stripped out the amber background tint
  added:     'bg-emerald-950/20',
}

export function DataTable({
  columns,
  rows,
  showRemoved = true,
}: DataTableProps) {
  const visibleRows = showRemoved
    ? rows
    : rows.filter((r) => r._status !== 'removed')

  if (visibleRows.length === 0) {
    return (
      <p className="text-xs text-neutral-600 font-mono px-3 py-4">
        No rows match.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-neutral-800">
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, i) => {
            const status = row._status ?? 'normal'
            return (
              <tr
                key={row._rowId ?? i}
                className={clsx(
                  'border-b border-neutral-800/50 last:border-0 transition-colors',
                  rowBgVariants[status]                )}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className={clsx(cellBase, rowVariants[status])}
                  >
                    {row[col] === null || row[col] === undefined
                      ? <span className="text-neutral-600 not-italic">NULL</span>
                      : String(row[col])}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}