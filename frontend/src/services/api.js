import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '../utils/constants';
import { getToken, removeToken } from '../utils/helpers';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - remove token and redirect to login
            removeToken();
            window.location.href = '/login';
        }

        if (error.response?.status === 403) {
            // Forbidden
            console.error('Access denied');
        }

        if (error.response?.status >= 500) {
            // Server error
            console.error('Server error:', error.response.data);
        }

        return Promise.reject(error);
    }
);

export default api;