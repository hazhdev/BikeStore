import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginResponse, LoginData, RegisterData } from "./typesAuth";

const API_URL = "http://localhost:5000/api";

export const loginFetch = createAsyncThunk<
  LoginResponse,
  LoginData,
  { rejectValue: string }
>("/login", async (loginData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData: { message?: string } | null = await response
        .json()
        .catch(() => null);

      return rejectWithValue(errorData?.message ?? "Ошибка авторизации");
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Ошибка сети");
  }
});

export const RegisterFetch = createAsyncThunk<
  LoginResponse,
  RegisterData,
  { rejectValue: string }
>("/register", async (RegisterData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(RegisterData),
    });

    if (!res.ok) {
      const errorData: { message?: string } | null = await res
        .json()
        .catch(() => null);

      return rejectWithValue(errorData?.message ?? "Ошибка авторизации");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
  }
});
