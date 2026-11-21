import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as roomService from '../../services/roomService'

// getState().auth.user = the logged-in user, passed so the service can mark them online
const me = (getState) => getState().auth.user

export const fetchRooms = createAsyncThunk('rooms/fetchAll', () => roomService.getRoomsForUser())

export const fetchRoom = createAsyncThunk('rooms/fetchOne', (roomId, { getState }) =>
  roomService.getRoom(roomId, me(getState)),
)

export const createRoom = createAsyncThunk('rooms/create', ({ name, language }, { getState }) =>
  roomService.createRoom(name, language, me(getState)),
)

export const joinRoom = createAsyncThunk('rooms/join', (roomId, { getState }) =>
  roomService.joinRoom(roomId, me(getState)),
)

export const removeMember = createAsyncThunk(
  'rooms/removeMember',
  ({ roomId, memberId }, { getState }) => roomService.removeMember(roomId, memberId, me(getState)),
)

export const renameRoom = createAsyncThunk('rooms/rename', ({ roomId, name }, { getState }) =>
  roomService.renameRoom(roomId, name, me(getState)),
)

export const deleteRoom = createAsyncThunk('rooms/delete', (roomId) =>
  roomService.deleteRoom(roomId),
)

export const leaveRoom = createAsyncThunk('rooms/leave', (roomId, { getState }) =>
  roomService.leaveRoom(roomId, me(getState)),
)

// Both delete and leave return the room ID, so they share one reducer
const dropRoom = (state, action) => {
  state.items = state.items.filter((r) => r.id !== action.payload)
  if (state.current?.id === action.payload) state.current = null
}

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: { items: [], status: 'idle', current: null, currentStatus: 'idle' },
  reducers: {},
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
      .addCase(removeMember.fulfilled, (state, action) => {
        state.current = action.payload
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(renameRoom.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
        if (state.current?.id === action.payload.id) state.current = action.payload
      })
      .addCase(deleteRoom.fulfilled, dropRoom)
      .addCase(leaveRoom.fulfilled, dropRoom)
  },
})

export default roomsSlice.reducer