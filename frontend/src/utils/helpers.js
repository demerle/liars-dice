import { TOKEN_KEY } from './constants';

// Token management
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    try {
        // Basic JWT expiration check
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch (e) {
        return false;
    }
};

// Form validation helpers
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateUsername = (username) => {
    return username && username.length >= 3 && username.length <= 50;
};

// Game helpers
export const formatPlayerName = (username) => {
    return username.charAt(0).toUpperCase() + username.slice(1);
};

export const getDiceUnicode = (value) => {
    const diceUnicode = {
        1: '⚀',
        2: '⚁',
        3: '⚂',
        4: '⚃',
        5: '⚄',
        6: '⚅'
    };
    return diceUnicode[value] || '⚀';
};

export const formatBid = (quantity, faceValue) => {
    return `${quantity} ${faceValue}${quantity === 1 ? '' : 's'}`;
};

// Time formatting
export const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Room helpers
export const getRoomStatusText = (room) => {
    if (!room.isActive) return 'Inactive';
    if (room.currentPlayers >= room.maxPlayers) return 'Full';
    return `${room.currentPlayers}/${room.maxPlayers}`;
};

export const canJoinRoom = (room) => {
    return room.isActive && room.currentPlayers < room.maxPlayers;
};

// Error handling
export const getErrorMessage = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

// WebSocket helpers
export const createWebSocketUrl = (path) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws${path}`;
};

// Dice animation helpers
export const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1;
};

export const rollMultipleDice = (count) => {
    return Array.from({ length: count }, () => rollDice());
};

// Local storage helpers (for non-sensitive data)
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
};

export const getFromLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Failed to get from localStorage:', e);
        return null;
    }
};

export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Failed to remove from localStorage:', e);
    }
};