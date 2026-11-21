// Phase 2: rooms come from the Express API (see server/src/routes/room.routes.js).
// A room's id is its short code, e.g. "k3x-92q": it's in the URL and it's what people type to join.
import { api } from '../lib/api'

// Live "online" status arrives with Socket.IO in Step 22.
// Until then, show the logged-in user as online in their own room.
const markMeOnline = (room, me) => ({
  ...room,
  members: room.members.map((m) => ({ ...m, online: m.id === me?.id })),
})

export async function getRoomsForUser() {
  const { data } = await api.get('/rooms')
  return data.rooms // already sorted by most recently edited
}

export async function getRoom(roomId, me) {
  const { data } = await api.get(`/rooms/${roomId}`)
  return markMeOnline(data.room, me)
}

export async function createRoom(name, language, me) {
  const { data } = await api.post('/rooms', { name, language })
  return markMeOnline(data.room, me)
}

export async function joinRoom(code, me) {
  const { data } = await api.post('/rooms/join', { code: code.trim() })
  return markMeOnline(data.room, me)
}

export async function removeMember(roomId, memberId, me) {
  const { data } = await api.delete(`/rooms/${roomId}/members/${memberId}`)
  return markMeOnline(data.room, me)
}

export async function renameRoom(roomId, name, me) {
  const { data } = await api.patch(`/rooms/${roomId}`, { name })
  return markMeOnline(data.room, me)
}

// Only the owner can delete (the server checks)
export async function deleteRoom(roomId) {
  await api.delete(`/rooms/${roomId}`)
  return roomId
}

// Leaving = removing yourself from the members (the server refuses if you're the owner)
export async function leaveRoom(roomId, me) {
  await api.delete(`/rooms/${roomId}/members/${me.id}`)
  return roomId
}