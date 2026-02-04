import api, { setAuthToken, removeAuthToken, setUserData, setUserRole } from './api';

// Authentication API calls
export const authService = {
  // Login user
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
      setUserData(response.data.user);
      setUserRole(response.data.user.role);
    }
    
    return response.data;
  },

  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
      setUserData(response.data.user);
      setUserRole(response.data.user.role);
    }
    
    return response.data;
  },

  // Get current user profile
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout() {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
};

export default authService;

