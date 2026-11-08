import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as authService from '../../services/authService'
import { loadAuth } from '../../utils/authStorage'

// remember = the "Keep me logged in" checkbox
export const loginUser = createAsyncThunk('auth/login', async ({ email, password, remember }) => {
  const result = await authService.login(email, password)
  return { ...result, remember }
})

export const registerUser = createAsyncThunk('auth/register', ({ name, email, password }) =>
  authService.register(name, email, password),
)

const authSlice = createSlice({
  name: 'auth',
  // Start logged in if a previous session was saved in localStorage
  initialState: {
    user: null,
    token: null,
    remember: true,
    ...loadAuth(),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.user = action.payload.user
        state.token = action.payload.token
        state.remember = action.payload.remember
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.remember = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.error.message
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer