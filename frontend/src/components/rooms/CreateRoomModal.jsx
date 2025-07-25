import React, { useState } from 'react';
import { roomService } from '../../services/roomService';
import { MIN_PLAYERS, MAX_PLAYERS } from '../../utils/constants';
import ErrorMessage from '../common/ErrorMessage';

const CreateRoomModal = ({ onClose, onRoomCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        maxPlayers: 6
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const roomData = {
                name: formData.name.trim(),
                maxPlayers: formData.maxPlayers
            };

            // Only include password if provided
            if (formData.password.trim()) {
                roomData.password = formData.password.trim();
            }

            const response = await roomService.createRoom(roomData);

            if (response.success) {
                onRoomCreated();
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
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
                    <h3>Create New Room</h3>
                    <button onClick={onClose} className="modal-close">×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <ErrorMessage message={error} onClose={() => setError(null)} />

                    <div className="input-group">
                        <label htmlFor="roomName">Room Name</label>
                        <input
                            type="text"
                            id="roomName"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter room name"
                            maxLength={100}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="maxPlayers">Max Players</label>
                        <select
                            id="maxPlayers"
                            name="maxPlayers"
                            value={formData.maxPlayers}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            {Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => {
                                const players = MIN_PLAYERS + i;
                                return (
                                    <option key={players} value={players}>
                                        {players} players
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password (Optional)</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Leave empty for public room"
                            disabled={loading}
                        />
                        <small>Leave empty to create a public room</small>
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
                            disabled={loading || !formData.name.trim()}
                        >
                            {loading ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;