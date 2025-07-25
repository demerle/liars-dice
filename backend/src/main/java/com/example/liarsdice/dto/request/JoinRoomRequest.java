package com.example.liarsdice.dto.request;

public class JoinRoomRequest {

    private String password;

    // Constructors
    public JoinRoomRequest() {}

    public JoinRoomRequest(String password) {
        this.password = password;
    }

    // Getters and Setters
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}