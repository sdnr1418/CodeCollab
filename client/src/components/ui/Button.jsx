import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-600/50',
  secondary: 'border border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700',
  ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white',
  danger: 'border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20',
}

const SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
}

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}

export default Button