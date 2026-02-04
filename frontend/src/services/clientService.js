import api from './api';

// Client API calls
export const clientService = {
  // Get client dashboard data
  async getDashboard() {
    const response = await api.get('/client/dashboard');
    return response.data;
  },
};

export default clientService;

