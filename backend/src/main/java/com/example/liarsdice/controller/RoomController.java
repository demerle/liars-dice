package com.example.liarsdice.controller;

import com.example.liarsdice.dto.request.CreateRoomRequest;
import com.example.liarsdice.dto.request.JoinRoomRequest;
import com.example.liarsdice.dto.response.ApiResponse;
import com.example.liarsdice.dto.response.RoomResponse;
import com.example.liarsdice.model.User;
import com.example.liarsdice.service.AuthService;
import com.example.liarsdice.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<?> getAllRooms(@RequestParam(required = false) String search) {
        try {
            List<RoomResponse> rooms;
            if (search != null && !search.trim().isEmpty()) {
                rooms = roomService.searchRooms(search.trim());
            } else {
                rooms = roomService.getAvailableRooms();
            }
            return ResponseEntity.ok(ApiResponse.success("Rooms retrieved successfully", rooms));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve rooms: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        try {
            User currentUser = authService.getCurrentUser();
            RoomResponse room = roomService.createRoom(request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Room created successfully", room));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create room: " + e.getMessage()));
        }
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoomDetails(@PathVariable Long roomId) {
        try {
            Optional<RoomResponse> room = roomService.getRoomById(roomId);
            if (room.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Room retrieved successfully", room.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve room: " + e.getMessage()));
        }
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<?> joinRoom(@PathVariable Long roomId,
                                      @RequestBody(required = false) JoinRoomRequest request) {
        try {
            User currentUser = authService.getCurrentUser();
            if (request == null) {
                request = new JoinRoomRequest();
            }
            RoomResponse room = roomService.joinRoom(roomId, request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Joined room successfully", room));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to join room: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{roomId}/leave")
    public ResponseEntity<?> leaveRoom(@PathVariable Long roomId) {
        try {
            User currentUser = authService.getCurrentUser();
            roomService.leaveRoom(roomId, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Left room successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to leave room: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId) {
        try {
            User currentUser = authService.getCurrentUser();
            roomService.deleteRoom(roomId, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Room deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete room: " + e.getMessage()));
        }
    }
}