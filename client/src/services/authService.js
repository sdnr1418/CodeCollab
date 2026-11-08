// Phase 1: checks the local mock database. Phase 2: replace bodies with calls to the Express API.
import { db, saveDb } from '../utils/mockDb'
import { mockDelay } from '../utils/mockDelay'

const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-pink-600',
  'bg-emerald-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-violet-600',
]

const withoutPassword = ({ password: _omit, ...user }) => user

export async function login(email, password) {
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
  if (!user) throw new Error('Invalid email or password')
  return mockDelay({ user: withoutPassword(user), token: 'mock-jwt-token' })
}

export async function register(name, email, password) {
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists')
  }
  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    password, // Phase 2: the server hashes this with bcrypt; it never stays in the browser
    color: AVATAR_COLORS[db.users.length % AVATAR_COLORS.length],
  }
  db.users.push(user)
  saveDb()
  return mockDelay({ user: withoutPassword(user), token: 'mock-jwt-token' })
}