// Phase 1: local mock database. Phase 2: replace each body with a call to the Express API.
import { db, saveDb } from '../utils/mockDb'
import { mockDelay } from '../utils/mockDelay'

const STARTER_FILES = {
  cpp: {
    name: 'main.cpp',
    content:
      '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, team!" << endl;\n  return 0;\n}\n',
  },
  java: {
    name: 'Main.java',
    content:
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, team!");\n  }\n}\n',
  },
  python: { name: 'main.py', content: 'print("Hello, team!")\n' },
  javascript: { name: 'index.js', content: "console.log('Hello, team!')\n" },
}

const asMember = (user, role) => ({
  id: user.id,
  name: user.name,
  color: user.color,
  role,
  online: true,
})

const findRoom = (roomId) => {
  const room = db.rooms.find((r) => r.id === roomId)
  if (!room) throw new Error('Room not found')
  return room
}

const addSystemMessage = (roomId, text) =>
  db.messages.push({
    id: crypto.randomUUID(),
    roomId,
    type: 'system',
    text,
    sentAt: new Date().toISOString(),
  })

export async function getRoomsForUser(userId) {
  const rooms = db.rooms.filter((r) => r.members.some((m) => m.id === userId))
  rooms.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // most recently edited first
  return mockDelay(rooms)
}

export async function getRoom(roomId) {
  return mockDelay(findRoom(roomId))
}

export async function createRoom(name, language, user) {
  const id = Math.random().toString(36).slice(2, 5) + '-' + Math.random().toString(36).slice(2, 5)
  const room = {
    id,
    name,
    language,
    ownerId: user.id,
    members: [asMember(user, 'owner')],
    updatedAt: new Date().toISOString(),
  }
  db.rooms.push(room)
  const starter = STARTER_FILES[language] ?? STARTER_FILES.python
  db.files.push({ id: crypto.randomUUID(), roomId: id, ...starter }) // every new room starts with one file
  saveDb()
  return mockDelay(room)
}

export async function joinRoom(roomId, user) {
  const room = db.rooms.find((r) => r.id === roomId.trim())
  if (!room) throw new Error('No room found with that ID')
  if (room.members.some((m) => m.id === user.id)) throw new Error('You are already in this room')
  room.members.push(asMember(user, 'member'))
  addSystemMessage(room.id, `${user.name} joined the room`)
  saveDb()
  return mockDelay(room)
}

export async function removeMember(roomId, memberId) {
  const room = findRoom(roomId)
  const member = room.members.find((m) => m.id === memberId)
  room.members = room.members.filter((m) => m.id !== memberId)
  addSystemMessage(roomId, `${member?.name ?? 'A member'} was removed from the room`)
  saveDb()
  return mockDelay(room)
}

export async function renameRoom(roomId, name) {
  const room = findRoom(roomId)
  room.name = name
  room.updatedAt = new Date().toISOString()
  saveDb()
  return mockDelay(room)
}

// Only the owner can delete. Its files and chat messages go with it.
export async function deleteRoom(roomId) {
  findRoom(roomId)
  db.rooms = db.rooms.filter((r) => r.id !== roomId)
  db.files = db.files.filter((f) => f.roomId !== roomId)
  db.messages = db.messages.filter((m) => m.roomId !== roomId)
  saveDb()
  return mockDelay(roomId)
}

export async function leaveRoom(roomId, user) {
  const room = findRoom(roomId)
  if (room.ownerId === user.id) throw new Error('The owner cannot leave. Delete the room instead.')
  room.members = room.members.filter((m) => m.id !== user.id)
  addSystemMessage(roomId, `${user.name} left the room`)
  saveDb()
  return mockDelay(roomId)
}