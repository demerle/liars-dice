import api from './api';

export const gameService = {
    // Get game state
    getGameState: async (gameId) => {
        const response = await api.get(`/games/${gameId}`);
        return response.data;
    },

    // Start a game
    startGame: async (gameId) => {
        const response = await api.post(`/games/${gameId}/start`);
        return response.data;
    },

    // Make a game move (bid or challenge)
    makeMove: async (gameId, moveData) => {
        const response = await api.post(`/games/${gameId}/move`, moveData);
        return response.data;
    },

    // Get game history
    getGameHistory: async (gameId) => {
        const response = await api.get(`/games/${gameId}/history`);
        return response.data;
    },

    // Helper methods for move creation
    createBid: (quantity, faceValue) => ({
        moveType: 'BID',
        bidQuantity: quantity,
        bidFaceValue: faceValue
    }),

    createChallenge: () => ({
        moveType: 'CHALLENGE'
    })
};