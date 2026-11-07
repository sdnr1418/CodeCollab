import { mockFiles } from '../mocks/files'
import { mockDelay } from '../utils/mockDelay'

export async function getFilesForRoom(roomId) {
  return mockDelay(mockFiles.filter((f) => f.roomId === roomId))
}