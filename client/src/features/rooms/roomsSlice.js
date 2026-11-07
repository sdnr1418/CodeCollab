import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as roomService from '../../services/roomService'

export const fetchRooms = createAsyncThunk('rooms/fetchAll', (userId) =>
  roomService.getRoomsForUser(userId),
)

export const fetchRoom = createAsyncThunk('rooms/fetchOne', (roomId) => roomService.getRoom(roomId))

export const createRoom = createAsyncThunk('rooms/create', ({ name, language }, { getState }) =>
  roomService.createRoom(name, language, getState().auth.user),
)

export const joinRoom = createAsyncThunk('rooms/join', (roomId, { getState }) =>
  roomService.joinRoom(roomId, getState().auth.user),
)

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: { items: [], status: 'idle', current: null, currentStatus: 'idle' },
  reducers: {
    // Phase 1 only changes local state. Phase 2 will call the API first.
    memberRemoved(state, action) {
      state.current.members = state.current.members.filter((m) => m.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = 'idle'
        state.items = action.payload
      })
      .addCase(fetchRoom.pending, (state) => {
        state.currentStatus = 'loading'
        state.current = null
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.currentStatus = 'idle'
        state.current = action.payload
      })
      .addCase(fetchRoom.rejected, (state) => {
        state.currentStatus = 'error'
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
  },
})

export const { memberRemoved } = roomsSlice.actions
export default roomsSlice.reducer