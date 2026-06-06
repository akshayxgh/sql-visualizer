import { clsx } from 'clsx'
import { DataTable } from './DataTable'
import type { TransformationStage } from '@/types/transformation'

interface StageCardProps {
  stage: TransformationStage
  columns: string[]
  index: number
  isLast: boolean
  showArrowBefore?: boolean
}

const clauseColors: Record<string, string> = {
  SELECT:   'text-brand-400 border-brand-800 bg-brand-900/30',
  FROM:     'text-brand-400 border-brand-800 bg-brand-900/30',
  WHERE:    'text-red-400   border-red-900   bg-red-950/30',
  'ORDER BY': 'text-amber-400 border-amber-900 bg-amber-950/30',
  LIMIT:    'text-teal-400  border-teal-900  bg-teal-950/30',
}

const clauseDotColors: Record<string, string> = {
  SELECT:     'bg-brand-400',
  FROM:       'bg-brand-400',
  WHERE:      'bg-red-400',
  'ORDER BY': 'bg-amber-400',
  LIMIT:      'bg-teal-400',
}

function ClauseIcon({ keyword }: { keyword: string }) {
  const icons: Record<string, string> = {
    SELECT:     '⊞',
    FROM:       '▤',
    WHERE:      '⊟',
    'ORDER BY': '⇅',
    LIMIT:      '⊠',
  }
  return <span className="text-xs">{icons[keyword] ?? '·'}</span>
}

export function StageCard({
  stage,
  columns,
  index,
  isLast,
  showArrowBefore = false,
}: StageCardProps) {
  const colorClass = clauseColors[stage.clauseKeyword] ?? clauseColors['FROM']
  const dotClass   = clauseDotColors[stage.clauseKeyword] ?? 'bg-neutral-400'

  return (
    <div className="flex flex-col gap-0">
      {/* Renders the top connection arrow pointing from the step above it */}
      {showArrowBefore && (
        <div className="flex items-center justify-center py-1 flex-shrink-0">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-3 bg-neutral-700" />
            <div className="text-neutral-600 text-xs leading-none">▼</div>
          </div>
        </div>
      )}
      
      <div
        className={clsx(
          'rounded-lg border overflow-hidden',
          isLast ? 'border-neutral-700' : 'border-neutral-800'
        )}
      >
        <div
          className={clsx(
            'flex items-center justify-between px-3 py-2.5 border-b border-neutral-800',
            'bg-neutral-900'
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-800 flex-shrink-0">
              <span className="text-xs font-mono text-neutral-500">
                {index + 1}
              </span>
            </div>
            <span
              className={clsx(
                'flex items-center gap-1.5 text-xs font-mono font-medium px-2 py-0.5 rounded border',
                colorClass
              )}
            >
              <span className={clsx('w-1.5 h-1.5 rounded-full', dotClass)} />
              <ClauseIcon keyword={stage.clauseKeyword} />
              {stage.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-emerald-500 bg-emerald-950/50 border border-emerald-900 px-2 py-0.5 rounded">
              {stage.keptCount} kept
            </span>
            {stage.removedCount > 0 && (
              <span className="text-xs font-mono text-red-500 bg-red-950/50 border border-red-900 px-2 py-0.5 rounded">
                {stage.removedCount} removed
              </span>
            )}
          </div>
        </div>
        <div className="bg-neutral-950">
          <DataTable
            columns={columns}
            rows={stage.rows}
            showRemoved
          />
        </div>
      </div>
    </div>
  )
}