// API Configuration - Centralized backend URL management
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export { API_BASE_URL };

// Helper function to make API calls with proper error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('adminToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    // Log only error message, not full response data
    console.error('API Error');
    throw error;
  }
};
