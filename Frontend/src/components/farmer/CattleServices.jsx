import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/gaupal/farmer/cattle`; // Adjust your base URL

export const CattleService = {
  // Get dashboard metrics
  getDashboardMetrics: async (farmerId, token) => {
    try {
      const response = await axios.get(`${BASE_URL}/farmers/${farmerId}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  // Get all cattle for a farmer
  getAllCattle: async (farmerId, token) => {
    try {
      const response = await axios.get(`${BASE_URL}/farmers/${farmerId}/cattle`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cattle:', error);
      throw error;
    }
  },

  // Get single cattle details
  getCattleDetails: async (cattleId, token) => {
    try {
      const response = await axios.get(`${BASE_URL}/cattle/${cattleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cattle details:', error);
      throw error;
    }
  },

  // Add new cattle
  addCattle: async (farmerId, cattleData, token) => {
    try {
      const response = await axios.post(`${BASE_URL}/farmers/${farmerId}/cattle`, cattleData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error adding cattle:', error);
      throw error;
    }
  },

  // Update cattle
  updateCattle: async (cattleId, updateData, token) => {
    try {
      const response = await axios.put(`${BASE_URL}/cattle/${cattleId}`, updateData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating cattle:', error);
      throw error;
    }
  },

  // Delete cattle
  deleteCattle: async (cattleId, token) => {
    try {
      await axios.delete(`${BASE_URL}/cattle/${cattleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('Error deleting cattle:', error);
      throw error;
    }
  },

  // Add vaccination record
  addVaccination: async (cattleId, vaccinationData, token) => {
    try {
      const response = await axios.post(`${BASE_URL}/cattle/${cattleId}/vaccinations`, vaccinationData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding vaccination:', error);
      throw error;
    }
  }
};