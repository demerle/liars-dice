import api from './api';

export const authService = {
    // User registration
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // User login
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // User logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Get current user info
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    }
};