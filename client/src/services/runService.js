// Phase 2: the Run button sends the open file to our server, which runs it with Judge0
// (see server/src/services/judge0.service.js). The result also goes live to the whole room.
import { api } from '../lib/api'

export async function runCode(roomId, fileName, language, code) {
  // Longer than the usual 15 s: the server waits up to 20 s for Judge0, and we want its message
  const { data } = await api.post(`/rooms/${roomId}/run`, { language, fileName, code }, { timeout: 30000 })
  return data.result // { command, stdout, stderr, exitCode, timeMs, ranBy }
}