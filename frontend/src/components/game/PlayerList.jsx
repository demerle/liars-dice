import React from 'react';
import DiceDisplay from './DiceDisplay';

const PlayerList = ({ players, currentUser }) => {
    if (!players || players.length === 0) {
        return (
            <div className="player-list">
                <h4>Players</h4>
                <div className="no-players">
                    <p>No players in game</p>
                </div>
            </div>
        );
    }

    // Sort players by order
    const sortedPlayers = [...players].sort((a, b) => a.playerOrder - b.playerOrder);

    return (
        <div className="player-list">
            <h4>Players ({players.length})</h4>
            <div className="players-container">
                {sortedPlayers.map((player) => {
                    const isCurrentUser = player.username === currentUser?.username;
                    const isActive = player.isActive;

                    return (
                        <div
                            key={player.username}
                            className={`player-item ${isCurrentUser ? 'current-user' : ''} ${!isActive ? 'eliminated' : ''}`}
                        >
                            <div className="player-info">
                                <div className="player-name">
                                    {player.username}
                                    {isCurrentUser && <span className="you-label">(You)</span>}
                                </div>
                                <div className="player-status">
                  <span className="dice-count">
                    {player.diceCount} dice
                  </span>
                                    {!isActive && <span className="eliminated-label">Eliminated</span>}
                                </div>
                            </div>

                            <div className="player-dice">
                                <DiceDisplay
                                    dice={player.dice}
                                    isVisible={isCurrentUser}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerList;