import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DoorOpen, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/ui/ConfirmModal'
import RenameRoomModal from './RenameRoomModal'
import { deleteRoom, leaveRoom } from './roomsSlice'

// The "⋮" menu on a room. The owner can rename or delete; a member can leave.
// afterRemove is where to go once the room is gone (used on the Room page).
function RoomActions({ room, isOwner, afterRemove }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialog, setDialog] = useState(null) // 'rename' | 'delete' | 'leave' | null
  const menuRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Close the menu when you click anywhere outside it
  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e) => !menuRef.current?.contains(e.target) && setMenuOpen(false)
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  const choose = (name) => {
    setMenuOpen(false)
    setDialog(name)
  }

  const handleRemove = async () => {
    const thunk = dialog === 'delete' ? deleteRoom : leaveRoom
    try {
      await dispatch(thunk(room.id)).unwrap()
    } catch (err) {
      toast.error(err.message)
      return
    }
    toast.success(dialog === 'delete' ? `Deleted "${room.name}"` : `You left "${room.name}"`)
    setDialog(null)
    if (afterRemove) navigate(afterRemove)
  }

  const item = 'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-700'

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
        aria-label="Room options"
      >
        <MoreVertical size={16} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-md border border-gray-700 bg-gray-800 py-1 shadow-lg">
          {isOwner ? (
            <>
              <button className={item} onClick={() => choose('rename')}>
                <Pencil size={14} /> Rename
              </button>
              <button className={`${item} text-red-400`} onClick={() => choose('delete')}>
                <Trash2 size={14} /> Delete room
              </button>
            </>
          ) : (
            <button className={`${item} text-red-400`} onClick={() => choose('leave')}>
              <DoorOpen size={14} /> Leave room
            </button>
          )}
        </div>
      )}

      {/* key resets the form each time it opens */}
      {dialog === 'rename' && (
        <RenameRoomModal key={room.id} room={room} open onClose={() => setDialog(null)} />
      )}
      <ConfirmModal
        open={dialog === 'delete'}
        title="Delete room?"
        message={`"${room.name}" and all its files and chat will be deleted for everyone. This can't be undone.`}
        confirmLabel="Delete room"
        onConfirm={handleRemove}
        onClose={() => setDialog(null)}
      />
      <ConfirmModal
        open={dialog === 'leave'}
        title="Leave room?"
        message={`You'll lose access to "${room.name}" until someone shares the room ID with you again.`}
        confirmLabel="Leave room"
        onConfirm={handleRemove}
        onClose={() => setDialog(null)}
      />
    </div>
  )
}

export default RoomActions