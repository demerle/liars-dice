package com.example.liarsdice.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "dice_count")
    private Integer diceCount = 5;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "player_order")
    private Integer playerOrder;

    // Transient field to hold current dice values (not persisted)
    @Transient
    private List<Integer> currentDice;

    // Constructors
    public Player() {}

    public Player(Game game, User user, Integer playerOrder) {
        this.game = game;
        this.user = user;
        this.playerOrder = playerOrder;
    }

    // Helper methods
    public boolean isEliminated() {
        return diceCount <= 0;
    }

    public void loseDie() {
        if (diceCount > 0) {
            diceCount--;
        }
        if (diceCount == 0) {
            isActive = false;
        }
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getDiceCount() {
        return diceCount;
    }

    public void setDiceCount(Integer diceCount) {
        this.diceCount = diceCount;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getPlayerOrder() {
        return playerOrder;
    }

    public void setPlayerOrder(Integer playerOrder) {
        this.playerOrder = playerOrder;
    }

    public List<Integer> getCurrentDice() {
        return currentDice;
    }

    public void setCurrentDice(List<Integer> currentDice) {
        this.currentDice = currentDice;
    }
}