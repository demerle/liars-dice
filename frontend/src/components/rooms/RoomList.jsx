import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';
import RoomCard from './RoomCard';
import CreateRoomModal from './CreateRoomModal';
import JoinRoomModal from './JoinRoomModal';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import '../../styles/components/RoomList.css';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRooms = async (search = '') => {
        try {
            setError(null);
            const response = await roomService.getRooms(search);
            if (response.success) {
                setRooms(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch rooms');
            console.error('Error fetching rooms:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchRooms(searchQuery);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchRooms(searchQuery);
    };

    const handleCreateRoom = () => {
        setShowCreateModal(true);
    };

    const handleJoinRoom = (room) => {
        setSelectedRoom(room);
        if (room.hasPassword) {
            setShowJoinModal(true);
        } else {
            // Join directly if no password
            joinRoom(room.id, '');
        }
    };

    const joinRoom = async (roomId, password) => {
        try {
            const response = await roomService.joinRoom(roomId, password);
            if (response.success) {
                // Navigate to game page or show success
                console.log('Joined room successfully:', response.data);
                handleRefresh(); // Refresh room list
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join room');
        }
    };

    const handleRoomCreated = () => {
        setShowCreateModal(false);
        handleRefresh();
    };

    const handleRoomJoined = () => {
        setShowJoinModal(false);
        setSelectedRoom(null);
        handleRefresh();
    };

    const clearError = () => {
        setError(null);
    };

    if (loading && !refreshing) {
        return <Loading message="Loading rooms..." />;
    }

    return (
        <div className="room-list-container">
            <div className="room-list-header">
                <h2>Game Rooms</h2>
                <div className="room-actions">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn btn-secondary">
                            Search
                        </button>
                    </form>
                    <button
                        onClick={handleCreateRoom}
                        className="btn btn-primary"
                    >
                        Create Room
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="btn btn-secondary"
                        disabled={refreshing}
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            <ErrorMessage message={error} onClose={clearError} />

            <div className="rooms-grid">
                {rooms.length === 0 ? (
                    <div className="no-rooms">
                        <p>No rooms available.</p>
                        <p>Create a new room to start playing!</p>
                    </div>
                ) : (
                    rooms.map(room => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            onJoin={() => handleJoinRoom(room)}
                        />
                    ))
                )}
            </div>

            {showCreateModal && (
                <CreateRoomModal
                    onClose={() => setShowCreateModal(false)}
                    onRoomCreated={handleRoomCreated}
                />
            )}

            {showJoinModal && selectedRoom && (
                <JoinRoomModal
                    room={selectedRoom}
                    onClose={() => {
                        setShowJoinModal(false);
                        setSelectedRoom(null);
                    }}
                    onJoin={(password) => {
                        joinRoom(selectedRoom.id, password);
                        setShowJoinModal(false);
                        setSelectedRoom(null);
                    }}
                />
            )}
        </div>
    );
};

export default RoomList;