import React from 'react';
import RoomList from '../components/rooms/RoomList';
import '../styles/pages/RoomsPage.css';

const RoomsPage = () => {
    return (
        <div className="rooms-page">
            <div className="container">
                <RoomList />
            </div>
        </div>
    );
};

export default RoomsPage;