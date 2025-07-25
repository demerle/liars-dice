import React, { useState } from 'react';
import ErrorMessage from '../common/ErrorMessage';

const JoinRoomModal = ({ room, onClose, onJoin }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onJoin(password);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join room');
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Join "{room.name}"</h3>
                    <button onClick={onClose} className="modal-close">×</button>
                </div>

                <div className="room-info-modal">
                    <p><strong>Creator:</strong> {room.creatorUsername}</p>
                    <p><strong>Players:</strong> {room.currentPlayers}/{room.maxPlayers}</p>
                    <p className="password-required">🔒 This room requires a password</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <ErrorMessage message={error} onClose={() => setError(null)} />

                    <div className="input-group">
                        <label htmlFor="roomPassword">Room Password</label>
                        <input
                            type="password"
                            id="roomPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter room password"
                            required
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !password.trim()}
                        >
                            {loading ? 'Joining...' : 'Join Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinRoomModal;