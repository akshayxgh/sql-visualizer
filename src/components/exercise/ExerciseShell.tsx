'use client'

import { useEffect } from 'react'
import { useSqlEngine } from '@/hooks/useSqlEngine'
import { useExerciseStatus } from '@/hooks/useExerciseStatus'
import { EditorPanel } from '@/components/editor/EditorPanel'
import { TransformationPanel } from '@/components/visualization/TransformationPanel'
import type { Exercise, Dataset } from '@/types/exercise'

interface ExerciseShellProps {
  exercise: Exercise
  dataset: Dataset
}

export function ExerciseShell({ exercise, dataset }: ExerciseShellProps) {
  const engineState = useSqlEngine(exercise, dataset.seedSql)
  const { markComplete } = useExerciseStatus()

  useEffect(() => {
    if (engineState.isCorrect) {
      markComplete(exercise.id)
    }
  }, [engineState.isCorrect, exercise.id, markComplete])

  return (
    <div className="flex-1 grid grid-cols-[1fr_1fr] overflow-hidden">
      <div className="border-r border-neutral-800 overflow-hidden flex flex-col">
        <EditorPanel
          exercise={exercise}
          engineState={engineState}
          engineActions={{
            execute: engineState.execute,
            reset: engineState.reset,
          }}
        />
      </div>
      
      <TransformationPanel
        stages={engineState.stages}
        tableName={dataset.displayName.toLowerCase()}
      />
    </div>
  )
}