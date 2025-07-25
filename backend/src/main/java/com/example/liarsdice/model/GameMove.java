package com.example.liarsdice.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "game_moves")
public class GameMove {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private User player;

    @Enumerated(EnumType.STRING)
    @Column(name = "move_type", nullable = false)
    private MoveType moveType;

    @Column(name = "bid_quantity")
    private Integer bidQuantity;

    @Column(name = "bid_face_value")
    private Integer bidFaceValue;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public GameMove() {}

    public GameMove(Game game, User player, MoveType moveType) {
        this.game = game;
        this.player = player;
        this.moveType = moveType;
    }

    public GameMove(Game game, User player, Integer bidQuantity, Integer bidFaceValue) {
        this.game = game;
        this.player = player;
        this.moveType = MoveType.BID;
        this.bidQuantity = bidQuantity;
        this.bidFaceValue = bidFaceValue;
    }

    // Helper methods
    public boolean isBid() {
        return moveType == MoveType.BID;
    }

    public boolean isChallenge() {
        return moveType == MoveType.CHALLENGE;
    }

    public String getDisplayText() {
        if (isBid()) {
            return String.format("%s bid %d %ds", player.getUsername(), bidQuantity, bidFaceValue);
        } else if (isChallenge()) {
            return String.format("%s challenged", player.getUsername());
        }
        return String.format("%s made a move", player.getUsername());
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public User getPlayer() {
        return player;
    }

    public void setPlayer(User player) {
        this.player = player;
    }

    public MoveType getMoveType() {
        return moveType;
    }

    public void setMoveType(MoveType moveType) {
        this.moveType = moveType;
    }

    public Integer getBidQuantity() {
        return bidQuantity;
    }

    public void setBidQuantity(Integer bidQuantity) {
        this.bidQuantity = bidQuantity;
    }

    public Integer getBidFaceValue() {
        return bidFaceValue;
    }

    public void setBidFaceValue(Integer bidFaceValue) {
        this.bidFaceValue = bidFaceValue;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Enums
    public enum MoveType {
        BID,
        CHALLENGE
    }
}