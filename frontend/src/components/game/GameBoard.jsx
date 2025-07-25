import React from 'react';
import { useGame } from '../../context/GameContext';
import { GAME_STATUS } from '../../utils/constants';
import DiceDisplay from './DiceDisplay';
import BidPanel from './BidPanel';
import '../../styles/components/GameBoard.css';

const GameBoard = ({ gameState, currentUser }) => {
    const { startGame } = useGame();

    const handleStartGame = async () => {
        if (gameState.gameId) {
            await startGame(gameState.gameId);
        }
    };

    const isCurrentPlayer = gameState.currentPlayerUsername === currentUser?.username;
    const canStartGame = gameState.status === GAME_STATUS.WAITING;
    const isGameInProgress = gameState.status === GAME_STATUS.IN_PROGRESS;

    // Find current user's dice
    const currentPlayerData = gameState.players?.find(
        player => player.username === currentUser?.username
    );

    const renderGameStatus = () => {
        switch (gameState.status) {
            case GAME_STATUS.WAITING:
                return (
                    <div className="game-status waiting">
                        <h3>Waiting for game to start...</h3>
                        <p>Players: {gameState.players?.length || 0}</p>
                        <button
                            onClick={handleStartGame}
                            className="btn btn-success"
                            disabled={!gameState.players || gameState.players.length < 2}
                        >
                            Start Game
                        </button>
                    </div>
                );

            case GAME_STATUS.IN_PROGRESS:
                return (
                    <div className="game-status in-progress">
                        <h3>Round {gameState.roundNumber}</h3>
                        <p>
                            Current turn: <strong>{gameState.currentPlayerUsername}</strong>
                            {isCurrentPlayer && <span className="your-turn"> (Your turn!)</span>}
                        </p>
                        {gameState.lastMove && (
                            <div className="last-move">
                                <p>Last move: {gameState.lastMove.displayText}</p>
                            </div>
                        )}
                    </div>
                );

            case GAME_STATUS.FINISHED:
                return (
                    <div className="game-status finished">
                        <h3>Game Finished!</h3>
                        <p>Winner: {gameState.winner || 'Unknown'}</p>
                    </div>
                );

            default:
                return (
                    <div className="game-status">
                        <h3>Game Status: {gameState.status}</h3>
                    </div>
                );
        }
    };

    return (
        <div className="game-board">
            <div className="game-board-header">
                {renderGameStatus()}
            </div>

            {isGameInProgress && (
                <>
                    <div className="dice-section">
                        <h4>Your Dice</h4>
                        <DiceDisplay
                            dice={currentPlayerData?.dice || []}
                            isVisible={true}
                        />
                        <p className="dice-count">
                            You have {currentPlayerData?.diceCount || 0} dice remaining
                        </p>
                    </div>

                    <div className="bid-section">
                        {isCurrentPlayer ? (
                            <BidPanel
                                gameId={gameState.gameId}
                                lastMove={gameState.lastMove}
                            />
                        ) : (
                            <div className="waiting-for-turn">
                                <p>Waiting for {gameState.currentPlayerUsername} to make a move...</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {!isGameInProgress && gameState.players && (
                <div className="players-preview">
                    <h4>Players in Game</h4>
                    <div className="players-list">
                        {gameState.players.map((player, index) => (
                            <div key={player.username} className="player-preview">
                                <span className="player-name">{player.username}</span>
                                <span className="player-dice">{player.diceCount} dice</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;