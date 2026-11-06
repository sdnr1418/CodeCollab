import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'

function RoomCard({ room, isOwner }) {
  return (
    <Link
      to={`/room/${room.id}`}
      className="block rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-indigo-500"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium">{room.name}</h3>
        <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
          {isOwner ? 'Owner' : 'Member'}
        </span>
      </div>
      <p className="mt-3 flex items-center gap-1 text-sm text-gray-400">
        <Users size={14} /> {room.members.length} members
      </p>
    </Link>
  )
}

export default RoomCard