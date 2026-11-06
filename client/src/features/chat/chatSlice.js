import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as chatService from '../../services/chatService'

export const fetchMessages = createAsyncThunk('chat/fetch', (roomId) =>
  chatService.getMessagesForRoom(roomId),
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [] },
  reducers: {
    messageSent(state, action) {
      state.messages.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload
    })
  },
})

export const { messageSent } = chatSlice.actions
export default chatSlice.reducer