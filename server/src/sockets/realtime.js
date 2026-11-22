// One place that holds the Socket.IO server, so REST controllers can push live updates:
//   toRoom('k3x-92q', 'chat:message', message)
import { disconnectFromRoomFiles } from './collab.js'

let io = null

export function setIo(server) {
  io = server
}

// Everyone who has this room open joins the Socket.IO room "room:<code>"
export const roomChannel = (code) => `room:${code}`

export function toRoom(code, event, data) {
  io?.to(roomChannel(code)).emit(event, data)
}

// Removed from a room: stop their live updates and close their open files right away,
// so they can't keep reading or typing until they refresh.
export async function kickUser(code, userId) {
  if (!io) return
  for (const socket of await io.in(roomChannel(code)).fetchSockets()) {
    if (socket.data.user.id === userId) socket.data.leaveRoom?.(code)
  }
  await disconnectFromRoomFiles(code, userId)
}

// Room deleted: everyone is out
export async function closeRoom(code) {
  if (!io) return
  for (const socket of await io.in(roomChannel(code)).fetchSockets()) {
    socket.data.leaveRoom?.(code)
  }
  await disconnectFromRoomFiles(code)
}