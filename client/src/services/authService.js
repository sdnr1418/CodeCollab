// Phase 1: checks mock users. Phase 2: replace the bodies with calls to the Express API.
import { mockUsers } from '../mocks/users'
import { mockDelay } from '../utils/mockDelay'

export async function login(email, password) {
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid email or password')
  const { password: _omit, ...safeUser } = user
  return mockDelay({ user: safeUser, token: 'mock-jwt-token' })
}

export async function register(name, email) {
  return mockDelay({ user: { id: crypto.randomUUID(), name, email }, token: 'mock-jwt-token' })
}