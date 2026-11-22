// Attaches Socket.IO to the HTTP server (called from server.js).
//   "/"          -> presence and live room events (roomHandlers.js, realtime.js)
//   "/yjs|<id>"  -> live editing of one file (collab.js)
import { Server } from 'socket.io'
import { corsOptions } from '../config/corsOptions.js'
import { socketAuth } from './socketAuth.js'
import { registerRoomHandlers } from './roomHandlers.js'
import { initCollab } from './collab.js'
import { setIo } from './realtime.js'

export function initSockets(httpServer) {
  const io = new Server(httpServer, { cors: corsOptions })

  io.use(socketAuth) // no login cookie, no socket
  io.on('connection', (socket) => registerRoomHandlers(io, socket))

  initCollab(io)
  setIo(io)
  return io
}