// Socket.IO middleware: the same check as requireAuth, but for socket connections.
// The browser sends the httpOnly login cookie with the socket handshake, so we read it from there.
import { User } from '../models/User.js'
import { COOKIE_NAME, verifyToken } from '../services/token.service.js'

// Reads one cookie from the raw "Cookie" header, e.g. "token=abc; theme=dark"
function readCookie(header = '', name) {
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

export async function socketAuth(socket, next) {
  try {
    const token = readCookie(socket.handshake.headers.cookie, COOKIE_NAME)
    if (!token) throw new Error('No cookie')
    const user = await User.findById(verifyToken(token))
    if (!user) throw new Error('No user')
    socket.data.user = user // available in every handler as socket.data.user
    next()
  } catch {
    next(new Error('Please log in')) // the client sees a connect_error
  }
}