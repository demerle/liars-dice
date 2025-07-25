import React from 'react';
import { formatDateTime, canJoinRoom } from '../../utils/helpers';

const RoomCard = ({ room, onJoin }) => {
    const handleJoin = () => {
        if (canJoinRoom(room)) {
            onJoin();
        }
    };

    const getStatusClass = () => {
        if (!room.isActive) return 'inactive';
        if (room.currentPlayers >= room.maxPlayers) return 'full';
        return 'available';
    };

    const getStatusText = () => {
        if (!room.isActive) return 'Inactive';
        if (room.currentPlayers >= room.maxPlayers) return 'Full';
        return 'Available';
    };

    return (
        <div className={`room-card ${getStatusClass()}`}>
            <div className="room-header">
                <h3 className="room-name">{room.name}</h3>
                <div className="room-status">
          <span className={`status-badge ${getStatusClass()}`}>
            {getStatusText()}
          </span>
                </div>
            </div>

            <div className="room-info">
                <div className="info-item">
                    <span className="info-label">Players:</span>
                    <span className="info-value">
            {room.currentPlayers}/{room.maxPlayers}
          </span>
                </div>

                <div className="info-item">
                    <span className="info-label">Creator:</span>
                    <span className="info-value">{room.creatorUsername}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">Created:</span>
                    <span className="info-value">
            {formatDateTime(room.createdAt)}
          </span>
                </div>

                {room.hasPassword && (
                    <div className="info-item">
                        <span className="password-icon">🔒 Password Protected</span>
                    </div>
                )}
            </div>

            <div className="room-actions">
                <button
                    onClick={handleJoin}
                    disabled={!canJoinRoom(room)}
                    className={`btn ${canJoinRoom(room) ? 'btn-primary' : 'btn-secondary'}`}
                >
                    {!room.isActive ? 'Inactive' :
                        room.currentPlayers >= room.maxPlayers ? 'Full' :
                            'Join Room'}
                </button>
            </div>
        </div>
    );
};

export default RoomCard;