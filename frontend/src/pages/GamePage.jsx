import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import GameBoard from '../components/game/GameBoard';
import PlayerList from '../components/game/PlayerList';
import GameLog from '../components/game/GameLog';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import '../styles/pages/GamePage.css';

const GamePage = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        gameState,
        loading,
        error,
        connected,
        fetchGameState,
        updateGameState,
        setConnected,
        clearError
    } = useGame();

    const handleWebSocketMessage = (message) => {
        console.log('WebSocket message received:', message);

        switch (message.type) {
            case 'game_update':
                if (message.data) {
                    updateGameState(message.data);
                }
                break;
            case 'player_joined':
            case 'player_left':
                // Refresh game state when players join/leave
                fetchGameState(gameId);
                break;
            case 'error':
                console.error('WebSocket error:', message.message);
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    };

    const handleWebSocketConnect = () => {
        console.log('Connected to game WebSocket');
        setConnected(true);
    };

    const handleWebSocketDisconnect = () => {
        console.log('Disconnected from game WebSocket');
        setConnected(false);
    };

    const {
        connected: wsConnected,
        error: wsError
    } = useWebSocket(
        `/game/${gameId}`,
        handleWebSocketMessage,
        handleWebSocketConnect,
        handleWebSocketDisconnect
    );

    useEffect(() => {
        if (gameId) {
            fetchGameState(gameId);
        }
    }, [gameId, fetchGameState]);

    const handleLeaveGame = () => {
        // In a full implementation, this would call an API to leave the game
        navigate('/rooms');
    };

    if (loading) {
        return <Loading message="Loading game..." />;
    }

    if (error) {
        return (
            <div className="game-page">
                <div className="container">
                    <ErrorMessage message={error} onClose={clearError} />
                    <div className="game-error-actions">
                        <button onClick={() => navigate('/rooms')} className="btn btn-secondary">
                            Back to Rooms
                        </button>
                        <button onClick={() => fetchGameState(gameId)} className="btn btn-primary">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="game-page">
                <div className="container">
                    <div className="no-game">
                        <h2>Game not found</h2>
                        <button onClick={() => navigate('/rooms')} className="btn btn-primary">
                            Back to Rooms
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-page">
            <div className="container">
                <div className="game-header">
                    <h2>Game #{gameState.gameId}</h2>
                    <div className="game-controls">
                        <div className="connection-status">
                            {wsConnected ? (
                                <span className="status-connected">🟢 Connected</span>
                            ) : (
                                <span className="status-disconnected">🔴 Disconnected</span>
                            )}
                        </div>
                        <button onClick={handleLeaveGame} className="btn btn-danger">
                            Leave Game
                        </button>
                    </div>
                </div>

                {wsError && (
                    <ErrorMessage message={`Connection error: ${wsError}`} />
                )}

                <div className="game-content">
                    <div className="game-main">
                        <GameBoard gameState={gameState} currentUser={user} />
                    </div>

                    <div className="game-sidebar">
                        <PlayerList players={gameState.players} currentUser={user} />
                        <GameLog gameId={gameId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;