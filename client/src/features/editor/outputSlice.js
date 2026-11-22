import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as runService from '../../services/runService'
import { selectActiveFile, selectActiveLanguage } from '../files/filesSlice'

// Runs whichever file is open in the editor, with Judge0 on the server
export const runActiveFile = createAsyncThunk('output/run', (_, { getState }) => {
  const state = getState()
  const file = selectActiveFile(state)
  return runService.runCode(file.roomId, file.name, selectActiveLanguage(state), file.content)
})

const initialState = {
  status: 'idle',
  command: '',
  stdout: '',
  stderr: '',
  exitCode: null,
  timeMs: null,
  ranBy: null, // { id, name } of whoever pressed Run
}

const outputSlice = createSlice({
  name: 'output',
  initialState,
  reducers: {
    outputCleared: () => initialState,
    // Someone in the room ran code: everyone sees the same output (pushed by Socket.IO)
    runResultReceived: (state, action) => ({ ...action.payload, status: 'done' }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(runActiveFile.pending, (state) => {
        state.status = 'running'
      })
      .addCase(runActiveFile.fulfilled, (state, action) => ({ ...action.payload, status: 'done' }))
      .addCase(runActiveFile.rejected, (state, action) => {
        state.status = 'done'
        state.exitCode = 1
        state.stderr = action.error.message
      })
  },
})

export const { outputCleared, runResultReceived } = outputSlice.actions
export default outputSlice.reducer