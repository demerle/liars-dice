import { useState, useEffect, useRef, useCallback } from 'react';
import { createWebSocketUrl } from '../utils/helpers';

export const useWebSocket = (path, onMessage, onConnect, onDisconnect) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const wsUrl = createWebSocketUrl(path);
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log('WebSocket connected to:', path);
                setConnected(true);
                setError(null);
                reconnectAttemptsRef.current = 0;
                if (onConnect) onConnect();
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (onMessage) onMessage(data);
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err);
                }
            };

            wsRef.current.onclose = (event) => {
                console.log('WebSocket disconnected from:', path);
                setConnected(false);
                if (onDisconnect) onDisconnect();

                // Attempt to reconnect if not closed intentionally
                if (!event.wasClean && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++;
                    console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectDelay);
                } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    setError('Connection lost. Please refresh the page.');
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('WebSocket connection error');
            };

        } catch (err) {
            console.error('Failed to create WebSocket connection:', err);
            setError('Failed to establish connection');
        }
    }, [path, onMessage, onConnect, onDisconnect]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        if (wsRef.current) {
            wsRef.current.close(1000, 'Component unmounting');
            wsRef.current = null;
        }

        setConnected(false);
        reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent reconnection
    }, []);

    const sendMessage = useCallback((message) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            try {
                wsRef.current.send(JSON.stringify(message));
                return true;
            } catch (err) {
                console.error('Failed to send WebSocket message:', err);
                return false;
            }
        } else {
            console.warn('WebSocket is not connected');
            return false;
        }
    }, []);

    useEffect(() => {
        if (path) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [path, connect, disconnect]);

    return {
        connected,
        error,
        sendMessage,
        connect,
        disconnect
    };
};