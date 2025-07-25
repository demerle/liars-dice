package com.example.liarsdice.dto.response;

import com.example.liarsdice.model.Room;

import java.time.LocalDateTime;

public class RoomResponse {

    private Long id;
    private String name;
    private boolean hasPassword;
    private Integer maxPlayers;
    private Integer currentPlayers;
    private String creatorUsername;
    private boolean isActive;
    private LocalDateTime createdAt;

    // Constructors
    public RoomResponse() {}

    public RoomResponse(Room room) {
        this.id = room.getId();
        this.name = room.getName();
        this.hasPassword = room.hasPassword();
        this.maxPlayers = room.getMaxPlayers();
        this.currentPlayers = room.getCurrentPlayers();
        this.creatorUsername = room.getCreator().getUsername();
        this.isActive = room.getIsActive();
        this.createdAt = room.getCreatedAt();
    }

    // Helper methods
    public boolean isFull() {
        return currentPlayers >= maxPlayers;
    }

    public boolean canJoin() {
        return isActive && !isFull();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isHasPassword() {
        return hasPassword;
    }

    public void setHasPassword(boolean hasPassword) {
        this.hasPassword = hasPassword;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public Integer getCurrentPlayers() {
        return currentPlayers;
    }

    public void setCurrentPlayers(Integer currentPlayers) {
        this.currentPlayers = currentPlayers;
    }

    public String getCreatorUsername() {
        return creatorUsername;
    }

    public void setCreatorUsername(String creatorUsername) {
        this.creatorUsername = creatorUsername;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}