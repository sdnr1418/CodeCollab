// The one Socket.IO connection for presence and live room events.
// It connects when a room page opens (useRoomSocket) and sends the login cookie automatically.
import { io } from 'socket.io-client'

export const socket = io({ autoConnect: false, withCredentials: true })