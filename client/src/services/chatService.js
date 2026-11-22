// Phase 2: chat messages live in MongoDB (see server/src/routes/message.routes.js).
// The server adds who sent it (from your login cookie) and cleans the text against XSS.
import { api } from '../lib/api'

export async function getMessagesForRoom(roomId) {
  const { data } = await api.get(`/rooms/${roomId}/messages`)
  return data.messages // latest 50, oldest first
}

export async function sendMessage({ roomId, text }) {
  const { data } = await api.post(`/rooms/${roomId}/messages`, { text })
  return data.message
}