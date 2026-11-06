import { mockRooms } from '../mocks/rooms'
import { mockDelay } from '../utils/mockDelay'

export async function getRoomsForUser(userId) {
  return mockDelay(mockRooms.filter((r) => r.members.some((m) => m.userId === userId)))
}

export async function createRoom(name, ownerId) {
  return mockDelay({
    id: crypto.randomUUID(),
    name,
    ownerId,
    members: [{ userId: ownerId, role: 'owner' }],
    updatedAt: new Date().toISOString(),
  })
}