import { initials } from '../../utils/initials'

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
}

// user = { name, color } where color is a Tailwind bg class, e.g. 'bg-pink-600'
function Avatar({ user, size = 'md', showOnline = false, className = '' }) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`} title={user.name}>
      <span
        className={`inline-flex items-center justify-center rounded-full font-semibold text-white ${SIZES[size]} ${user.color}`}
      >
        {initials(user.name)}
      </span>
      {showOnline && user.online && (
        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-gray-900 bg-green-500" />
      )}
    </span>
  )
}

export default Avatar