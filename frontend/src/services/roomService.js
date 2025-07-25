import api from './api';

export const roomService = {
    // Get all available rooms
    getRooms: async (searchQuery = '') => {
        const params = searchQuery ? { search: searchQuery } : {};
        const response = await api.get('/rooms', { params });
        return response.data;
    },

    // Create a new room
    createRoom: async (roomData) => {
        const response = await api.post('/rooms', roomData);
        return response.data;
    },

    // Get room details
    getRoomDetails: async (roomId) => {
        const response = await api.get(`/rooms/${roomId}`);
        return response.data;
    },

    // Join a room
    joinRoom: async (roomId, password = '') => {
        const requestData = password ? { password } : {};
        const response = await api.post(`/rooms/${roomId}/join`, requestData);
        return response.data;
    },

    // Leave a room
    leaveRoom: async (roomId) => {
        const response = await api.delete(`/rooms/${roomId}/leave`);
        return response.data;
    },

    // Delete a room (room creator only)
    deleteRoom: async (roomId) => {
        const response = await api.delete(`/rooms/${roomId}`);
        return response.data;
    }
};