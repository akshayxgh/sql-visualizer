import type { TransformationStage } from '@/types/transformation'

interface ExplanationStripProps {
  stages: TransformationStage[]
  tableName: string
}

function sentenceFor(stage: TransformationStage, tableName: string): string {
  switch (stage.clauseKeyword) {
    case 'SELECT':
    case 'FROM':
      return `All ${stage.keptCount} rows loaded from the ${tableName} table.`
    case 'WHERE':
      if (stage.removedCount === 0) {
        return `WHERE matched all rows — nothing was removed.`
      }
      return `WHERE removed ${stage.removedCount} row${stage.removedCount > 1 ? 's' : ''} that didn't match the condition. ${stage.keptCount} row${stage.keptCount !== 1 ? 's' : ''} remain.`
    case 'ORDER BY':
      return `ORDER BY rearranged the ${stage.keptCount} remaining rows. Row count stays the same — only position changes.`
    case 'LIMIT':
      return `LIMIT trimmed the result to ${stage.keptCount} row${stage.keptCount !== 1 ? 's' : ''}.`
    default:
      return `${stage.clauseKeyword} produced ${stage.keptCount} rows.`
  }
}

export function ExplanationStrip({
  stages,
  tableName,
}: ExplanationStripProps) {
  if (stages.length === 0) return null
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden">
      <div className="px-3 py-2 border-b border-neutral-800">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          What happened
        </span>
      </div>
      <ol className="flex flex-col divide-y divide-neutral-800/60">
        {stages.map((stage, i) => (          <li
            key={stage.id}
            className="flex items-start gap-3 px-3 py-2.5"          >            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center mt-0.5">
              <span className="text-xs font-mono text-neutral-500">{i + 1}</span>
            </span>            <span className="text-xs text-neutral-400 leading-relaxed">
              {sentenceFor(stage, tableName)}
            </span>          </li>        ))}
      </ol>
    </div>
  )
}