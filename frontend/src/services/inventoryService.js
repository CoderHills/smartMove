import api from './api';

// Inventory API calls
export const inventoryService = {
  // Get inventory templates
  async getTemplates(roomType = null) {
    const params = roomType ? { room_type: roomType } : {};
    const response = await api.get('/inventory/templates', { params });
    return response.data;
  },

  // Get all user inventories
  async getMyInventories() {
    const response = await api.get('/inventory/my-inventories');
    return response.data;
  },

  // Create new inventory
  async createInventory(roomType, items) {
    const response = await api.post('/inventory', {
      room_type: roomType,
      items,
    });
    return response.data;
  },

  // Get specific inventory
  async getInventory(inventoryId) {
    const response = await api.get(`/inventory/${inventoryId}`);
    return response.data;
  },

  // Update inventory
  async updateInventory(inventoryId, items) {
    const response = await api.put(`/inventory/${inventoryId}`, {
      items,
    });
    return response.data;
  },

  // Delete inventory
  async deleteInventory(inventoryId) {
    const response = await api.delete(`/inventory/${inventoryId}`);
    return response.data;
  },
};

export default inventoryService;

