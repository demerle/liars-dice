package com.example.liarsdice.service;

import com.example.liarsdice.dto.request.GameMoveRequest;
import com.example.liarsdice.dto.response.GameStateResponse;
import com.example.liarsdice.model.*;
import com.example.liarsdice.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private RoomService roomService;

    private final Random random = new Random();

    public GameStateResponse getGameState(Long gameId, User currentUser) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Get players for this game (this would need a PlayerRepository in a full implementation)
        List<GameStateResponse.PlayerState> players = getPlayersForGame(game, currentUser);

        // Get last move (this would need a GameMoveRepository in a full implementation)
        GameStateResponse.GameMove lastMove = getLastMoveForGame(game);

        return new GameStateResponse(game, players, lastMove);
    }

    public GameStateResponse startGame(Long gameId, User user) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Check if user is room creator
        if (!game.getRoom().getCreator().getId().equals(user.getId())) {
            throw new RuntimeException("Only room creator can start the game");
        }

        if (game.getStatus() != Game.GameStatus.WAITING) {
            throw new RuntimeException("Game is not in waiting state");
        }

        // Check minimum players (this would be implemented with actual player management)
        if (game.getRoom().getCurrentPlayers() < 2) {
            throw new RuntimeException("Need at least 2 players to start the game");
        }

        game.setStatus(Game.GameStatus.IN_PROGRESS);
        game = gameRepository.save(game);

        // Initialize game state (roll dice for all players, set first player, etc.)
        initializeGameState(game);

        return getGameState(gameId, user);
    }

    public GameStateResponse makeMove(Long gameId, GameMoveRequest request, User user) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (game.getStatus() != Game.GameStatus.IN_PROGRESS) {
            throw new RuntimeException("Game is not in progress");
        }

        // Validate it's the player's turn
        if (game.getCurrentPlayer() == null || !game.getCurrentPlayer().getId().equals(user.getId())) {
            throw new RuntimeException("It's not your turn");
        }

        // Process the move
        if (request.isBid()) {
            processBid(game, user, request);
        } else if (request.isChallenge()) {
            processChallenge(game, user, request);
        } else {
            throw new RuntimeException("Invalid move type");
        }

        return getGameState(gameId, user);
    }

    public List<GameStateResponse.GameMove> getGameHistory(Long gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // This would fetch from GameMoveRepository in a full implementation
        return getGameMovesForGame(game);
    }

    private void initializeGameState(Game game) {
        // In a full implementation, this would:
        // 1. Create Player entities for all users in the room
        // 2. Roll initial dice for each player
        // 3. Set the first current player
        // 4. Save all the initial state

        // For now, just set a placeholder current player
        game.setCurrentPlayer(game.getRoom().getCreator());
        gameRepository.save(game);
    }

    private void processBid(Game game, User user, GameMoveRequest request) {
        // Validate bid
        if (request.getBidQuantity() == null || request.getBidFaceValue() == null) {
            throw new RuntimeException("Bid must include quantity and face value");
        }

        if (request.getBidQuantity() < 1) {
            throw new RuntimeException("Bid quantity must be at least 1");
        }

        if (request.getBidFaceValue() < 1 || request.getBidFaceValue() > 6) {
            throw new RuntimeException("Bid face value must be between 1 and 6");
        }

        // Create and save game move
        GameMove move = new GameMove(game, user, request.getBidQuantity(), request.getBidFaceValue());
        // In full implementation: gameMoveRepository.save(move);

        // Set next player
        setNextPlayer(game);
        gameRepository.save(game);
    }

    private void processChallenge(Game game, User user, GameMoveRequest request) {
        // Create and save challenge move
        GameMove move = new GameMove(game, user, GameMove.MoveType.CHALLENGE);
        // In full implementation: gameMoveRepository.save(move);

        // Resolve challenge (count actual dice, determine winner/loser)
        resolveChallenge(game);
    }

    private void resolveChallenge(Game game) {
        // In a full implementation, this would:
        // 1. Get the last bid
        // 2. Count all dice matching the bid
        // 3. Determine if challenge succeeds or fails
        // 4. Remove dice from losing player
        // 5. Check for game end condition
        // 6. Start new round or end game

        // For now, just advance to next round
        game.setRoundNumber(game.getRoundNumber() + 1);
        gameRepository.save(game);
    }

    private void setNextPlayer(Game game) {
        // In a full implementation, this would cycle through active players
        // For now, keep the same player (placeholder)
    }

    private List<GameStateResponse.PlayerState> getPlayersForGame(Game game, User currentUser) {
        // Placeholder implementation
        // In a full implementation, this would fetch from PlayerRepository
        List<GameStateResponse.PlayerState> players = new ArrayList<>();

        // Add room creator as a player
        GameStateResponse.PlayerState creatorState = new GameStateResponse.PlayerState();
        creatorState.setUsername(game.getRoom().getCreator().getUsername());
        creatorState.setDiceCount(5);
        creatorState.setActive(true);
        creatorState.setPlayerOrder(1);

        // Only show dice to the player themselves
        if (game.getRoom().getCreator().getId().equals(currentUser.getId())) {
            creatorState.setDice(generateRandomDice(5));
        }

        players.add(creatorState);
        return players;
    }

    private GameStateResponse.GameMove getLastMoveForGame(Game game) {
        // Placeholder implementation
        // In a full implementation, this would fetch the most recent move from GameMoveRepository
        return null;
    }

    private List<GameStateResponse.GameMove> getGameMovesForGame(Game game) {
        // Placeholder implementation
        // In a full implementation, this would fetch all moves from GameMoveRepository
        return new ArrayList<>();
    }

    private List<Integer> generateRandomDice(int count) {
        List<Integer> dice = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            dice.add(random.nextInt(6) + 1);
        }
        return dice;
    }

    public Optional<Game> findActiveGameByRoomId(Long roomId) {
        return gameRepository.findActiveGameByRoomId(roomId);
    }

    public Game createGameForRoom(Room room) {
        Game game = new Game(room);
        return gameRepository.save(game);
    }
}