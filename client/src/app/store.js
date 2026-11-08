import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import roomsReducer from '../features/rooms/roomsSlice'
import filesReducer from '../features/files/filesSlice'
import outputReducer from '../features/editor/outputSlice'
import chatReducer from '../features/chat/chatSlice'
import { saveAuth } from '../utils/authStorage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    files: filesReducer,
    output: outputReducer,
    chat: chatReducer,
  },
})

// Save the logged-in user whenever it changes, so a refresh keeps you logged in
let lastAuth = store.getState().auth
store.subscribe(() => {
  const { auth } = store.getState()
  if (auth.user !== lastAuth.user) saveAuth(auth)
  lastAuth = auth
})