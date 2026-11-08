// Remembers who is logged in, so a page refresh doesn't log you out
const AUTH_KEY = 'codecollab.auth'

export function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) // { user, token } or null
  } catch {
    return null
  }
}

export function saveAuth({ user, token }) {
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }))
  else localStorage.removeItem(AUTH_KEY)
}