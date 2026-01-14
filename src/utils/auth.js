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
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('YOUR_REFRESH_TOKEN_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    
    // Store new tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt);
    localStorage.setItem('refreshTokenExpiresAt', data.refreshTokenExpiresAt);
    
    return data.accessToken;
  } catch (error) {
    clearAuthData();
    window.location.href = '/';
    throw error;
  }
};