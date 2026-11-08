// A tiny fake "database" for Phase 1, saved in the browser's localStorage.
// Services read and write `db`, then call saveDb(). In Phase 2 MongoDB replaces this file.
import { mockUsers } from '../mocks/users'
import { mockRooms } from '../mocks/rooms'
import { mockFiles } from '../mocks/files'
import { mockMessages } from '../mocks/messages'

const DB_KEY = 'codecollab.db.v1'

const seed = () =>
  structuredClone({ users: mockUsers, rooms: mockRooms, files: mockFiles, messages: mockMessages })

function load() {
  try {
    const saved = localStorage.getItem(DB_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // corrupted or blocked storage: fall back to the sample data
  }
  return seed()
}

export const db = load()

export function saveDb() {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

// Wipes everything back to the sample data (handy before a demo)
export function resetDb() {
  localStorage.clear()
  window.location.assign('/')
}