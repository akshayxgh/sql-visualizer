import { clsx } from 'clsx'

type BadgeVariant = 'difficulty-beginner' | 'difficulty-intermediate' | 'difficulty-advanced' | 'topic' | 'tag'

interface BadgeProps {
  label: string
  variant: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  'difficulty-beginner':     'bg-emerald-950 text-emerald-400 border border-emerald-800',
  'difficulty-intermediate': 'bg-amber-950 text-amber-400 border border-amber-800',
  'difficulty-advanced':     'bg-red-950 text-red-400 border border-red-800',
  'topic':                   'bg-brand-900 text-brand-200 border border-brand-800',
  'tag':                     'bg-neutral-900 text-neutral-400 border border-neutral-700',
}

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variantStyles[variant]
      )}
    >
      {label}
    </span>
  )
}