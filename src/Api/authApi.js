import axiosInstance from "../utils/axiosInstance";

// Refresh token API call
export const refreshTokenApi = async (refreshToken) => {
  try {
    const response = await axiosInstance.post('/api/auth/refresh-token', {
      refreshToken
    });
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};


export const changePasswordApi = async (currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.put('/api/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Change password failed:', error);
    throw error;
  }
};

export const forgetPasswordApi = async (email) => {
  try {
    const response = await axiosInstance.post('/api/auth/forgot-password', {
      email
    });
    return response.data;
  } catch (error) {
    console.error('Forget password request failed:', error);
    throw error;
  }
};

export const resetPasswordApi = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post('/api/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Reset password failed:', error);
    throw error;
  }
};


export const LoginApi = async (userData) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", userData);
        return response;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

