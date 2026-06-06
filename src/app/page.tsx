import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">
          <span className="text-brand-400">SQL</span>
          <span className="text-neutral-100">Visualizer</span>
        </span>
        <Link href="/learn">
          <Button variant="primary" size="sm">
            Start learning
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-3xl mx-auto">
        <div className="flex gap-2 mb-6">
          <Badge label="Free" variant="topic" />
          <Badge label="No sign-up" variant="tag" />
          <Badge label="Runs in browser" variant="tag" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold text-neutral-100 leading-tight mb-6">
          Stop guessing what{' '}
          <span className="text-brand-400">SQL does</span>.
          <br />
          Watch it happen.
        </h1>

        <p className="text-lg text-neutral-400 leading-relaxed mb-10 max-w-xl">
          Most platforms show you the output. SQL Visualizer shows you the{' '}
          <em>transformation</em> — row by row, clause by clause, as you type.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/learn">
            <Button variant="primary" size="md">
              Start first exercise →
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-neutral-800 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-medium text-neutral-100 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Read the question',
                body: 'Each exercise gives you a plain-English goal and a dataset to work with.',
              },
              {
                step: '02',
                title: 'Type your SQL',
                body: 'Write your query in the editor. No run button — the visualization updates as you type.',
              },
              {
                step: '03',
                title: 'See the transformation',
                body: 'Watch exactly which rows WHERE removed, how ORDER BY rearranged them, and why.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-3">
                <span className="text-xs font-mono text-brand-400">{step}</span>
                <h3 className="text-sm font-medium text-neutral-100">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 px-6 py-5 text-center text-xs text-neutral-600">
        SQL Visualizer · Open source · Built to help beginners finally get it
      </footer>
    </main>
  )
}