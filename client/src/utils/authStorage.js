// Remembers who is logged in, so a page refresh doesn't log you out.
// "Keep me logged in" checked   -> localStorage (survives closing the browser)
// "Keep me logged in" unchecked -> sessionStorage (cleared when the tab is closed)
const AUTH_KEY = 'codecollab.auth'

export function loadAuth() {
  try {
    const saved = localStorage.getItem(AUTH_KEY)
    if (saved) return { ...JSON.parse(saved), remember: true }
    const session = sessionStorage.getItem(AUTH_KEY)
    if (session) return { ...JSON.parse(session), remember: false }
  } catch {
    // ignore broken saved data
  }
  return null
}

export function saveAuth({ user, token, remember }) {
  localStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_KEY)
  if (!user) return
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(AUTH_KEY, JSON.stringify({ user, token }))
}