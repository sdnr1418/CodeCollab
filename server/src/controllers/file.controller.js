// Files inside a room. requireRoomRole('member') has already checked access and set req.room.
import { File } from '../models/File.js'
import { Room } from '../models/Room.js'
import { ApiError } from '../utils/ApiError.js'

// The API shape the client uses: { id, roomId, name, content, updatedAt }
const toClient = (file, room) => ({ ...file.toJSON(), roomId: room.code })

// "Edited 2 min ago" on the dashboard comes from the room's updatedAt
const touchRoom = (room) =>
  Room.updateOne({ _id: room._id }, { $set: { updatedAt: new Date() } }, { timestamps: false })

// MongoDB error 11000 = the unique index on { room, name } was hit
const isDuplicateName = (err) => err?.code === 11000

const findFile = async (req) => {
  const file = await File.findOne({ _id: req.params.fileId, room: req.room._id })
  if (!file) throw new ApiError(404, 'File not found')
  return file
}

// GET /api/rooms/:roomId/files
export async function listFiles(req, res) {
  const files = await File.find({ room: req.room._id }).sort({ createdAt: 1 })
  res.json({ files: files.map((f) => toClient(f, req.room)) })
}

// POST /api/rooms/:roomId/files  { name, content? }
export async function createFile(req, res) {
  try {
    const file = await File.create({
      room: req.room._id,
      name: req.body.name,
      content: req.body.content ?? '',
      updatedBy: req.user._id,
    })
    await touchRoom(req.room)
    res.status(201).json({ file: toClient(file, req.room) })
  } catch (err) {
    if (isDuplicateName(err)) throw new ApiError(409, `A file named ${req.body.name} already exists`)
    throw err
  }
}

// PATCH /api/rooms/:roomId/files/:fileId  { name?, content? }
export async function updateFile(req, res) {
  const file = await findFile(req)
  if (req.body.name !== undefined) file.name = req.body.name
  if (req.body.content !== undefined) file.content = req.body.content
  file.updatedBy = req.user._id
  try {
    await file.save()
  } catch (err) {
    if (isDuplicateName(err)) throw new ApiError(409, `A file named ${req.body.name} already exists`)
    throw err
  }
  await touchRoom(req.room)
  res.json({ file: toClient(file, req.room) })
}

// PATCH /api/rooms/:roomId/files  { changes: [{ id, content }] }  (the Save button)
export async function saveFiles(req, res) {
  const saved = []
  for (const { id, content } of req.body.changes) {
    const result = await File.updateOne(
      { _id: id, room: req.room._id }, // only files in this room
      { $set: { content, updatedBy: req.user._id } },
    )
    if (result.matchedCount > 0) saved.push(id)
  }
  await touchRoom(req.room)
  res.json({ saved })
}

// DELETE /api/rooms/:roomId/files/:fileId
export async function deleteFile(req, res) {
  const file = await findFile(req)
  await file.deleteOne()
  await touchRoom(req.room)
  res.json({ id: file.id })
}