import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as roomService from '../../services/roomService'

export const fetchRooms = createAsyncThunk('rooms/fetch', (userId) =>
  roomService.getRoomsForUser(userId),
)

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: { items: [], status: 'idle' },
  reducers: {
    roomAdded(state, action) {
      state.items.unshift(action.payload)
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
  },
})

export const { roomAdded } = roomsSlice.actions
export default roomsSlice.reducer