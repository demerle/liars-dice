import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { gameService } from '../../services/gameService';
import { DICE_FACES } from '../../utils/constants';
import { formatBid } from '../../utils/helpers';
import ErrorMessage from '../common/ErrorMessage';

const BidPanel = ({ gameId, lastMove }) => {
    const { makeMove, error, clearError } = useGame();
    const [bidQuantity, setBidQuantity] = useState(1);
    const [bidFaceValue, setBidFaceValue] = useState(1);
    const [loading, setLoading] = useState(false);

    // Calculate minimum bid based on last move
    const getMinimumBid = () => {
        if (!lastMove || lastMove.moveType !== 'BID') {
            return { quantity: 1, faceValue: 1 };
        }

        const lastQuantity = lastMove.bidQuantity;
        const lastFaceValue = lastMove.bidFaceValue;

        // Next bid must be higher quantity or same quantity with higher face value
        return {
            quantity: lastQuantity,
            faceValue: lastFaceValue + 1 <= 6 ? lastFaceValue + 1 : lastQuantity + 1
        };
    };

    const minBid = getMinimumBid();

    const handleBid = async () => {
        setLoading(true);
        clearError();

        try {
            const moveData = gameService.createBid(bidQuantity, bidFaceValue);
            await makeMove(gameId, moveData);
        } catch (err) {
            console.error('Failed to make bid:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChallenge = async () => {
        setLoading(true);
        clearError();

        try {
            const moveData = gameService.createChallenge();
            await makeMove(gameId, moveData);
        } catch (err) {
            console.error('Failed to challenge:', err);
        } finally {
            setLoading(false);
        }
    };

    const isValidBid = () => {
        if (!lastMove || lastMove.moveType !== 'BID') {
            return bidQuantity >= 1 && bidFaceValue >= 1;
        }

        const lastQuantity = lastMove.bidQuantity;
        const lastFaceValue = lastMove.bidFaceValue;

        // Valid if higher quantity, or same quantity with higher face value
        return (
            bidQuantity > lastQuantity ||
            (bidQuantity === lastQuantity && bidFaceValue > lastFaceValue)
        );
    };

    const canChallenge = lastMove && lastMove.moveType === 'BID';

    return (
        <div className="bid-panel">
            <h4>Your Turn</h4>

            <ErrorMessage message={error} onClose={clearError} />

            {lastMove && lastMove.moveType === 'BID' && (
                <div className="current-bid">
                    <p>Current bid: <strong>{formatBid(lastMove.bidQuantity, lastMove.bidFaceValue)}</strong></p>
                    <p>by {lastMove.playerUsername}</p>
                </div>
            )}

            <div className="bid-controls">
                <div className="bid-inputs">
                    <div className="input-group">
                        <label htmlFor="bidQuantity">Quantity:</label>
                        <select
                            id="bidQuantity"
                            value={bidQuantity}
                            onChange={(e) => setBidQuantity(parseInt(e.target.value))}
                            disabled={loading}
                        >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="bidFaceValue">Face Value:</label>
                        <select
                            id="bidFaceValue"
                            value={bidFaceValue}
                            onChange={(e) => setBidFaceValue(parseInt(e.target.value))}
                            disabled={loading}
                        >
                            {DICE_FACES.map(face => (
                                <option key={face} value={face}>{face}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bid-preview">
                    <p>Your bid: <strong>{formatBid(bidQuantity, bidFaceValue)}</strong></p>
                    {!isValidBid() && (
                        <p className="bid-error">
                            Bid must be higher than current bid
                        </p>
                    )}
                </div>

                <div className="bid-actions">
                    <button
                        onClick={handleBid}
                        disabled={loading || !isValidBid()}
                        className="btn btn-primary"
                    >
                        {loading ? 'Making Bid...' : 'Make Bid'}
                    </button>

                    {canChallenge && (
                        <button
                            onClick={handleChallenge}
                            disabled={loading}
                            className="btn btn-danger"
                        >
                            {loading ? 'Challenging...' : 'Challenge!'}
                        </button>
                    )}
                </div>

                <div className="bid-help">
                    <h5>How to play:</h5>
                    <ul>
                        <li><strong>Bid:</strong> Claim how many dice of a certain value you think are on the table</li>
                        <li><strong>Challenge:</strong> Call the previous player a liar if you think their bid is too high</li>
                        <li>Each bid must be higher than the previous one</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BidPanel;