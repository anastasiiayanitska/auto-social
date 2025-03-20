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
  emailVerified?: boolean;
}

export interface AuthState {
  user: User | null;

  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  verificationSent: boolean;
  passwordResetSent: boolean;
  passwordChangeRequested: boolean;
  users: User[] | null;
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

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyPasswordChangeData {
  code: string;
}

export interface UsersApiResponse {
  success: boolean;
  data: User[];
}
