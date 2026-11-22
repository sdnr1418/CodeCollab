// Chat. Sending goes through REST (validated and cleaned against XSS), then the saved
// message is pushed live to everyone in the room over Socket.IO.
import { Message } from '../models/Message.js'
import { cleanText } from '../utils/sanitize.js'
import { ApiError } from '../utils/ApiError.js'
import { toRoom } from '../sockets/realtime.js'

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
  const json = { ...message.toJSON(), roomId: req.room.code }
  toRoom(req.room.code, 'chat:message', json) // live for everyone else in the room
  res.status(201).json({ message: json })
}