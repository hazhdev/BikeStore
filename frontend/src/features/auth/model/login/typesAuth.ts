// Login
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Register

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  newpass: string;
}
