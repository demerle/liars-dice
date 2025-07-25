package com.example.liarsdice.controller;

import com.example.liarsdice.dto.response.ApiResponse;
import com.example.liarsdice.dto.response.AuthResponse;
import com.example.liarsdice.model.User;
import com.example.liarsdice.service.AuthService;
import com.example.liarsdice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            User currentUser = authService.getCurrentUser();
            AuthResponse userResponse = new AuthResponse("", currentUser);
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", userResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get profile: " + e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody Map<String, String> updates) {
        try {
            User currentUser = authService.getCurrentUser();
            String newEmail = updates.get("email");

            if (newEmail != null && !newEmail.trim().isEmpty()) {
                User updatedUser = userService.updateProfile(currentUser, newEmail.trim());
                AuthResponse userResponse = new AuthResponse("", updatedUser);
                return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userResponse));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email is required"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update profile: " + e.getMessage()));
        }
    }
}