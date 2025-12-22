// User type
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Registration request type
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Login request type
export interface LoginRequest {
  email: string;
  password: string;
}

// Authentication response type
export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Login response type
export interface LoginResponse extends AuthResponse {}

// Register response type
export interface RegisterResponse extends AuthResponse {}