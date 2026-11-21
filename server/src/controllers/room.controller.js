// Rooms: list, create, join, view, rename, delete, remove member / leave.
// requireAuth sets req.user; requireRoomRole sets req.room.
import { Room } from '../models/Room.js'
import { ApiError } from '../utils/ApiError.js'
import { makeRoomCode } from '../utils/roomCode.js'

const MEMBER_FIELDS = 'name color'
const withMembers = (room) => room.populate('members.user', MEMBER_FIELDS)

// GET /api/rooms  -> rooms I own or joined, most recently edited first
export async function listMyRooms(req, res) {
  const rooms = await Room.find({ 'members.user': req.user._id })
    .sort({ updatedAt: -1 })
    .populate('members.user', MEMBER_FIELDS)
  res.json({ rooms })
}

// POST /api/rooms  { name, language }  -> I become the owner
export async function createRoom(req, res) {
  const { name, language } = req.body

  // Codes are random, so a clash is very unlikely, but try again if it happens
  let code = makeRoomCode()
  while (await Room.exists({ code })) code = makeRoomCode()

  const room = await Room.create({
    code,
    name,
    language,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  })
  // Step 21 also creates the starter file here (main.cpp, Main.java, ...)

  res.status(201).json({ room: await withMembers(room) })
}

// POST /api/rooms/join  { code }
export async function joinRoom(req, res) {
  const room = await Room.findOne({ code: req.body.code })
  if (!room) throw new ApiError(404, 'No room found with that ID')
  if (room.members.some((m) => m.user.equals(req.user._id))) {
    throw new ApiError(409, 'You are already in this room')
  }

  room.members.push({ user: req.user._id, role: 'member' })
  await room.save()
  res.json({ room: await withMembers(room) })
}

// GET /api/rooms/:roomId  (members only)
export async function getRoom(req, res) {
  res.json({ room: await withMembers(req.room) })
}

// PATCH /api/rooms/:roomId  { name }  (owner only)
export async function renameRoom(req, res) {
  req.room.name = req.body.name
  await req.room.save()
  res.json({ room: await withMembers(req.room) })
}

// DELETE /api/rooms/:roomId  (owner only)
export async function deleteRoom(req, res) {
  await req.room.deleteOne()
  // Step 21 also deletes the room's files and chat messages here
  res.json({ id: req.room.code })
}

// DELETE /api/rooms/:roomId/members/:userId
// The owner can remove anyone except themselves; a member can remove only themselves (= leave).
export async function removeMember(req, res) {
  const { room } = req
  const targetId = req.params.userId
  const isSelf = req.user._id.equals(targetId)
  const isOwner = room.owner.equals(req.user._id)

  if (!isSelf && !isOwner) throw new ApiError(403, 'Only the room owner can remove members')
  if (room.owner.equals(targetId)) {
    throw new ApiError(400, 'The owner cannot leave. Delete the room instead.')
  }
  if (!room.members.some((m) => m.user.equals(targetId))) {
    throw new ApiError(404, 'That person is not in this room')
  }

  room.members = room.members.filter((m) => !m.user.equals(targetId))
  await room.save()
  res.json({ room: await withMembers(room) })
}