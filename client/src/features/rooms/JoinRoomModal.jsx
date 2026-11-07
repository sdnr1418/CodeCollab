import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { joinRoom } from './roomsSlice'

function JoinRoomModal({ open, onClose }) {
  const [roomId, setRoomId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!roomId.trim()) return setError('Enter a room ID')
    setLoading(true)
    try {
      const room = await dispatch(joinRoom(roomId)).unwrap()
      toast.success(`Joined ${room.name}`)
      onClose()
      navigate(`/room/${room.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} title="Join room" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-gray-400">
          Room ID or invite code
          <Input
            autoFocus
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value)
              setError('')
            }}
            placeholder="e.g. w4n-63h"
            className="font-mono"
            error={error}
          />
        </label>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Join room
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default JoinRoomModal