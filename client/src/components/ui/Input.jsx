function Input({ error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <input
        className={`h-10 rounded-md border bg-gray-800 px-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none disabled:opacity-50 ${
          error ? 'border-red-500/60' : 'border-gray-700'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default Input