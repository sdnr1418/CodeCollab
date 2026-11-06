import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MainLayout from '../components/layout/MainLayout'
import RoomCard from '../features/rooms/RoomCard'
import { fetchRooms } from '../features/rooms/roomsSlice'

function DashboardPage() {
  const user = useSelector((state) => state.auth.user)
  const { items, status } = useSelector((state) => state.rooms)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchRooms(user.id))
  }, [dispatch, user.id])

  const owned = items.filter((r) => r.ownerId === user.id)
  const joined = items.filter((r) => r.ownerId !== user.id)

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Your projects</h1>
        {status === 'loading' && <p className="text-gray-400">Loading…</p>}
        {[
          ['Owned', owned],
          ['Joined', joined],
        ].map(([label, rooms]) => (
          <section key={label} className="mb-8">
            <h2 className="mb-3 text-sm uppercase tracking-wide text-gray-500">{label}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} isOwner={room.ownerId === user.id} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </MainLayout>
  )
}

export default DashboardPage