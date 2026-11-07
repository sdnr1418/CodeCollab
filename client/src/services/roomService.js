// Phase 1: mock data. Phase 2: replace each body with a call to the Express API.
import { mockRooms } from '../mocks/rooms'
import { mockDelay } from '../utils/mockDelay'

const asMember = (user, role) => ({
  id: user.id,
  name: user.name,
  color: user.color,
  role,
  online: true,
})

export async function getRoomsForUser(userId) {
  return mockDelay(mockRooms.filter((r) => r.members.some((m) => m.id === userId)))
}

export async function getRoom(roomId) {
  const room = mockRooms.find((r) => r.id === roomId)
  if (!room) throw new Error('Room not found')
  return mockDelay(room)
}

export async function createRoom(name, language, user) {
  const id = Math.random().toString(36).slice(2, 5) + '-' + Math.random().toString(36).slice(2, 5)
  const room = {
    id,
    name,
    language,
    ownerId: user.id,
    members: [asMember(user, 'owner')],
    updatedAt: new Date().toISOString(),
  }
  mockRooms.push(room)
  return mockDelay(room)
}

export async function joinRoom(roomId, user) {
  const room = mockRooms.find((r) => r.id === roomId.trim())
  if (!room) throw new Error('No room found with that ID')
  if (room.members.some((m) => m.id === user.id)) throw new Error('You are already in this room')
  room.members.push(asMember(user, 'member'))
  return mockDelay(room)
}