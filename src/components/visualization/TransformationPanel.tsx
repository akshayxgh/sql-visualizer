'use client'

import { StageCard } from './StageCard'
import { GroupByCard } from './GroupByCard'
import { ExplanationStrip } from './ExplanationStrip'
import { EmptyVisualization } from './EmptyVisualization'
import type { TransformationStage } from '@/types/transformation'

interface TransformationPanelProps {
  stages: TransformationStage[]
  tableName: string
}

function extractColumns(stages: TransformationStage[]): string[] {
  if (stages.length === 0) return []
  const firstFlat = stages.find((s) => s.stageType === 'flat' && s.rows.length > 0)
  if (!firstFlat) return []
  return Object.keys(firstFlat.rows[0]).filter((k) => !k.startsWith('_'))
}

export function TransformationPanel({ stages, tableName }: TransformationPanelProps) {
  const columns = extractColumns(stages)
  const reversedStages = [...stages].reverse()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs text-neutral-500">Transformation</span>
        {stages.length > 0 && (
          <span className="text-xs font-mono text-neutral-600">
            {stages.length} stage{stages.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {stages.length === 0 ? (
        <EmptyVisualization />
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-0">
            {reversedStages.map((stage, reversedIndex) => {
              const originalIndex = stages.length - 1 - reversedIndex
              return stage.stageType === 'grouped' ? (
                <GroupByCard key={stage.id} stage={stage} index={originalIndex} />
              ) : (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  columns={columns}
                  index={originalIndex}
                  isLast={reversedIndex === reversedStages.length - 1}
                  showArrowBefore={reversedIndex > 0}
                />
              )
            })}
          </div>
          <ExplanationStrip stages={stages} tableName={tableName} />
          <div className="h-4" />
        </div>
      )}
    </div>
  )
}