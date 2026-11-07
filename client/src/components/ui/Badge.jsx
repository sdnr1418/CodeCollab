const VARIANTS = {
  owner: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
  member: 'border-gray-700 bg-gray-800 text-gray-400',
  online: 'border-green-500/40 bg-green-500/10 text-green-400',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  error: 'border-red-500/40 bg-red-500/10 text-red-400',
}

function Badge({ variant = 'member', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium ${VARIANTS[variant]}`}
    >
      {variant === 'online' && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
      {children}
    </span>
  )
}

export default Badge