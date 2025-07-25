package com.example.liarsdice.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class GameWebSocketHandler implements WebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(GameWebSocketHandler.class);

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map to store game/room sessions
    private final Map<String, CopyOnWriteArraySet<WebSocketSession>> gameRooms = new ConcurrentHashMap<>();
    private final Map<String, String> sessionToRoom = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        logger.info("WebSocket connection established: {}", session.getId());

        String uri = session.getUri().getPath();
        String roomId = extractRoomIdFromUri(uri);

        if (roomId != null) {
            gameRooms.computeIfAbsent(roomId, k -> new CopyOnWriteArraySet<>()).add(session);
            sessionToRoom.put(session.getId(), roomId);

            // Send welcome message
            sendMessage(session, createMessage("connected", "Connected to room " + roomId, null));

            // Notify other users in the room
            broadcastToRoom(roomId, createMessage("user_joined", "A user joined the room", null), session);

            logger.info("User joined room: {}", roomId);
        }
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        logger.info("Received message from session {}: {}", session.getId(), message.getPayload());

        try {
            String payload = message.getPayload().toString();
            @SuppressWarnings("unchecked")
            Map<String, Object> messageData = objectMapper.readValue(payload, Map.class);

            String roomId = sessionToRoom.get(session.getId());
            if (roomId != null) {
                // Echo the message to all users in the room
                broadcastToRoom(roomId, messageData, null);
            }
        } catch (Exception e) {
            logger.error("Error handling message", e);
            sendMessage(session, createMessage("error", "Invalid message format", null));
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        logger.error("WebSocket transport error for session {}: {}", session.getId(), exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        logger.info("WebSocket connection closed: {} with status: {}", session.getId(), closeStatus);

        String roomId = sessionToRoom.remove(session.getId());
        if (roomId != null) {
            CopyOnWriteArraySet<WebSocketSession> roomSessions = gameRooms.get(roomId);
            if (roomSessions != null) {
                roomSessions.remove(session);

                // Notify other users in the room
                broadcastToRoom(roomId, createMessage("user_left", "A user left the room", null), null);

                // Clean up empty rooms
                if (roomSessions.isEmpty()) {
                    gameRooms.remove(roomId);
                }
            }
        }
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    // Utility methods
    private String extractRoomIdFromUri(String uri) {
        // Extract room/game ID from URI like /ws/game/123 or /ws/room/456
        String[] parts = uri.split("/");
        if (parts.length >= 3) {
            return parts[parts.length - 1]; // Last part is the ID
        }
        return null;
    }

    private void sendMessage(WebSocketSession session, Map<String, Object> message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            session.sendMessage(new TextMessage(json));
        } catch (IOException e) {
            logger.error("Error sending message to session {}: {}", session.getId(), e.getMessage());
        }
    }

    private void broadcastToRoom(String roomId, Map<String, Object> message, WebSocketSession excludeSession) {
        CopyOnWriteArraySet<WebSocketSession> roomSessions = gameRooms.get(roomId);
        if (roomSessions != null) {
            for (WebSocketSession session : roomSessions) {
                if (session.isOpen() && !session.equals(excludeSession)) {
                    sendMessage(session, message);
                }
            }
        }
    }

    private Map<String, Object> createMessage(String type, String message, Object data) {
        Map<String, Object> messageMap = new HashMap<>();
        messageMap.put("type", type);
        messageMap.put("message", message);
        messageMap.put("data", data);
        messageMap.put("timestamp", System.currentTimeMillis());
        return messageMap;
    }

    // Public methods for external use
    public void broadcastGameUpdate(String gameId, Object gameState) {
        broadcastToRoom(gameId, createMessage("game_update", "Game state updated", gameState), null);
    }

    public void broadcastRoomUpdate(String roomId, Object roomState) {
        broadcastToRoom(roomId, createMessage("room_update", "Room state updated", roomState), null);
    }
}