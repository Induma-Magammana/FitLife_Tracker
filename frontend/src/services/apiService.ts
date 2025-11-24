import axios from 'axios';
import { StorageService } from './storageService';

// Change this to your computer's local IP address
const BASE_URL = 'http://10.135.209.205:3000/api'; // Update with your IP address

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await StorageService.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  async getExercises(type?: string, muscle?: string, difficulty?: string) {
    try {
      const params: any = {};
      if (type) params.type = type;
      if (muscle) params.muscle = muscle;
      if (difficulty) params.difficulty = difficulty;

      const response = await api.get('/exercises', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  async getExerciseById(id: string) {
    try {
      const response = await api.get(`/exercises/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw error;
    }
  },

  async getTips(category?: string) {
    try {
      const params: any = {};
      if (category) params.category = category;

      const response = await api.get('/tips', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching tips:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      
      // Store auth data
      await StorageService.saveAuthToken(token);
      await StorageService.saveUserData(user);
      
      return { user, token };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async register(firstName: string, lastName: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      const { user, token } = response.data.data;
      
      // Store auth data
      await StorageService.saveAuthToken(token);
      await StorageService.saveUserData(user);
      
      return { user, token };
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  async getFavourites() {
    try {
      const response = await api.get('/favourites');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching favourites:', error);
      throw error;
    }
  },

  async addFavourite(exerciseName: string) {
    try {
      const response = await api.post('/favourites', { exerciseName });
      return response.data;
    } catch (error) {
      console.error('Error adding favourite:', error);
      throw error;
    }
  },

  async removeFavourite(exerciseName: string) {
    try {
      const response = await api.delete(`/favourites/${exerciseName}`);
      return response.data;
    } catch (error) {
      console.error('Error removing favourite:', error);
      throw error;
    }
  },

  async getUserProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateUserProfile(data: any) {
    try {
      const response = await api.put('/users/profile', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  async forgotPassword(email: string) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error sending password reset:', error);
      throw error;
    }
  },
};
