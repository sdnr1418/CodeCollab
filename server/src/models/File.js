// A code file inside a room.
import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    content: { type: String, default: '', maxlength: 500_000 }, // about 500 KB of code
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

// No two files with the same name in one room, and fast "all files of this room" lookups
fileSchema.index({ room: 1, name: 1 }, { unique: true })

// The API adds roomId (the room code) itself, because the file only stores the room's _id
fileSchema.set('toJSON', {
  transform: (doc, ret) => ({
    id: ret._id.toString(),
    name: ret.name,
    content: ret.content,
    updatedAt: ret.updatedAt,
  }),
})

export const File = mongoose.model('File', fileSchema)