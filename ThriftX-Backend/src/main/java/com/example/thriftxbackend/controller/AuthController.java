package com.example.thriftxbackend.controller;

import com.example.thriftxbackend.dto.SignupRequest;
import com.example.thriftxbackend.service.SupabaseException;
import com.example.thriftxbackend.service.SupabaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private SupabaseService supabaseService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        logger.debug("Received signup request: {}", signupRequest);

        // Basic input validation
        if (signupRequest == null || signupRequest.getUsername() == null || signupRequest.getUsername().isEmpty() ||
            signupRequest.getEmail() == null || signupRequest.getEmail().isEmpty() ||
            signupRequest.getPassword() == null || signupRequest.getPassword().isEmpty()) {
            logger.warn("Invalid input: username, email, or password is null or empty");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "All fields are required"));
        }

        String email = signupRequest.getEmail().trim();
        String username = signupRequest.getUsername().trim();
        String password = signupRequest.getPassword();

        logger.debug("Processed input: email='{}', username='{}'", email, username);

        try {
            String result = supabaseService.signupUser(email, password, username);
            logger.info("Signup successful for email: {}", email);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (SupabaseException e) {
            String errorMessage = e.getMessage();
            if (errorMessage.contains("email_address_invalid")) {
                errorMessage = "Invalid email address. Please check your email and try again.";
            } else if (errorMessage.contains("weak_password")) {
                errorMessage = "Password is too weak. Please use a stronger password.";
            } else if (errorMessage.contains("User ID not found")) {
                errorMessage = "Failed to create user account. Please try again.";
            } else if (errorMessage.contains("over_email_send_rate_limit")) {
                errorMessage = "Too many signup attempts. Please wait a few minutes and try again.";
            } else if (errorMessage.contains("duplicate key value") || errorMessage.contains("already exists")) {
                errorMessage = "An account with this email already exists.";
            }
            logger.warn("Supabase error during signup: {}", errorMessage);
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", errorMessage));
        } catch (Exception e) {
            logger.error("Unexpected error during signup for email: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }
}