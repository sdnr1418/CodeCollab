import { db, saveDb } from '../utils/mockDb'
import { mockDelay } from '../utils/mockDelay'

export async function getMessagesForRoom(roomId) {
  return mockDelay(db.messages.filter((m) => m.roomId === roomId))
}

export async function sendMessage({ roomId, user, text }) {
  const message = {
    id: crypto.randomUUID(),
    roomId,
    type: 'message',
    user: { id: user.id, name: user.name, color: user.color },
    text,
    sentAt: new Date().toISOString(),
  }
  db.messages.push(message)
  saveDb()
  return mockDelay(message, 50)
}