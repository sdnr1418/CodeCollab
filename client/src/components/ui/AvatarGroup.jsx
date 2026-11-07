import Avatar from './Avatar'

function AvatarGroup({ users, max = 3, size = 'sm' }) {
  const shown = users.slice(0, max)
  const extra = users.length - shown.length

  return (
    <div className="flex -space-x-2">
      {shown.map((user) => (
        <Avatar
          key={user.id}
          user={user}
          size={size}
          className="rounded-full ring-2 ring-gray-900"
        />
      ))}
      {extra > 0 && (
        <Avatar
          user={{ name: `+${extra}`, color: 'bg-gray-700' }}
          size={size}
          className="rounded-full ring-2 ring-gray-900"
        />
      )}
    </div>
  )
}

export default AvatarGroup