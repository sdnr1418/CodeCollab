// Live room updates over Socket.IO while a room page is open:
// who's online, new chat messages, files added/renamed/deleted by others,
// and being sent back to the dashboard if the room is deleted or you're removed.
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { socket } from '../lib/socket'
import { presenceUpdated, roomUpdated, roomRemoved } from '../features/rooms/roomsSlice'
import { messageReceived } from '../features/chat/chatSlice'
import { fileAdded, fileUpdated, fileRemoved } from '../features/files/filesSlice'
import { runResultReceived } from '../features/editor/outputSlice'

function useRoomSocket(roomId) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = useSelector((state) => state.auth.user.id)

  useEffect(() => {
    const goToDashboard = (message) => {
      dispatch(roomRemoved(roomId))
      toast.error(message)
      navigate('/dashboard')
    }

    const handlers = {
      connect: () => socket.emit('room:join', roomId), // also re-joins after a dropped connection
      'presence:update': ({ code, userIds }) => code === roomId && dispatch(presenceUpdated(userIds)),
      'chat:message': (message) => message.roomId === roomId && dispatch(messageReceived(message)),
      'room:updated': (room) => room.id === roomId && dispatch(roomUpdated(room)),
      'file:created': (file) => file.roomId === roomId && dispatch(fileAdded(file)),
      'file:updated': (file) => file.roomId === roomId && dispatch(fileUpdated(file)),
      'file:deleted': ({ id }) => dispatch(fileRemoved(id)),
      'run:result': (result) => dispatch(runResultReceived(result)), // someone pressed Run
      // "by" is who did it: you already know if you deleted the room or left it yourself
      'room:deleted': ({ id, by }) => {
        if (id === roomId && by !== userId) goToDashboard('The owner deleted this room')
      },
      'member:removed': ({ userId: removedId, by }) => {
        if (removedId === userId && by !== userId) goToDashboard('You were removed from this room')
      },
    }

    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler))
    socket.connect()

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler))
      socket.disconnect() // the server marks you offline
    }
  }, [dispatch, navigate, roomId, userId])
}

export default useRoomSocket