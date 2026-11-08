import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FolderPlus, LogIn, Plus } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import Button from '../components/ui/Button'
import RoomCard, { RoomCardSkeleton } from '../features/rooms/RoomCard'
import CreateRoomModal from '../features/rooms/CreateRoomModal'
import JoinRoomModal from '../features/rooms/JoinRoomModal'
import { fetchRooms } from '../features/rooms/roomsSlice'
import { resetDb } from '../utils/mockDb'

function RoomSection({ title, rooms, userId, loading }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-sm font-semibold">
        {title}{' '}
        <span className="ml-1 font-normal text-gray-500">{loading ? '' : rooms.length}</span>
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [1, 2, 3].map((n) => <RoomCardSkeleton key={n} />)
          : rooms.map((room) => (
              <RoomCard key={room.id} room={room} isOwner={room.ownerId === userId} />
            ))}
      </div>
    </section>
  )
}

function DashboardPage() {
  const user = useSelector((state) => state.auth.user)
  const { items, status } = useSelector((state) => state.rooms)
  const dispatch = useDispatch()
  const [modal, setModal] = useState(null) // 'create' | 'join' | null

  useEffect(() => {
    dispatch(fetchRooms(user.id))
  }, [dispatch, user.id])

  const loading = status === 'loading'
  const owned = items.filter((r) => r.ownerId === user.id)
  const joined = items.filter((r) => r.ownerId !== user.id)
  const closeModal = () => setModal(null)

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Your projects</h1>
            <p className="mt-1 text-sm text-gray-400">
              {loading ? 'Loading…' : `${items.length} rooms`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModal('join')}>
              <LogIn size={16} /> Join room
            </Button>
            <Button onClick={() => setModal('create')}>
              <Plus size={16} /> Create room
            </Button>
          </div>
        </div>

        {!loading && items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-gray-800 py-16 text-center">
            <FolderPlus size={32} className="text-gray-600" />
            <h2 className="font-semibold">No rooms yet</h2>
            <p className="max-w-xs text-sm text-gray-400">
              Create a room to start coding, or join one with an ID from a teammate.
            </p>
            <Button className="mt-2" onClick={() => setModal('create')}>
              <Plus size={16} /> Create your first room
            </Button>
          </div>
        ) : (
          <>
            <RoomSection title="Owned" rooms={owned} userId={user.id} loading={loading} />
            <RoomSection title="Joined" rooms={joined} userId={user.id} loading={loading} />
          </>
        )}

        <p className="mt-4 text-center text-xs text-gray-600">
          Demo data is saved in this browser.{' '}
          <button
            onClick={() =>
              window.confirm('Reset all rooms, files and chats to the sample data?') && resetDb()
            }
            className="underline hover:text-gray-400"
          >
            Reset demo data
          </button>
        </p>
      </div>

      <CreateRoomModal open={modal === 'create'} onClose={closeModal} />
      <JoinRoomModal open={modal === 'join'} onClose={closeModal} />
    </MainLayout>
  )
}

export default DashboardPage