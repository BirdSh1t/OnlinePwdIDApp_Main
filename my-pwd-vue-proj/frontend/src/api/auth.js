// auth.js
import { apiClient } from './apiClient';

// Simplified refresh function (no role checking needed)
export async function refreshAuthToken() {
  try {
    // The interceptor will automatically use the correct endpoint
    const res = await apiClient.post('/api/auth/refresh');
    return res.data;
  } catch (error) {
    console.error('Refresh token failed:', error);
    throw error;
  }
}

// Simplified logout function
export async function logoutUser() {
  try {
    // The interceptor will automatically use the correct endpoint
    await apiClient.post('/api/auth/logout');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}