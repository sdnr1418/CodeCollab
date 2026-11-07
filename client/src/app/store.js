import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import roomsReducer from '../features/rooms/roomsSlice'
import filesReducer from '../features/files/filesSlice'
import outputReducer from '../features/editor/outputSlice'
import chatReducer from '../features/chat/chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    files: filesReducer,
    output: outputReducer,
    chat: chatReducer,
  },
})