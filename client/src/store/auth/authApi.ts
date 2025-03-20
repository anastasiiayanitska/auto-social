import axios from "axios";
import {
  RegisterData,
  LoginData,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  VerifyPasswordChangeData,
} from "../../types/auth";
import { API_URL } from "../../utils/url";

export const authApi = {
  register: async (formData: RegisterData) => {
    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data.data;
  },

  login: async (credentials: LoginData) => {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      withCredentials: true,
    });
    return response.data.data;
  },

  logout: async () => {
    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  },

  fetchUser: async () => {
    const response = await axios.get(`${API_URL}/me`, {
      withCredentials: true,
    });

    return response.data.data;
  },

  updateUser: async (userId: string, userData: RegisterData) => {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("bio", userData.bio || "");
    formData.append("location", userData.location || "");
    formData.append("phoneNumber", userData.phoneNumber || "");
    formData.append("website", userData.website || "");

    if (userData.password) {
      formData.append("password", userData.password);
    }

    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    const response = await axios.put(`${API_URL}/update/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return response.data;
  },

  fetchUserProfileById: async (userId: string) => {
    const response = await axios.get(`${API_URL}/profile/${userId}`, {
      withCredentials: true,
    });
    return response.data.data;
  },

  fetchAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/all-users`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (data: VerifyEmailData) => {
    const response = await axios.post(`${API_URL}/verify-email`, data, {
      withCredentials: true,
    });
    return response.data.data;
  },

  resendVerificationCode: async (data: ResendVerificationData) => {
    await axios.post(`${API_URL}/resend-verification-code`, data, {
      withCredentials: true,
    });
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    await axios.post(`${API_URL}/forgot-password`, data, {
      withCredentials: true,
    });
  },

  resetPassword: async (data: ResetPasswordData) => {
    await axios.post(`${API_URL}/reset-password`, data, {
      withCredentials: true,
    });
  },

  changePassword: async (data: ChangePasswordData) => {
    await axios.post(`${API_URL}/change-password`, data, {
      withCredentials: true,
    });
  },

  verifyPasswordChange: async (data: VerifyPasswordChangeData) => {
    await axios.post(`${API_URL}/verify-password-change`, data, {
      withCredentials: true,
    });
  },
  deleteProfile: async (userId: string) => {
    await axios.delete(`${API_URL}/profile/${userId}`, {
      withCredentials: true,
    });
  },
};
