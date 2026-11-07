import { Link } from 'react-router-dom'
import { Clock, Code2 } from 'lucide-react'
import AvatarGroup from '../../components/ui/AvatarGroup'
import Badge from '../../components/ui/Badge'
import { languageLabel } from '../../utils/languages'
import { timeAgo } from '../../utils/formatTime'

function RoomCard({ room, isOwner }) {
  return (
    <Link
      to={`/room/${room.id}`}
      className="flex flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-600 hover:bg-gray-800/60"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{room.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 font-mono text-xs text-gray-500">
            <Code2 size={12} /> {languageLabel(room.language)}
          </p>
        </div>
        <Badge variant={isOwner ? 'owner' : 'member'}>{isOwner ? 'Owner' : 'Member'}</Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-2">
          <AvatarGroup users={room.members} />
          <span className="text-sm">
            {room.members.length} {room.members.length === 1 ? 'member' : 'members'}
          </span>
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <Clock size={12} /> Edited {timeAgo(room.updatedAt)}
        </span>
      </div>
    </Link>
  )
}

export function RoomCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-gray-800" />
          <div className="h-3 w-12 rounded bg-gray-800" />
        </div>
        <div className="h-5 w-12 rounded bg-gray-800" />
      </div>
      <div className="flex justify-between">
        <div className="h-6 w-24 rounded-full bg-gray-800" />
        <div className="h-3 w-20 rounded bg-gray-800" />
      </div>
    </div>
  )
}

export default RoomCard