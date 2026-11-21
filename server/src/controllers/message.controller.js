// Chat history. Step 22 sends new messages live over Socket.IO; this REST version
// loads the history and also works without sockets.
import { Message } from '../models/Message.js'
import { cleanText } from '../utils/sanitize.js'
import { ApiError } from '../utils/ApiError.js'

const SENDER_FIELDS = 'name color'

// GET /api/rooms/:roomId/messages  -> the latest 50, oldest first
export async function listMessages(req, res) {
  const latest = await Message.find({ room: req.room._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('sender', SENDER_FIELDS)
  res.json({ messages: latest.reverse().map((m) => ({ ...m.toJSON(), roomId: req.room.code })) })
}

// POST /api/rooms/:roomId/messages  { text }
export async function sendMessage(req, res) {
  const text = cleanText(req.body.text)
  if (!text) throw new ApiError(400, 'Message is empty')

  const message = await Message.create({ room: req.room._id, sender: req.user._id, text })
  await message.populate('sender', SENDER_FIELDS)
  res.status(201).json({ message: { ...message.toJSON(), roomId: req.room.code } })
}