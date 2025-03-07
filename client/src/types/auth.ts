export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  website?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  avatar?: File;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  website?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
