'use client'

import { useState, useCallback, useEffect } from 'react'
import { SqlEditor } from './SqlEditor'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/Button'
import type { SqlEngineState, SqlEngineActions, EngineStatus } from '@/hooks/useSqlEngine'
import type { Exercise } from '@/types/exercise'

interface EditorPanelProps {
  exercise: Exercise
  engineState: SqlEngineState
  engineActions: SqlEngineActions
}

function StatusIndicator({
  engineStatus,
  isCorrect,
  stageCount,
}: {
  engineStatus: EngineStatus
  isCorrect: boolean
  stageCount: number
}) {
  if (engineStatus === 'loading') {
    return (
      <span className="text-xs text-neutral-500 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-pulse" />
        Loading database…
      </span>
    )
  }
  if (engineStatus === 'error') {
    return (
      <span className="text-xs text-red-400 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Engine error
      </span>
    )
  }
  if (isCorrect) {
    return (
      <span className="text-xs text-emerald-400 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Correct
      </span>
    )
  }
  if (stageCount > 0) {
    return (
      <span className="text-xs text-neutral-500 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
        Live
      </span>
    )
  }
  return (
    <span className="text-xs text-neutral-600 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
      Ready
    </span>
  )}

function HintPanel({ hints }: { hints: Exercise['hints'] }) {
  const [revealedLevel, setRevealedLevel] = useState(0)
  const nextHint = hints[revealedLevel]

  return (
    <div className="border-t border-neutral-800 px-4 py-3 flex flex-col gap-2">
      {hints.slice(0, revealedLevel).map((hint) => (        <div
          key={hint.level}
          className="text-xs text-neutral-500 leading-relaxed pl-3 border-l border-neutral-700"
        >
          {hint.text}
        </div>
      ))}
      {nextHint && (        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRevealedLevel((l) => l + 1)}
          className="self-start text-neutral-500 hover:text-brand-400 px-0"
        >
          💡 {revealedLevel === 0 ? 'Get a hint' : 'Next hint'} →
        </Button>
      )}
      {revealedLevel >= hints.length && (        <p className="text-xs text-neutral-600">
          No more hints. Check the solution after you've tried.
        </p>
      )}
    </div>
  )
}

function SolutionPanel({
  solution,
  isVisible,
  onToggle,
}: {
  solution: string
  isVisible: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-t border-neutral-800 px-4 py-3">
      <button
        onClick={onToggle}
        className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
      >
        {isVisible ? '▼ Hide solution' : '▶ Show solution'}
      </button>
      {isVisible && (
        <pre className="mt-2 text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre">
          {solution}
        </pre>
      )}
    </div>
  )
}

export function EditorPanel({
  exercise,
  engineState,
  engineActions,
}: EditorPanelProps) {
  const [rawQuery, setRawQuery] = useState(exercise.starterQuery)
  const [showSolution, setShowSolution] = useState(false)
  const debouncedQuery = useDebounce(rawQuery, 400)

  useEffect(() => {
    setRawQuery(exercise.starterQuery)
    setShowSolution(false)
    engineActions.reset()
  }, [exercise.id])

  useEffect(() => {
    if (engineState.status === 'ready') {
      engineActions.execute(debouncedQuery)
    }
  }, [debouncedQuery, engineState.status])

  const handleChange = useCallback((value: string) => {
    setRawQuery(value)
  }, [])

  const handleReset = useCallback(() => {
    setRawQuery(exercise.starterQuery)
    engineActions.reset()
  }, [exercise.starterQuery, engineActions])

  const isDisabled = engineState.status !== 'ready'

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 font-mono">SQL Editor</span>
          <StatusIndicator
            engineStatus={engineState.status}
            isCorrect={engineState.isCorrect}
            stageCount={engineState.stages.length}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isDisabled}
            title="Reset to starter query"
          >
            ↺ Reset
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {engineState.status === 'loading' && (          <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center z-10">
            <span className="text-xs text-neutral-500 font-mono">
              Initializing database…
            </span>          </div>
        )}
        <SqlEditor
          value={rawQuery}
          onChange={handleChange}
          disabled={isDisabled}
        />
      </div>

      {engineState.isCorrect && (        <div className="flex-shrink-0 border-t border-emerald-800 bg-emerald-950/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 sm">✓</span>
            <span className="text-xs text-emerald-300 font-medium">
              Correct! That's exactly right.
            </span>
          </div>
          {exercise.nextExerciseId && (            <a
              href={`/exercise/${getNextSlug(exercise.nextExerciseId)}`}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Next exercise →
            </a>
          )}
        </div>
      )}

      <div className="flex-shrink-0">
        <HintPanel hints={exercise.hints} />
      </div>

      {engineState.isCorrect && (        <div className="flex-shrink-0">
          <SolutionPanel
            solution={exercise.canonicalSolution}
            isVisible={showSolution}
            onToggle={() => setShowSolution((v) => !v)}
          />
        </div>
      )}
    </div>
  )
}

function getNextSlug(nextId: string): string {
  const slugMap: Record<string, string> = {
    'ex-001': 'select-all',
    'ex-002': 'filter-by-department',
    'ex-003': 'sort-by-salary',
    'ex-004': 'filter-and-sort',
    'ex-005': 'select-columns',
    'ex-006': 'count-by-department',
    'ex-007': 'average-salary-by-department',
    'ex-008': 'having-filter-groups',
  }
  return slugMap[nextId] ?? ''
}