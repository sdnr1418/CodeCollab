import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { LANGUAGES } from '../../utils/languages'
import { createRoom } from './roomsSlice'

function CreateRoomModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [language, setLanguage] = useState('cpp')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Give your room a name')
    setLoading(true)
    const room = await dispatch(createRoom({ name: name.trim(), language })).unwrap()
    setLoading(false)
    toast.success('Room created')
    onClose()
    navigate(`/room/${room.id}`)
  }

  return (
    <Modal open={open} title="Create room" onClose={onClose}>
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
            placeholder="e.g. Graph Algorithms Lab"
            error={error}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-gray-400">
          Main language
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 rounded-md border border-gray-700 bg-gray-800 px-3 text-sm text-gray-100 focus:border-indigo-500 focus:outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create room
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateRoomModal