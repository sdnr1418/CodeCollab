// Phase 1: checks mock users. Phase 2: replace bodies with calls to the Express API.
import { mockUsers } from '../mocks/users'
import { mockDelay } from '../utils/mockDelay'

export async function login(email, password) {
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid email or password')
  const { password: _omit, ...safeUser } = user
  return mockDelay({ user: safeUser, token: 'mock-jwt-token' })
}

const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-pink-600',
  'bg-emerald-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-violet-600',
]

export async function register(name, email, password) {
  if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists')
  }
  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    password, // Phase 2: the server hashes this with bcrypt; it never stays in the browser
    color: AVATAR_COLORS[mockUsers.length % AVATAR_COLORS.length],
  }
  mockUsers.push(user)
  const { password: _omit, ...safeUser } = user
  return mockDelay({ user: safeUser, token: 'mock-jwt-token' })
}