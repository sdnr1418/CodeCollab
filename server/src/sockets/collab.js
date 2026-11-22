// Live editing with Yjs. Every open file is a shared Yjs document, synced by y-socket.io
// over our Socket.IO server (namespace "/yjs|<fileId>"). The text lives in doc.getText('monaco').
//
// - The first person to open a file loads its content from MongoDB.
// - While people type, the file is saved to MongoDB a moment after they pause.
// - When the last person closes it, it's saved once more and dropped from memory.
import mongoose from 'mongoose'
import { YSocketIO } from 'y-socket.io/dist/server'
import { File } from '../models/File.js'
import { Room } from '../models/Room.js'
import { socketAuth } from './socketAuth.js'

const SAVE_DELAY_MS = 1500
const NAMESPACE_PREFIX = '/yjs|'

let io = null
let ysocketio = null
const fileRoom = new Map() // file id -> room code, so kickUser can close a room's files
const saveTimers = new Map()

const textOf = (doc) => doc.getText('monaco')

async function saveDoc(doc) {
  await File.updateOne({ _id: doc.name }, { $set: { content: textOf(doc).toString() } })
}

// Only logged-in members of the file's room may open it
async function requireFileMember(socket, next) {
  try {
    const fileId = socket.nsp.name.slice(NAMESPACE_PREFIX.length)
    if (!mongoose.isValidObjectId(fileId)) throw new Error('Bad file id')
    const file = await File.findById(fileId)
    const room = file && (await Room.findById(file.room))
    const isMember = room?.members.some((m) => m.user.equals(socket.data.user._id))
    if (!isMember) throw new Error('Not a member')
    fileRoom.set(fileId, room.code)
    next()
  } catch {
    next(new Error('File not found'))
  }
}

export function initCollab(server) {
  io = server
  ysocketio = new YSocketIO(io)

  // y-socket.io calls bindState when a document is first opened and writeState when the
  // last person leaves. This is the same shape as its built-in LevelDB storage, but in MongoDB.
  ysocketio.persistence = {
    provider: null,
    bindState: async (fileId, doc) => {
      const file = await File.findById(fileId)
      if (file?.content) textOf(doc).insert(0, file.content)
    },
    writeState: async (fileId, doc) => {
      clearTimeout(saveTimers.get(fileId))
      saveTimers.delete(fileId)
      await saveDoc(doc)
    },
  }

  ysocketio.initialize()
  ysocketio.nsp.use(socketAuth)
  ysocketio.nsp.use(requireFileMember)

  // Save a moment after people stop typing, instead of on every key press
  ysocketio.on('document-update', (doc) => {
    clearTimeout(saveTimers.get(doc.name))
    saveTimers.set(
      doc.name,
      setTimeout(() => {
        saveTimers.delete(doc.name)
        saveDoc(doc).catch((err) => console.error('Autosave failed:', err.message))
      }, SAVE_DELAY_MS),
    )
  })

  // Last person left: forget the document, so the next visitor loads the saved version
  ysocketio.on('all-document-connections-closed', (doc) => {
    ysocketio.documents.delete(doc.name)
    fileRoom.delete(doc.name)
  })
}

// Closes the live files of a room for one user (removed) or for everyone (room deleted)
export async function disconnectFromRoomFiles(code, userId = null) {
  if (!ysocketio) return
  for (const [fileId, roomCode] of fileRoom) {
    if (roomCode !== code || !ysocketio.documents.has(fileId)) continue
    for (const socket of await io.of(NAMESPACE_PREFIX + fileId).fetchSockets()) {
      if (!userId || socket.data.user.id === userId) socket.disconnect(true)
    }
  }
}