import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import roomsReducer from '../features/rooms/roomsSlice'
import filesReducer from '../features/files/filesSlice'
import outputReducer from '../features/editor/outputSlice'
import editorSettingsReducer, { SETTINGS_KEY } from '../features/editor/editorSettingsSlice'
import chatReducer from '../features/chat/chatSlice'
import { saveAuth } from '../utils/authStorage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    files: filesReducer,
    output: outputReducer,
    editorSettings: editorSettingsReducer,
    chat: chatReducer,
  },
})

// Save the logged-in user and the editor settings whenever they change,
// so a refresh keeps them
let last = store.getState()
store.subscribe(() => {
  const state = store.getState()
  if (state.auth.user !== last.auth.user) saveAuth(state.auth)
  if (state.editorSettings !== last.editorSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.editorSettings))
  }
  last = state
})