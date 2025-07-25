import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { gameService } from '../services/gameService';
import { GAME_STATUS } from '../utils/constants';

const GameContext = createContext();

const initialState = {
    gameId: null,
    gameState: null,
    loading: false,
    error: null,
    connected: false,
    lastMove: null,
    gameHistory: []
};

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'SET_GAME_ID':
            return {
                ...state,
                gameId: action.payload
            };
        case 'FETCH_GAME_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'FETCH_GAME_SUCCESS':
            return {
                ...state,
                gameState: action.payload,
                loading: false,
                error: null
            };
        case 'FETCH_GAME_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'UPDATE_GAME_STATE':
            return {
                ...state,
                gameState: action.payload
            };
        case 'SET_CONNECTED':
            return {
                ...state,
                connected: action.payload
            };
        case 'SET_LAST_MOVE':
            return {
                ...state,
                lastMove: action.payload
            };
        case 'SET_GAME_HISTORY':
            return {
                ...state,
                gameHistory: action.payload
            };
        case 'ADD_MOVE_TO_HISTORY':
            return {
                ...state,
                gameHistory: [...state.gameHistory, action.payload]
            };
        case 'CLEAR_GAME':
            return initialState;
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
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

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const setGameId = (gameId) => {
        dispatch({ type: 'SET_GAME_ID', payload: gameId });
    };

    const fetchGameState = async (gameId) => {
        dispatch({ type: 'FETCH_GAME_START' });
        try {
            const response = await gameService.getGameState(gameId);
            if (response.success) {
                dispatch({ type: 'FETCH_GAME_SUCCESS', payload: response.data });
                return { success: true };
            } else {
                dispatch({ type: 'FETCH_GAME_FAILURE', payload: response.message });
                return { success: false, error: response.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch game state';
            dispatch({ type: 'FETCH_GAME_FAILURE', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    const startGame = async (gameId) => {
        try {
            const response = await gameService.startGame(gameId);
            if (response.success) {
                dispatch({ type: 'UPDATE_GAME_STATE', payload: response.data });
                return { success: true };
            } else {
                dispatch({ type: 'SET_ERROR', payload: response.message });
                return { success: false, error: response.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to start game';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    const makeMove = async (gameId, moveData) => {
        try {
            const response = await gameService.makeMove(gameId, moveData);
            if (response.success) {
                dispatch({ type: 'UPDATE_GAME_STATE', payload: response.data });
                return { success: true };
            } else {
                dispatch({ type: 'SET_ERROR', payload: response.message });
                return { success: false, error: response.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to make move';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    const fetchGameHistory = async (gameId) => {
        try {
            const response = await gameService.getGameHistory(gameId);
            if (response.success) {
                dispatch({ type: 'SET_GAME_HISTORY', payload: response.data });
                return { success: true };
            }
        } catch (error) {
            console.error('Failed to fetch game history:', error);
        }
    };

    const updateGameState = (newGameState) => {
        dispatch({ type: 'UPDATE_GAME_STATE', payload: newGameState });
    };

    const setConnected = (connected) => {
        dispatch({ type: 'SET_CONNECTED', payload: connected });
    };

    const addMoveToHistory = (move) => {
        dispatch({ type: 'ADD_MOVE_TO_HISTORY', payload: move });
    };

    const clearGame = () => {
        dispatch({ type: 'CLEAR_GAME' });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        gameId: state.gameId,
        gameState: state.gameState,
        loading: state.loading,
        error: state.error,
        connected: state.connected,
        lastMove: state.lastMove,
        gameHistory: state.gameHistory,
        setGameId,
        fetchGameState,
        startGame,
        makeMove,
        fetchGameHistory,
        updateGameState,
        setConnected,
        addMoveToHistory,
        clearGame,
        clearError
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};