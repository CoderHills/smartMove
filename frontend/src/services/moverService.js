import api from './api';

// Mover API calls
export const moverService = {
  // Get mover dashboard
  async getDashboard() {
    const response = await api.get('/mover/dashboard');
    return response.data;
  },

  // Get all mover jobs
  async getJobs() {
    const response = await api.get('/mover/jobs');
    return response.data;
  },

  // Get mover profile
  async getProfile() {
    const response = await api.get('/mover/profile');
    return response.data;
  },
};

export default moverService;

