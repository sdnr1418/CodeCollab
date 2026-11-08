import { useDispatch, useSelector } from 'react-redux'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { removeMember } from './roomsSlice'
import { fetchMessages } from '../chat/chatSlice'

function MembersPanel({ room }) {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const isOwner = room.ownerId === user.id

  // Online members first, then alphabetical
  const members = [...room.members].sort(
    (a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name),
  )

  const handleInvite = async () => {
    await navigator.clipboard?.writeText(room.id)
    toast.success(`Room ID ${room.id} copied`)
  }

  const handleRemove = async (member) => {
    if (!window.confirm(`Remove ${member.name} from this room?`)) return
    await dispatch(removeMember({ roomId: room.id, memberId: member.id })).unwrap()
    dispatch(fetchMessages(room.id)) // shows the "was removed" note in chat
    toast.success(`${member.name} removed`)
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 space-y-1 overflow-auto p-3">
        {members.map((member) => (
          <li
            key={member.id}
            className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-800/60"
          >
            <Avatar user={member} showOnline />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {member.name}
                {member.id === user.id && <span className="ml-1 text-gray-500">(you)</span>}
              </p>
              <p className="text-xs text-gray-500">{member.online ? 'Online' : 'Offline'}</p>
            </div>
            {isOwner && member.id !== user.id ? (
              <button
                onClick={() => handleRemove(member)}
                className="hidden text-xs text-red-400 hover:underline group-hover:block"
              >
                Remove
              </button>
            ) : null}
            <Badge variant={member.role === 'owner' ? 'owner' : 'member'}>
              {member.role === 'owner' ? 'Owner' : 'Member'}
            </Badge>
          </li>
        ))}
      </ul>
      {isOwner && (
        <div className="border-t border-gray-800 p-3">
          <Button variant="secondary" className="w-full" onClick={handleInvite}>
            <UserPlus size={16} /> Invite member
          </Button>
        </div>
      )}
    </div>
  )
}

export default MembersPanel