package com.example.liarsdice.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class GameMoveRequest {

    @NotBlank(message = "Move type is required")
    private String moveType; // "BID" or "CHALLENGE"

    @Min(value = 1, message = "Bid quantity must be at least 1")
    private Integer bidQuantity;

    @Min(value = 1, message = "Bid face value must be between 1 and 6")
    @Max(value = 6, message = "Bid face value must be between 1 and 6")
    private Integer bidFaceValue;

    // Constructors
    public GameMoveRequest() {}

    public GameMoveRequest(String moveType) {
        this.moveType = moveType;
    }

    public GameMoveRequest(String moveType, Integer bidQuantity, Integer bidFaceValue) {
        this.moveType = moveType;
        this.bidQuantity = bidQuantity;
        this.bidFaceValue = bidFaceValue;
    }

    // Helper methods
    public boolean isBid() {
        return "BID".equalsIgnoreCase(moveType);
    }

    public boolean isChallenge() {
        return "CHALLENGE".equalsIgnoreCase(moveType);
    }

    // Getters and Setters
    public String getMoveType() {
        return moveType;
    }

    public void setMoveType(String moveType) {
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
}