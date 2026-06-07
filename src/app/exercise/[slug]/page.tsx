import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getExerciseBySlug } from '@/data/exercises'
import { getDataset } from '@/data/datasets'
import { Badge } from '@/components/ui/Badge'
import { ExerciseShell } from '@/components/exercise/ExerciseShell'
import { RouteGuard } from '@/components/exercise/RouteGuard'

interface ExercisePageProps {
  params: Promise<{ slug: string }>
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { slug } = await params
  const exercise = getExerciseBySlug(slug)
  if (!exercise) notFound()

  const dataset = getDataset(exercise.datasetId)

  return (
    <RouteGuard exerciseId={exercise.id}>
      <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
        {/* Navbar */}
        <nav className="border-b border-neutral-800 px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="text-brand-400">SQL</span>
            <span className="text-neutral-100">Visualizer</span>
          </Link>
          <span className="text-neutral-600 text-sm">/</span>
          <Link
            href="/learn"
            className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Exercises
          </Link>
          <span className="text-neutral-600 text-sm">/</span>
          <span className="text-sm text-neutral-400 font-mono">{slug}</span>
        </nav>

        {/* Three-panel layout */}
        <div className="flex-1 grid grid-cols-[300px_1fr] overflow-hidden">
          {/* Panel 1 — Question + Schema */}
          <aside className="border-r border-neutral-800 flex flex-col overflow-y-auto scrollbar-thin">
            {/* Question */}
            <div className="p-5 border-b border-neutral-800">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge
                  label={exercise.difficulty}
                  variant={`difficulty-${exercise.difficulty}`}
                />
                {exercise.topics.map((topic) => (
                  <Badge key={topic} label={topic} variant="topic" />
                ))}
              </div>
              <h1 className="text-sm font-medium text-neutral-100 mb-2 leading-snug">
                {exercise.title}
              </h1>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {exercise.description}
              </p>
            </div>
            {/* Learning objectives */}
            <div className="p-5 border-b border-neutral-800">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                You will learn
              </p>
              <ul className="flex flex-col gap-2">
                {exercise.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-400 text-xs mt-0.5 flex-shrink-0">·</span>
                    <span className="text-xs text-neutral-400 leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Schema */}
            <div className="p-5">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                Schema
              </p>
              <div className="rounded-md border border-neutral-800 overflow-hidden">
                <div className="bg-neutral-900 px-3 py-2 border-b border-neutral-800">
                  <span className="text-xs font-mono text-brand-400">
                    {dataset.displayName.toLowerCase()}
                  </span>
                </div>
                {dataset.columns.map((col) => (
                  <div
                    key={col.name}
                    className="flex items-center justify-between px-3 py-2 border-b border-neutral-800/60 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      {col.isPrimaryKey && (
                        <span className="text-amber-500 text-xs" title="Primary key">
                          🔑
                        </span>
                      )}
                      <span className="text-xs font-mono text-neutral-200">
                        {col.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-600">
                      {col.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Panels 2 + 3 — client shell (editor + visualization) */}
          <ExerciseShell exercise={exercise} dataset={dataset} />
        </div>
      </div>
    </RouteGuard>
  )
}