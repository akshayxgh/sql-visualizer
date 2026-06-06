'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { useExerciseStatus } from '@/hooks/useExerciseStatus'
import { ALL_EXERCISES } from '@/data/exercises'
import type { Difficulty } from '@/types/exercise'

export default function LearnPage() {
  const { isCompleted } = useExerciseStatus()

  function isUnlocked(index: number): boolean {
    if (index === 0) return true
    return isCompleted(ALL_EXERCISES[index - 1].id)
  }

  return (
    <main className="min-h-screen bg-neutral-950">
      <nav className="border-b border-neutral-800 px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="text-brand-400">SQL</span>
          <span className="text-neutral-100">Visualizer</span>
        </Link>
        <span className="text-neutral-600 text-sm">/</span>
        <span className="text-sm text-neutral-400">Exercises</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-medium text-neutral-100 mb-2">
          SQL exercises
        </h1>
        <p className="text-sm text-neutral-500">
          Complete each exercise in order. Earlier exercises unlock later ones.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16 flex flex-col gap-3">
        {ALL_EXERCISES.map((exercise, index) => {
          const unlocked = isUnlocked(index)
          const completed = isCompleted(exercise.id)
          return (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              slug={exercise.slug}
              title={exercise.title}
              description={exercise.description}
              difficulty={exercise.difficulty}
              topics={exercise.topics}
              number={index + 1}
              isLocked={!unlocked}
              isCompleted={completed}
            />
          )
        })}
      </div>
    </main>
  )
}

interface ExerciseCardProps {
  id: string
  slug: string
  title: string
  description: string
  difficulty: Difficulty
  topics: string[]
  number: number
  isLocked: boolean
  isCompleted: boolean
}

function ExerciseCard({
  slug,
  title,
  description,
  difficulty,
  topics,
  number,
  isLocked,
  isCompleted,}: ExerciseCardProps) {
  const card = (
    <div
      className={[
        'group flex items-start gap-5 p-5 rounded-lg border transition-colors duration-150',
        isLocked
          ? 'border-neutral-800 bg-neutral-900/30 opacity-50 cursor-not-allowed'
          : 'border-neutral-800 bg-neutral-900/60 hover:border-brand-600 hover:bg-neutral-900 cursor-pointer',
      ].join(' ')}
    >
      <div
        className={[
          'mt-0.5 flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors',
          isCompleted
            ? 'border-emerald-700 bg-emerald-950'
            : 'border-neutral-700',
        ].join(' ')}
      >
        {isCompleted ? (
          <span className="text-emerald-400 text-xs">✓</span>
        ) : (
          <span className="text-xs font-mono text-neutral-500">
            {String(number).padStart(2, '0')}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-medium text-neutral-100 group-hover:text-white transition-colors">
            {title}          </span>
          {isLocked && <span className="text-xs text-neutral-600">🔒</span>}
          {isCompleted && (
            <span className="text-xs text-emerald-600 font-medium">
              Completed
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
          {description}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge label={difficulty} variant={`difficulty-${difficulty}`} />
          {topics.map((topic) => (
            <Badge key={topic} label={topic} variant="topic" />
          ))}
        </div>
      </div>

      {!isLocked && (
        <div className="mt-1 text-neutral-600 group-hover:text-brand-400 transition-colors text-sm">
          →
        </div>
      )}
    </div>
  )

  if (isLocked) return card
  return <Link href={`/exercise/${slug}`}>{card}</Link>
}