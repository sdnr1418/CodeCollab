import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as chatService from '../../services/chatService'

export const fetchMessages = createAsyncThunk('chat/fetch', (roomId) =>
  chatService.getMessagesForRoom(roomId),
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [] },
  reducers: {
    messageSent: {
      reducer(state, action) {
        state.messages.push(action.payload)
      },
      // prepare builds the full message object, so components only pass text + user
      prepare({ roomId, user, text }) {
        return {
          payload: {
            id: crypto.randomUUID(),
            roomId,
            type: 'message',
            user,
            text,
            sentAt: new Date().toISOString(),
          },
        }
      },
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