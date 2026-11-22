// Presence: who has a room open right now. Drives the green "online" dots.
//   client -> server: room:join (code, ack), room:leave (code)
//   server -> client: presence:update { code, userIds }
import { Room } from '../models/Room.js'
import { roomChannel } from './realtime.js'

// room code -> Map(userId -> how many tabs that user has open in the room)
const online = new Map()

const onlineIds = (code) => [...(online.get(code)?.keys() ?? [])]

function addPresence(code, userId) {
  if (!online.has(code)) online.set(code, new Map())
  const tabs = online.get(code)
  tabs.set(userId, (tabs.get(userId) ?? 0) + 1)
}

function removePresence(code, userId) {
  const tabs = online.get(code)
  if (!tabs?.has(userId)) return
  const left = tabs.get(userId) - 1
  if (left > 0) tabs.set(userId, left)
  else tabs.delete(userId)
  if (tabs.size === 0) online.delete(code)
}

export function registerRoomHandlers(io, socket) {
  const user = socket.data.user
  const joined = new Set() // rooms this socket is in

  const broadcastPresence = (code) =>
    io.to(roomChannel(code)).emit('presence:update', { code, userIds: onlineIds(code) })

  const leaveRoom = (code) => {
    if (!joined.delete(code)) return
    socket.leave(roomChannel(code))
    removePresence(code, user.id)
    broadcastPresence(code)
  }
  socket.data.leaveRoom = leaveRoom // used by kickUser / closeRoom in realtime.js

  socket.on('room:join', async (code, ack) => {
    try {
      // Only members may listen to a room, same rule as requireRoomRole('member')
      const room = await Room.findOne({ code: String(code) })
      const isMember = room?.members.some((m) => m.user.equals(user._id))
      if (!isMember) return ack?.({ ok: false })

      if (!joined.has(room.code)) {
        joined.add(room.code)
        socket.join(roomChannel(room.code))
        addPresence(room.code, user.id)
      }
      broadcastPresence(room.code)
      ack?.({ ok: true })
    } catch (err) {
      console.error('room:join failed:', err.message)
      ack?.({ ok: false })
    }
  })

  socket.on('room:leave', (code) => leaveRoom(String(code)))
  socket.on('disconnect', () => [...joined].forEach(leaveRoom))
}