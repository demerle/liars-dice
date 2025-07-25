import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="loading">
            <p>{message}</p>
        </div>
    );
};

export default Loading;