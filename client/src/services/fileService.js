import { db, saveDb } from '../utils/mockDb'
import { mockDelay } from '../utils/mockDelay'

const touchRoom = (roomId) => {
  const room = db.rooms.find((r) => r.id === roomId)
  if (room) room.updatedAt = new Date().toISOString() // drives "Edited 2 min ago" on the dashboard
}

const assertNameFree = (roomId, name, exceptId) => {
  if (db.files.some((f) => f.roomId === roomId && f.name === name && f.id !== exceptId)) {
    throw new Error(`A file named ${name} already exists`)
  }
}

export async function getFilesForRoom(roomId) {
  return mockDelay(db.files.filter((f) => f.roomId === roomId))
}

export async function createFile(roomId, name) {
  assertNameFree(roomId, name)
  const file = { id: crypto.randomUUID(), roomId, name, content: '' }
  db.files.push(file)
  touchRoom(roomId)
  saveDb()
  return mockDelay(file, 100)
}

export async function renameFile(id, name) {
  const file = db.files.find((f) => f.id === id)
  assertNameFree(file.roomId, name, id)
  file.name = name
  touchRoom(file.roomId)
  saveDb()
  return mockDelay(file, 100)
}

export async function deleteFile(id) {
  const file = db.files.find((f) => f.id === id)
  db.files = db.files.filter((f) => f.id !== id)
  touchRoom(file.roomId)
  saveDb()
  return mockDelay(id, 100)
}

// changes = [{ id, content }] for every file with unsaved edits
export async function saveFiles(roomId, changes) {
  changes.forEach(({ id, content }) => {
    const file = db.files.find((f) => f.id === id)
    if (file) file.content = content
  })
  touchRoom(roomId)
  saveDb()
  return mockDelay(
    changes.map((c) => c.id),
    200,
  )
}