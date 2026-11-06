import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as fileService from '../../services/fileService'

export const fetchFiles = createAsyncThunk('files/fetch', (roomId) =>
  fileService.getFilesForRoom(roomId),
)

const filesSlice = createSlice({
  name: 'files',
  initialState: { items: [], activeFileId: null, status: 'idle' },
  reducers: {
    fileSelected(state, action) {
      state.activeFileId = action.payload
    },
    fileContentChanged(state, action) {
      const file = state.items.find((f) => f.id === action.payload.id)
      if (file) file.content = action.payload.content
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = 'idle'
        state.items = action.payload
        state.activeFileId = action.payload[0]?.id ?? null
      })
  },
})

export const { fileSelected, fileContentChanged } = filesSlice.actions
export const selectActiveFile = (state) =>
  state.files.items.find((f) => f.id === state.files.activeFileId)
export default filesSlice.reducer