import api from './api';

// Admin API calls
export const adminService = {
  // Get admin dashboard
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get pending movers
  async getPendingMovers() {
    const response = await api.get('/admin/movers/pending');
    return response.data;
  },

  // Approve mover
  async approveMover(moverId) {
    const response = await api.post(`/admin/movers/${moverId}/approve`);
    return response.data;
  },

  // Reject mover
  async rejectMover(moverId) {
    const response = await api.post(`/admin/movers/${moverId}/reject`);
    return response.data;
  },

  // Get all users
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get all bookings
  async getBookings() {
    const response = await api.get('/admin/bookings');
    return response.data;
  },
};

export default adminService;

