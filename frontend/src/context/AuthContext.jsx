import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { setToken, removeToken, isAuthenticated } from '../utils/helpers';

const AuthContext = createContext();

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
        case 'REGISTER_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        case 'LOGIN_FAILURE':
        case 'REGISTER_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check authentication status on app load
    useEffect(() => {
        const checkAuthStatus = async () => {
            if (isAuthenticated()) {
                try {
                    const response = await authService.getCurrentUser();
                    if (response.success) {
                        dispatch({ type: 'SET_USER', payload: response.data });
                    } else {
                        removeToken();
                        dispatch({ type: 'LOGOUT' });
                    }
                } catch (error) {
                    removeToken();
                    dispatch({ type: 'LOGOUT' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await authService.login(credentials);
            if (response.success) {
                setToken(response.data.token);
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: response.data }
                });
                return { success: true };
            } else {
                dispatch({
                    type: 'LOGIN_FAILURE',
                    payload: response.message || 'Login failed'
                });
                return { success: false, error: response.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'REGISTER_START' });
        try {
            const response = await authService.register(userData);
            if (response.success) {
                setToken(response.data.token);
                dispatch({
                    type: 'REGISTER_SUCCESS',
                    payload: { user: response.data }
                });
                return { success: true };
            } else {
                dispatch({
                    type: 'REGISTER_FAILURE',
                    payload: response.message || 'Registration failed'
                });
                return { success: false, error: response.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            removeToken();
            dispatch({ type: 'LOGOUT' });
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const updateUser = (userData) => {
        dispatch({ type: 'SET_USER', payload: userData });
    };

    const value = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
        clearError,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};