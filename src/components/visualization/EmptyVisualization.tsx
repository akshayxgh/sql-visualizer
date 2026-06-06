export function EmptyVisualization() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="w-12 h-12 rounded-xl border border-neutral-800 bg-neutral-900 flex items-center justify-center text-xl">
        ⊞
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-neutral-300">
          Start typing to see the transformation
        </p>
        <p className="text-xs text-neutral-600 leading-relaxed max-w-xs">
          As you write SQL, each clause will appear here as a visual step showing exactly what happened to the data.
        </p>
      </div>
      <div className="flex flex-col gap-1.5 text-left w-full max-w-xs">
        {[
          { clause: 'FROM',     color: 'text-brand-400', desc: 'loads all rows' },
          { clause: 'WHERE',    color: 'text-red-400',   desc: 'removes rows' },
          { clause: 'ORDER BY', color: 'text-amber-400', desc: 'rearranges rows' },
        ].map(({ clause, color, desc }) => (
          <div key={clause} className="flex items-center gap-2">
            <span className={`text-xs font-mono font-medium ${color} w-20 flex-shrink-0`}>
              {clause}
            </span>
            <span className="text-xs text-neutral-600">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}