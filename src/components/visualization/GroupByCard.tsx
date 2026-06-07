import { clsx } from 'clsx'
import type { GroupBucket, TransformationStage } from '@/types/transformation'

interface GroupByCardProps {
  stage: TransformationStage
  index: number
}

interface BucketProps {
  bucket: GroupBucket
  aggregatedColumns: string[]
}

function GroupBucket({ bucket, aggregatedColumns }: BucketProps) {
  const isRemoved = bucket.isRemoved

  return (
    <div
      className={clsx(
        'rounded-lg border overflow-hidden transition-opacity',
        isRemoved
          ? 'border-red-900/50 opacity-40'
          : 'border-neutral-700'
      )}
    >
      {/* Group header */}
      <div
        className={clsx(
          'px-3 py-2 flex items-center justify-between border-b',
          isRemoved
            ? 'bg-red-950/30 border-red-900/40'
            : 'bg-neutral-800/60 border-neutral-700'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-mono">
            {bucket.groupByColumn} =
          </span>
          <span
            className={clsx(
              'text-xs font-mono font-medium px-2 py-0.5 rounded border',
              isRemoved
                ? 'text-red-400 bg-red-950/40 border-red-800'
                : 'text-amber-300 bg-amber-950/30 border-amber-800'
            )}
          >
            &quot;{bucket.groupByValue}&quot;
          </span>
        </div>
        <span className="text-xs text-neutral-600">
          {bucket.rows.length} row{bucket.rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Source rows (collapsed into group) */}
      <div className="bg-neutral-950 divide-y divide-neutral-800/50">
        {bucket.rows.map((row, i) => (
          <div
            key={i}
            className="px-3 py-1.5 flex items-center gap-3"
          >
            {/* Indent indicator */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="w-px h-3 bg-neutral-700" />
              <div className="w-1.5 h-px bg-neutral-700" />
            </div>
            <div className="flex gap-4 flex-wrap">
              {Object.entries(row)
                .filter(([k]) => !k.startsWith('_'))
                .map(([col, val]) => (
                  <span key={col} className="text-xs font-mono text-neutral-500">
                    <span className="text-neutral-600">{col}:</span>{' '}
                    <span className="text-neutral-400">{String(val)}</span>
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Aggregated output row */}
      <div
        className={clsx(
          'border-t px-3 py-2 flex items-center gap-3',
          isRemoved
            ? 'border-red-900/40 bg-red-950/20'
            : 'border-neutral-700 bg-neutral-900/60'
        )}
      >
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-xs text-neutral-600">→</span>
        </div>
        <div className="flex gap-4 flex-wrap">
          {aggregatedColumns.map((col) => (
            <span key={col} className="text-xs font-mono">
              <span className="text-neutral-600">{col}:</span>{' '}
              <span
                className={clsx(
                  'font-medium',
                  isRemoved ? 'text-red-400 line-through' : 'text-emerald-400'
                )}
              >
                {String(bucket.aggregatedRow[col] ?? 'NULL')}
              </span>
            </span>
          ))}
        </div>
        {isRemoved && (
          <span className="ml-auto text-xs text-red-500 bg-red-950/50 border border-red-900 px-2 py-0.5 rounded">
            removed by HAVING
          </span>
        )}
      </div>
    </div>
  )
}

export function GroupByCard({ stage, index }: GroupByCardProps) {
  const buckets = stage.groups ?? []

  // Derive aggregated column names from the first surviving bucket's aggregatedRow
  const firstBucket = buckets[0]
  const aggregatedColumns = firstBucket
    ? Object.keys(firstBucket.aggregatedRow).filter((k) => !k.startsWith('_'))
    : []

  const hasHaving = buckets.some((b) => b.isRemoved)

  return (
    <div className="flex flex-col gap-0">
      {/* Connector arrow */}
      {index > 0 && (
        <div className="flex items-center justify-center py-1">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-3 bg-neutral-700" />
            <div className="text-neutral-600 text-xs leading-none">▼</div>
          </div>
        </div>
      )}

      {/* Card */}
      <div className="rounded-lg border border-neutral-700 overflow-hidden">
        {/* Card header */}
        <div className="bg-neutral-900 px-3 py-2.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Step number */}
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-800 flex-shrink-0">
              <span className="text-xs font-mono text-neutral-500">{index + 1}</span>
            </div>
            {/* Clause badge */}
            <span className="flex items-center gap-1.5 text-xs font-mono font-medium px-2 py-0.5 rounded border text-amber-400 border-amber-900 bg-amber-950/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              ⊕ {stage.label}
            </span>
            {hasHaving && (
              <span className="text-xs font-mono px-2 py-0.5 rounded border text-red-400 border-red-900 bg-red-950/30">
                + HAVING
              </span>
            )}
          </div>

          {/* Group count badges */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-emerald-500 bg-emerald-950/50 border border-emerald-900 px-2 py-0.5 rounded">
              {stage.keptCount} group{stage.keptCount !== 1 ? 's' : ''}
            </span>
            {stage.removedCount > 0 && (
              <span className="text-xs font-mono text-red-500 bg-red-950/50 border border-red-900 px-2 py-0.5 rounded">
                {stage.removedCount} removed
              </span>
            )}
          </div>
        </div>

        {/* Group explanation */}
        <div className="bg-neutral-950/50 px-3 py-2 border-b border-neutral-800">
          <p className="text-xs text-neutral-500">
            {buckets.length} group{buckets.length !== 1 ? 's' : ''} formed
            by <span className="font-mono text-amber-400">{stage.groupByColumn}</span>.
            Each group collapses its rows into one aggregated result.
            {hasHaving && (
              <span className="text-red-400">
                {' '}HAVING filters groups after aggregation.
              </span>
            )}
          </p>
        </div>

        {/* Group buckets */}
        <div className="p-3 flex flex-col gap-3 bg-neutral-950">
          {buckets.map((bucket) => (
            <GroupBucket
              key={bucket.groupKey}
              bucket={bucket}
              aggregatedColumns={aggregatedColumns}
            />
          ))}
        </div>
      </div>
    </div>
  )
}