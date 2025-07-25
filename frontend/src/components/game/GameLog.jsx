import React, { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { formatTime } from '../../utils/helpers';

const GameLog = ({ gameId }) => {
    const { gameHistory, fetchGameHistory } = useGame();
    const logEndRef = useRef(null);

    useEffect(() => {
        if (gameId) {
            fetchGameHistory(gameId);
        }
    }, [gameId, fetchGameHistory]);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [gameHistory]);

    return (
        <div className="game-log">
            <h4>Game Log</h4>
            <div className="log-container">
                {gameHistory.length === 0 ? (
                    <div className="no-history">
                        <p>No moves yet. Game will start soon!</p>
                    </div>
                ) : (
                    <div className="log-messages">
                        {gameHistory.map((move, index) => (
                            <div key={index} className="log-message">
                                <div className="message-time">
                                    {formatTime(move.createdAt)}
                                </div>
                                <div className="message-content">
                                    {move.displayText}
                                </div>
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameLog;