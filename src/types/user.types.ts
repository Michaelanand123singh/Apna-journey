export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  status: 'active' | 'banned'
  resumeUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export interface UserProfile {
  name: string
  email: string
  phone?: string
  resumeUrl?: string
}
