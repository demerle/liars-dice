package com.example.liarsdice.service;

import com.example.liarsdice.dto.request.CreateRoomRequest;
import com.example.liarsdice.dto.request.JoinRoomRequest;
import com.example.liarsdice.dto.response.RoomResponse;
import com.example.liarsdice.model.Room;
import com.example.liarsdice.model.User;
import com.example.liarsdice.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findByIsActiveTrue()
                .stream()
                .map(RoomResponse::new)
                .collect(Collectors.toList());
    }

    public List<RoomResponse> getAvailableRooms() {
        return roomRepository.findAvailableRooms()
                .stream()
                .map(RoomResponse::new)
                .collect(Collectors.toList());
    }

    public Optional<RoomResponse> getRoomById(Long roomId) {
        return roomRepository.findById(roomId)
                .map(RoomResponse::new);
    }

    public RoomResponse createRoom(CreateRoomRequest request, User creator) {
        String passwordHash = null;
        if (request.hasPassword()) {
            passwordHash = passwordEncoder.encode(request.getPassword());
        }

        Room room = new Room(request.getName(), creator, passwordHash, request.getMaxPlayers());
        room = roomRepository.save(room);

        return new RoomResponse(room);
    }

    public RoomResponse joinRoom(Long roomId, JoinRoomRequest request, User user) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.canJoin()) {
            throw new RuntimeException("Cannot join room: " +
                    (room.isFull() ? "Room is full" : "Room is not active"));
        }

        // Check password if room has one
        if (room.hasPassword()) {
            if (request.getPassword() == null ||
                    !passwordEncoder.matches(request.getPassword(), room.getPasswordHash())) {
                throw new RuntimeException("Invalid room password");
            }
        }

        // Add user to room (increment current players)
        room.setCurrentPlayers(room.getCurrentPlayers() + 1);
        room = roomRepository.save(room);

        return new RoomResponse(room);
    }

    public void leaveRoom(Long roomId, User user) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getCurrentPlayers() > 0) {
            room.setCurrentPlayers(room.getCurrentPlayers() - 1);
        }

        // If room creator leaves and room is empty, deactivate room
        if (room.getCreator().getId().equals(user.getId()) && room.getCurrentPlayers() == 0) {
            room.setIsActive(false);
        }

        roomRepository.save(room);
    }

    public void deleteRoom(Long roomId, User user) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Only room creator can delete room
        if (!room.getCreator().getId().equals(user.getId())) {
            throw new RuntimeException("Only room creator can delete the room");
        }

        room.setIsActive(false);
        roomRepository.save(room);
    }

    public List<RoomResponse> searchRooms(String name) {
        return roomRepository.findByNameContainingAndIsActiveTrue(name)
                .stream()
                .map(RoomResponse::new)
                .collect(Collectors.toList());
    }

    public Room findById(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }
}