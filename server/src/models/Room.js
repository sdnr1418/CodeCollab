// A coding room. Members are stored inside the room with their role.
import mongoose from 'mongoose'

export const LANGUAGES = ['cpp', 'java', 'python', 'javascript']

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const roomSchema = new mongoose.Schema(
  {
    // Public ID used in URLs and for joining, e.g. "k3x-92q"
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    language: { type: String, enum: LANGUAGES, default: 'python' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
  },
  { timestamps: true }, // createdAt + updatedAt (the dashboard sorts by updatedAt)
)

// "Which rooms is this user in?" runs on every dashboard load, so index it (Lecture 27)
roomSchema.index({ 'members.user': 1, updatedAt: -1 })

// What the API sends: the same shape the Phase 1 mock rooms had.
// Call room.populate('members.user', 'name color') first so members have names.
roomSchema.set('toJSON', {
  transform: (doc, ret) => ({
    id: ret.code,
    name: ret.name,
    language: ret.language,
    ownerId: ret.owner.toString(),
    members: ret.members.map((m) => ({
      id: (m.user.id ?? m.user._id ?? m.user).toString(),
      name: m.user.name,
      color: m.user.color,
      role: m.role,
      online: false, // live presence comes with Socket.IO in Step 22
    })),
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  }),
})

export const Room = mongoose.model('Room', roomSchema)