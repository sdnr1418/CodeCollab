import { useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { renameRoom } from './roomsSlice'

function RenameRoomModal({ room, open, onClose }) {
  const [name, setName] = useState(room.name)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Give your room a name')
    if (trimmed === room.name) return onClose()
    setLoading(true)
    await dispatch(renameRoom({ roomId: room.id, name: trimmed })).unwrap()
    setLoading(false)
    toast.success('Room renamed')
    onClose()
  }

  return (
    <Modal open={open} title="Rename room" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-gray-400">
          Room name
          <Input
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            error={error}
          />
        </label>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save name
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default RenameRoomModal