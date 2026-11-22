import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as chatService from '../../services/chatService'

export const fetchMessages = createAsyncThunk('chat/fetch', (roomId) =>
  chatService.getMessagesForRoom(roomId),
)

// The server knows who is sending from the login cookie, so only the text is sent
export const sendMessage = createAsyncThunk('chat/send', ({ roomId, text }) =>
  chatService.sendMessage({ roomId, text }),
)

// Your own message arrives twice (the POST reply and the live push), so keep only one
const addOnce = (state, message) => {
  if (!state.messages.some((m) => m.id === message.id)) state.messages.push(message)
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [] },
  reducers: {
    // A message pushed live by the server (from anyone, including you)
    messageReceived(state, action) {
      addOnce(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        addOnce(state, action.payload)
      })
  },
})

export const { messageReceived } = chatSlice.actions

export default chatSlice.reducer