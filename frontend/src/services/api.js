import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper functions for token management
export const setAuthToken = (token) => {
  localStorage.setItem('accessToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userData');
};

export const setUserData = (userData) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'client';
};

export const setUserRole = (role) => {
  localStorage.setItem('userRole', role);
};

