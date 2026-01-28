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
