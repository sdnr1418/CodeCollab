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

// Sets the open room, with the green "online" dots from the latest presence update
const setCurrent = (state, room) => {
  const ids = state.onlineIds
  state.current = ids.length
    ? { ...room, members: room.members.map((m) => ({ ...m, online: ids.includes(m.id) })) }
    : room
}

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: { items: [], status: 'idle', current: null, currentStatus: 'idle', onlineIds: [] },
  // Live updates from Socket.IO (hooks/useRoomSocket.js)
  reducers: {
    presenceUpdated(state, action) {
      state.onlineIds = action.payload
      if (state.current) setCurrent(state, state.current)
    },
    roomUpdated(state, action) {
      const room = action.payload
      const index = state.items.findIndex((r) => r.id === room.id)
      if (index !== -1) state.items[index] = room
      if (state.current?.id === room.id) setCurrent(state, room)
    },
    roomRemoved: dropRoom,
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
        state.onlineIds = []
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.currentStatus = 'idle'
        setCurrent(state, action.payload)
      })
      .addCase(fetchRoom.rejected, (state) => {
        state.currentStatus = 'error'
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        setCurrent(state, action.payload)
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(renameRoom.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
        if (state.current?.id === action.payload.id) setCurrent(state, action.payload)
      })
      .addCase(deleteRoom.fulfilled, dropRoom)
      .addCase(leaveRoom.fulfilled, dropRoom)
  },
})

export const { presenceUpdated, roomUpdated, roomRemoved } = roomsSlice.actions

export default roomsSlice.reducer