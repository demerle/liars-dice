// API Base URL
export const API_BASE_URL = '/api';

// WebSocket URLs
export const WS_BASE_URL = '/ws';

// Game Constants
export const GAME_STATUS = {
    WAITING: 'WAITING',
    IN_PROGRESS: 'IN_PROGRESS',
    FINISHED: 'FINISHED',
    CANCELLED: 'CANCELLED'
};

export const MOVE_TYPES = {
    BID: 'BID',
    CHALLENGE: 'CHALLENGE'
};

// Room Constants
export const MAX_PLAYERS = 6;
export const MIN_PLAYERS = 2;

// Dice Constants
export const DICE_FACES = [1, 2, 3, 4, 5, 6];
export const MAX_DICE_PER_PLAYER = 5;

// Authentication
export const TOKEN_KEY = 'liarsdice_token';

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ROOMS: '/rooms',
    GAME: '/game'
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized. Please log in.',
    INVALID_CREDENTIALS: 'Invalid username or password.',
    USER_EXISTS: 'Username or email already exists.',
    ROOM_FULL: 'Room is full.',
    INVALID_PASSWORD: 'Invalid room password.',
    GAME_NOT_FOUND: 'Game not found.',
    NOT_YOUR_TURN: "It's not your turn.",
    INVALID_MOVE: 'Invalid move.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful!',
    REGISTER_SUCCESS: 'Registration successful!',
    ROOM_CREATED: 'Room created successfully!',
    ROOM_JOINED: 'Joined room successfully!',
    GAME_STARTED: 'Game started!'
};