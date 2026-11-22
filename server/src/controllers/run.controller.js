// POST /api/rooms/:roomId/run  { language, fileName, code }  (members only)
// Runs the code with Judge0. If the room has a file called input.txt, it's the program's input
// (what cin / input() / Scanner read). The result goes live to everyone in the room.
import { File } from '../models/File.js'
import { RUNNERS, runOnJudge0 } from '../services/judge0.service.js'
import { toRoom } from '../sockets/realtime.js'

export async function runCode(req, res) {
  const { language, fileName, code } = req.body
  const input = await File.findOne({ room: req.room._id, name: 'input.txt' })

  const result = await runOnJudge0({ language, code, stdin: input?.content ?? '' })

  const json = {
    command: RUNNERS[language].command(fileName) + (input ? ' < input.txt' : ''),
    ...result,
    ranBy: { id: req.user.id, name: req.user.name },
  }
  toRoom(req.room.code, 'run:result', json) // same output on everyone's screen
  res.json({ result: json })
}