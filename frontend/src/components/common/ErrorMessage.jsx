import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="error-message">
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        marginLeft: '10px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;