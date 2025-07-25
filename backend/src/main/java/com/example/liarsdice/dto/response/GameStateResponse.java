package com.example.liarsdice.dto.response;

import com.example.liarsdice.model.Game;
import com.example.liarsdice.model.Player;

import java.time.LocalDateTime;
import java.util.List;

public class GameStateResponse {

    private Long gameId;
    private String status;
    private String currentPlayerUsername;
    private Integer roundNumber;
    private List<PlayerState> players;
    private GameMove lastMove;
    private LocalDateTime updatedAt;

    // Constructors
    public GameStateResponse() {}

    public GameStateResponse(Game game, List<PlayerState> players, GameMove lastMove) {
        this.gameId = game.getId();
        this.status = game.getStatus().toString();
        this.currentPlayerUsername = game.getCurrentPlayer() != null ?
                game.getCurrentPlayer().getUsername() : null;
        this.roundNumber = game.getRoundNumber();
        this.players = players;
        this.lastMove = lastMove;
        this.updatedAt = game.getUpdatedAt();
    }

    // Inner classes
    public static class PlayerState {
        private String username;
        private Integer diceCount;
        private boolean isActive;
        private Integer playerOrder;
        private List<Integer> dice; // Only visible to the player themselves

        public PlayerState() {}

        public PlayerState(Player player, boolean showDice) {
            this.username = player.getUser().getUsername();
            this.diceCount = player.getDiceCount();
            this.isActive = player.getIsActive();
            this.playerOrder = player.getPlayerOrder();
            this.dice = showDice ? player.getCurrentDice() : null;
        }

        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public Integer getDiceCount() { return diceCount; }
        public void setDiceCount(Integer diceCount) { this.diceCount = diceCount; }
        public boolean isActive() { return isActive; }
        public void setActive(boolean active) { isActive = active; }
        public Integer getPlayerOrder() { return playerOrder; }
        public void setPlayerOrder(Integer playerOrder) { this.playerOrder = playerOrder; }
        public List<Integer> getDice() { return dice; }
        public void setDice(List<Integer> dice) { this.dice = dice; }
    }

    public static class GameMove {
        private String playerUsername;
        private String moveType;
        private Integer bidQuantity;
        private Integer bidFaceValue;
        private String displayText;
        private LocalDateTime createdAt;

        public GameMove() {}

        public GameMove(com.example.liarsdice.model.GameMove move) {
            this.playerUsername = move.getPlayer().getUsername();
            this.moveType = move.getMoveType().toString();
            this.bidQuantity = move.getBidQuantity();
            this.bidFaceValue = move.getBidFaceValue();
            this.displayText = move.getDisplayText();
            this.createdAt = move.getCreatedAt();
        }

        // Getters and Setters
        public String getPlayerUsername() { return playerUsername; }
        public void setPlayerUsername(String playerUsername) { this.playerUsername = playerUsername; }
        public String getMoveType() { return moveType; }
        public void setMoveType(String moveType) { this.moveType = moveType; }
        public Integer getBidQuantity() { return bidQuantity; }
        public void setBidQuantity(Integer bidQuantity) { this.bidQuantity = bidQuantity; }
        public Integer getBidFaceValue() { return bidFaceValue; }
        public void setBidFaceValue(Integer bidFaceValue) { this.bidFaceValue = bidFaceValue; }
        public String getDisplayText() { return displayText; }
        public void setDisplayText(String displayText) { this.displayText = displayText; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    // Getters and Setters
    public Long getGameId() { return gameId; }
    public void setGameId(Long gameId) { this.gameId = gameId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCurrentPlayerUsername() { return currentPlayerUsername; }
    public void setCurrentPlayerUsername(String currentPlayerUsername) { this.currentPlayerUsername = currentPlayerUsername; }
    public Integer getRoundNumber() { return roundNumber; }
    public void setRoundNumber(Integer roundNumber) { this.roundNumber = roundNumber; }
    public List<PlayerState> getPlayers() { return players; }
    public void setPlayers(List<PlayerState> players) { this.players = players; }
    public GameMove getLastMove() { return lastMove; }
    public void setLastMove(GameMove lastMove) { this.lastMove = lastMove; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}