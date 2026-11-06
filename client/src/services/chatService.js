import { mockMessages } from '../mocks/messages'
import { mockDelay } from '../utils/mockDelay'

export async function getMessagesForRoom(roomId) {
  return mockDelay(mockMessages.filter((m) => m.roomId === roomId))
}