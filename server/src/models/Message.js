// A chat message in a room. type 'system' = notes like "Leo joined the room" (no sender).
import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    type: { type: String, enum: ['message', 'system'], default: 'message' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

messageSchema.index({ room: 1, createdAt: -1 }) // "latest 50 messages of this room"

// Same shape as the Phase 1 mock messages. Populate 'sender' first so it has name and color.
messageSchema.set('toJSON', {
  transform: (doc, ret) => ({
    id: ret._id.toString(),
    type: ret.type,
    ...(ret.sender && {
      user: {
        id: (ret.sender.id ?? ret.sender._id ?? ret.sender).toString(),
        name: ret.sender.name,
        color: ret.sender.color,
      },
    }),
    text: ret.text,
    sentAt: ret.createdAt,
  }),
})

export const Message = mongoose.model('Message', messageSchema)

// Adds a "Leo joined the room" style note
export const addSystemMessage = (roomId, text) => Message.create({ room: roomId, type: 'system', text })