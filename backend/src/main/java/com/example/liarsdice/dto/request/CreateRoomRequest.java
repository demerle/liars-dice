package com.example.liarsdice.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateRoomRequest {

    @NotBlank(message = "Room name is required")
    @Size(min = 1, max = 100, message = "Room name must be between 1 and 100 characters")
    private String name;

    private String password;

    @Min(value = 2, message = "Minimum 2 players required")
    @Max(value = 6, message = "Maximum 6 players allowed")
    private Integer maxPlayers = 6;

    // Constructors
    public CreateRoomRequest() {}

    public CreateRoomRequest(String name, String password, Integer maxPlayers) {
        this.name = name;
        this.password = password;
        this.maxPlayers = maxPlayers != null ? maxPlayers : 6;
    }

    // Helper methods
    public boolean hasPassword() {
        return password != null && !password.trim().isEmpty();
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }
}