import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

// remember = the "Keep me logged in" checkbox (the server makes the cookie last 7 days)
export const loginUser = createAsyncThunk(
  "auth/login",
  ({ email, password, remember }) =>
    authService.login(email, password, remember),
);

export const registerUser = createAsyncThunk(
  "auth/register",
  ({ name, email, password }) => authService.register(name, email, password),
);

// Runs once when the app loads: asks the server who the cookie belongs to
export const checkSession = createAsyncThunk("auth/checkSession", () =>
  authService.getCurrentUser(),
);

export const logoutUser = createAsyncThunk("auth/logout", () =>
  authService.logout(),
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    sessionChecked: false, // false until checkSession finishes, so we don't bounce to /login too early
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.sessionChecked = true;
      })
      .addCase(checkSession.rejected, (state) => {
        state.user = null; // server unreachable: treat as logged out
        state.sessionChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      // Log out locally even if the request fails, so the button always works
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
