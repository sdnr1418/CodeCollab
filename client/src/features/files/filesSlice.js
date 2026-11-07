import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as fileService from '../../services/fileService'
import { languageFromFileName } from '../../utils/languages'

export const fetchFiles = createAsyncThunk('files/fetch', (roomId) =>
  fileService.getFilesForRoom(roomId),
)

const initialState = {
  items: [], // { id, roomId, name, content }
  openTabIds: [], // files shown as tabs above the editor
  activeFileId: null,
  unsavedIds: [], // files edited since the last Save
  status: 'idle',
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    fileSelected(state, action) {
      const id = action.payload
      state.activeFileId = id
      if (!state.openTabIds.includes(id)) state.openTabIds.push(id)
    },
    tabClosed(state, action) {
      const id = action.payload
      const index = state.openTabIds.indexOf(id)
      state.openTabIds = state.openTabIds.filter((tabId) => tabId !== id)
      if (state.activeFileId === id) {
        state.activeFileId = state.openTabIds[Math.max(0, index - 1)] ?? null
      }
    },
    fileContentChanged(state, action) {
      const { id, content } = action.payload
      const file = state.items.find((f) => f.id === id)
      if (!file) return
      file.content = content
      if (!state.unsavedIds.includes(id)) state.unsavedIds.push(id)
    },
    fileCreated(state, action) {
      const { roomId, name } = action.payload
      const file = { id: crypto.randomUUID(), roomId, name, content: '' }
      state.items.push(file)
      state.openTabIds.push(file.id)
      state.activeFileId = file.id
    },
    fileRenamed(state, action) {
      const file = state.items.find((f) => f.id === action.payload.id)
      if (file) file.name = action.payload.name
    },
    fileDeleted(state, action) {
      const id = action.payload
      state.items = state.items.filter((f) => f.id !== id)
      state.unsavedIds = state.unsavedIds.filter((x) => x !== id)
      filesSlice.caseReducers.tabClosed(state, { payload: id })
    },
    fileLanguageChanged(state, action) {
      const file = state.items.find((f) => f.id === action.payload.id)
      if (file) file.language = action.payload.language
    },
    allFilesSaved(state) {
      state.unsavedIds = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, () => ({ ...initialState, status: 'loading' }))
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = 'idle'
        state.items = action.payload
        const first = action.payload[0]
        state.activeFileId = first?.id ?? null
        state.openTabIds = action.payload.slice(0, 3).map((f) => f.id)
      })
  },
})

export const {
  fileSelected,
  tabClosed,
  fileContentChanged,
  fileCreated,
  fileRenamed,
  fileDeleted,
  fileLanguageChanged,
  allFilesSaved,
} = filesSlice.actions

export const selectActiveFile = (state) =>
  state.files.items.find((f) => f.id === state.files.activeFileId)

export const selectActiveLanguage = (state) => {
  const file = selectActiveFile(state)
  if (!file) return null
  return file.language ?? languageFromFileName(file.name) // a manual choice wins over the extension
}

export default filesSlice.reducer