// utils/auth.js

// Check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  
  // Additional check for token expiration
  if (accessToken) {
    const expiresAt = localStorage.getItem('accessTokenExpiresAt');
    if (expiresAt && new Date(expiresAt) < new Date()) {
      clearAuthData();
      return false;
    }
  }
  
  return !!(accessToken && user);
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get auth headers for API calls
export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('accessTokenExpiresAt');
  localStorage.removeItem('refreshTokenExpiresAt');
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const refreshTokenStr = localStorage.getItem('refreshToken');
    if (!refreshTokenStr) {
      throw new Error('No refresh token available');
    }

    // Import here to avoid circular dependencies
    const { refreshTokenApi } = await import('../Api/authApi');
    const data = await refreshTokenApi(refreshTokenStr);
    
    if (data.data && data.data.tokens) {
      const tokens = data.data.tokens;
      // Store new tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('accessTokenExpiresAt', tokens.accessTokenExpiresAt);
      localStorage.setItem('refreshTokenExpiresAt', tokens.refreshTokenExpiresAt);
      
      return tokens.accessToken;
    }
    
    throw new Error('Invalid refresh token response');
  } catch (error) {
    console.error('Token refresh error:', error);
    clearAuthData();
    window.location.href = '/login';
    throw error;
  }
};