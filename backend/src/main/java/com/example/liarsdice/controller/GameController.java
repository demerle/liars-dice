package com.example.liarsdice.controller;

import com.example.liarsdice.dto.request.GameMoveRequest;
import com.example.liarsdice.dto.response.ApiResponse;
import com.example.liarsdice.dto.response.GameStateResponse;
import com.example.liarsdice.model.User;
import com.example.liarsdice.service.AuthService;
import com.example.liarsdice.service.GameService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private AuthService authService;

    @GetMapping("/{gameId}")
    public ResponseEntity<?> getGameState(@PathVariable Long gameId) {
        try {
            User currentUser = authService.getCurrentUser();
            GameStateResponse gameState = gameService.getGameState(gameId, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Game state retrieved successfully", gameState));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get game state: " + e.getMessage()));
        }
    }

    @PostMapping("/{gameId}/start")
    public ResponseEntity<?> startGame(@PathVariable Long gameId) {
        try {
            User currentUser = authService.getCurrentUser();
            GameStateResponse gameState = gameService.startGame(gameId, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Game started successfully", gameState));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to start game: " + e.getMessage()));
        }
    }

    @PostMapping("/{gameId}/move")
    public ResponseEntity<?> makeMove(@PathVariable Long gameId,
                                      @Valid @RequestBody GameMoveRequest request) {
        try {
            User currentUser = authService.getCurrentUser();
            GameStateResponse gameState = gameService.makeMove(gameId, request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Move made successfully", gameState));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to make move: " + e.getMessage()));
        }
    }

    @GetMapping("/{gameId}/history")
    public ResponseEntity<?> getGameHistory(@PathVariable Long gameId) {
        try {
            List<GameStateResponse.GameMove> history = gameService.getGameHistory(gameId);
            return ResponseEntity.ok(ApiResponse.success("Game history retrieved successfully", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get game history: " + e.getMessage()));
        }
    }
}