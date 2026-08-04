import { createSlice } from "@reduxjs/toolkit";
import type { AuthState, LoginResponse, User } from "./typesAuth";
import { loginFetch, RegisterFetch } from "./authThunks";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

function readStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    // мусор в localStorage не должен ронять приложение
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

const storedToken = localStorage.getItem(TOKEN_KEY);
const storedUser = readStoredUser();

const initialState: AuthState = {
  token: storedToken,
  user: storedUser,
  isAuthenticated: Boolean(storedToken),
  status: "idle",
  error: null,
};

function applyAuthSuccess(state: AuthState, payload: LoginResponse) {
  state.status = "success";
  state.token = payload.token;
  state.user = payload.user;
  state.isAuthenticated = true;

  localStorage.setItem(TOKEN_KEY, payload.token);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginFetch.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginFetch.fulfilled, (state, action) => {
        applyAuthSuccess(state, action.payload);
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
        applyAuthSuccess(state, action.payload);
      })
      .addCase(RegisterFetch.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Не удалось зарегистрироваться";
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
