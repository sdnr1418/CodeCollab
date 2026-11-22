import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as chatService from '../../services/chatService'

export const fetchMessages = createAsyncThunk('chat/fetch', (roomId) =>
  chatService.getMessagesForRoom(roomId),
)

// The server knows who is sending from the login cookie, so only the text is sent
export const sendMessage = createAsyncThunk('chat/send', ({ roomId, text }) =>
  chatService.sendMessage({ roomId, text }),
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload)
      })
  },
})

export default chatSlice.reducer