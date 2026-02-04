import api from './api';

// Booking API calls
export const bookingService = {
  // Get all available movers
  async getMovers() {
    const response = await api.get('/bookings/movers');
    return response.data;
  },

  // Calculate price estimate
  async calculateEstimate(moverId, distanceKm, totalVolume) {
    const response = await api.post('/bookings/estimate', {
      mover_id: moverId,
      distance_km: distanceKm,
      total_volume: totalVolume,
    });
    return response.data;
  },

  // Create new booking
  async createBooking(bookingData) {
    const response = await api.post('/bookings', {
      mover_id: bookingData.moverId,
      pickup_address: bookingData.pickupAddress,
      pickup_latitude: bookingData.pickupLatitude,
      pickup_longitude: bookingData.pickupLongitude,
      pickup_floor: bookingData.pickupFloor,
      pickup_details: bookingData.pickupDetails,
      dropoff_address: bookingData.dropoffAddress,
      dropoff_latitude: bookingData.dropoffLatitude,
      dropoff_longitude: bookingData.dropoffLongitude,
      dropoff_floor: bookingData.dropoffFloor,
      dropoff_details: bookingData.dropoffDetails,
      scheduled_date: bookingData.scheduledDate,
      scheduled_time: bookingData.scheduledTime,
      distance_km: bookingData.distanceKm,
      total_volume: bookingData.totalVolume,
      special_instructions: bookingData.specialInstructions,
    });
    return response.data;
  },

  // Get booking details
  async getBooking(bookingId) {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Get tracking info for a booking
  async getTrackingInfo(bookingId) {
    const response = await api.get(`/bookings/${bookingId}/tracking`);
    return response.data;
  },

  // Update booking status (mover only)
  async updateBookingStatus(bookingId, status, notes) {
    const response = await api.put(`/bookings/${bookingId}/status`, {
      status,
      notes,
    });
    return response.data;
  },
};

export default bookingService;

