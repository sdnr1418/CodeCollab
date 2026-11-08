import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as fileService from '../../services/fileService'
import { languageFromFileName } from '../../utils/languages'
import { planLanguageChange } from '../../utils/starterFiles'

export const fetchFiles = createAsyncThunk('files/fetch', (roomId) =>
  fileService.getFilesForRoom(roomId),
)

export const createFile = createAsyncThunk('files/create', ({ roomId, name }) =>
  fileService.createFile(roomId, name),
)

export const renameFile = createAsyncThunk('files/rename', ({ id, name }) =>
  fileService.renameFile(id, name),
)

export const deleteFile = createAsyncThunk('files/delete', (id) => fileService.deleteFile(id))

// Saves every file with unsaved edits in one go (the Save button / Ctrl+S)
export const saveFiles = createAsyncThunk('files/save', (roomId, { getState }) => {
  const { items, unsavedIds } = getState().files
  const changes = items
    .filter((f) => unsavedIds.includes(f.id))
    .map((f) => ({ id: f.id, content: f.content }))
  return fileService.saveFiles(roomId, changes)
})

// The language dropdown. For code files it also renames the file (main.cpp -> main.py)
// and swaps untouched starter code. For other files (README.md) it only changes the colours.
export const changeFileLanguage = createAsyncThunk(
  'files/changeLanguage',
  async ({ id, language }, { getState }) => {
    const file = getState().files.items.find((f) => f.id === id)
    const plan = planLanguageChange(file, language)
    if (!plan) return { id, language } // colours only
    const saved = await fileService.changeFileLanguage(id, plan)
    return { id, name: saved.name, content: plan.content }
  },
)

const initialState = {
  items: [], // { id, roomId, name, content }
  openTabIds: [], // files shown as tabs above the editor
  activeFileId: null,
  unsavedIds: [], // files edited since the last Save
  status: 'idle',
}

const closeTab = (state, id) => {
  const index = state.openTabIds.indexOf(id)
  state.openTabIds = state.openTabIds.filter((tabId) => tabId !== id)
  if (state.activeFileId === id) {
    state.activeFileId = state.openTabIds[Math.max(0, index - 1)] ?? null
  }
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
      closeTab(state, action.payload)
    },
    // Typing only changes Redux; the change is stored when the user saves
    fileContentChanged(state, action) {
      const { id, content } = action.payload
      const file = state.items.find((f) => f.id === id)
      if (!file) return
      file.content = content
      if (!state.unsavedIds.includes(id)) state.unsavedIds.push(id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, () => ({ ...initialState, status: 'loading' }))
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = 'idle'
        state.items = action.payload
        state.activeFileId = action.payload[0]?.id ?? null
        state.openTabIds = action.payload.slice(0, 3).map((f) => f.id)
      })
      .addCase(createFile.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.openTabIds.push(action.payload.id)
        state.activeFileId = action.payload.id
      })
      .addCase(renameFile.fulfilled, (state, action) => {
        const file = state.items.find((f) => f.id === action.payload.id)
        if (file) file.name = action.payload.name
      })
      .addCase(changeFileLanguage.fulfilled, (state, action) => {
        const { id, language, name, content } = action.payload
        const file = state.items.find((f) => f.id === id)
        if (!file) return
        if (language) {
          file.language = language // manual choice, used instead of the extension
          return
        }
        file.name = name
        delete file.language // the new extension now decides the language
        if (content !== undefined) {
          file.content = content
          state.unsavedIds = state.unsavedIds.filter((x) => x !== id) // already saved by the service
        }
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        const id = action.payload
        state.items = state.items.filter((f) => f.id !== id)
        state.unsavedIds = state.unsavedIds.filter((x) => x !== id)
        closeTab(state, id)
      })
      .addCase(saveFiles.fulfilled, (state, action) => {
        state.unsavedIds = state.unsavedIds.filter((id) => !action.payload.includes(id))
      })
  },
})

export const { fileSelected, tabClosed, fileContentChanged } = filesSlice.actions

export const selectActiveFile = (state) =>
  state.files.items.find((f) => f.id === state.files.activeFileId)

export const selectActiveLanguage = (state) => {
  const file = selectActiveFile(state)
  if (!file) return null
  return file.language ?? languageFromFileName(file.name) // a manual choice wins over the extension
}

export default filesSlice.reducer