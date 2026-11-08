import { createSlice } from '@reduxjs/toolkit'

// Personal editor preferences. They are saved in localStorage (see app/store.js),
// so each person keeps their own theme and font size.
export const SETTINGS_KEY = 'codecollab.editor'
const MIN_FONT = 10
const MAX_FONT = 24

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) ?? {}
  } catch {
    return {}
  }
}

const editorSettingsSlice = createSlice({
  name: 'editorSettings',
  initialState: { theme: 'dark', fontSize: 14, ...loadSettings() },
  reducers: {
    themeToggled: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    fontSizeChanged: (state, action) => {
      // action.payload is +1 or -1
      state.fontSize = Math.min(MAX_FONT, Math.max(MIN_FONT, state.fontSize + action.payload))
    },
  },
})

export const { themeToggled, fontSizeChanged } = editorSettingsSlice.actions
export default editorSettingsSlice.reducer