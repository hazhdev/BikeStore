import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./typesAuth";
import { loginFetch, RegisterFetch } from "./authThunks";

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      ((state.token = null),
        (state.user = null),
        (state.isAuthenticated = false));
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginFetch.pending, (state) => {
        ((state.status = "loading"), (state.error = null));
      })
      .addCase(loginFetch.fulfilled, (state, action) => {
        ((state.status = "success"),
          (state.token = action.payload.token),
          (state.user = action.payload.user),
          (state.isAuthenticated = true));
      })
      .addCase(loginFetch.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Не удалось войти";
        state.isAuthenticated = false;
      })
      .addCase(RegisterFetch.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(RegisterFetch.fulfilled, (state, action) => {
        state.status = "success";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(RegisterFetch.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Не удалось зарегестрироваться";
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
