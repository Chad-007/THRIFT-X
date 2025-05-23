package com.example.thriftxbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SupabaseService {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseService.class);

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    private final ObjectMapper mapper = new ObjectMapper();

    public String signupUser(String email, String password, String username) throws SupabaseException {
        logger.debug("Attempting signup for email: {}, username: {}", email, username);
        
        // Basic input validation
        if (email == null || email.isEmpty()) {
            logger.warn("Email is null or empty");
            throw new SupabaseException("Email is required", 400);
        }
        if (password == null || password.isEmpty()) {
            logger.warn("Password is null or empty");
            throw new SupabaseException("Password is required", 400);
        }
        if (username == null || username.isEmpty()) {
            logger.warn("Username is null or empty");
            throw new SupabaseException("Username is required", 400);
        }

        String authUrl = supabaseUrl + "/auth/v1/signup";

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            // Sign up the user
            HttpPost signupRequest = new HttpPost(authUrl);
            signupRequest.addHeader("apikey", supabaseKey);
            signupRequest.addHeader("Authorization", "Bearer " + supabaseKey);
            signupRequest.addHeader("Content-Type", "application/json");

            Map<String, String> signupData = Map.of("email", email, "password", password);
            String jsonSignup = mapper.writeValueAsString(signupData);
            signupRequest.setEntity(new StringEntity(jsonSignup));

            String signupResponse = client.execute(signupRequest, response -> {
                int status = response.getCode();
                String body = EntityUtils.toString(response.getEntity());
                logger.debug("Supabase signup response: Status={}, Body={}", status, body);
                if (status == 200 || status == 201) {
                    return body;
                } else {
                    logger.warn("Signup failed: Status={}, Body={}", status, body);
                    throw new SupabaseException("Signup failed: " + body, status);
                }
            });

            String userId = parseUserIdFromResponse(signupResponse);

            // Insert profile
            String profileUrl = supabaseUrl + "/rest/v1/profiles";
            HttpPost profileRequest = new HttpPost(profileUrl);
            profileRequest.addHeader("apikey", supabaseKey);
            profileRequest.addHeader("Authorization", "Bearer " + supabaseKey);
            profileRequest.addHeader("Content-Type", "application/json");
            profileRequest.addHeader("Prefer", "return=representation");

            Map<String, String> profileData = Map.of(
                "id", userId,
                "username", username,
                "email", email
            );
            String jsonProfile = mapper.writeValueAsString(profileData);
            profileRequest.setEntity(new StringEntity(jsonProfile));

            String profileResponse = client.execute(profileRequest, response -> {
                int status = response.getCode();
                String body = EntityUtils.toString(response.getEntity());
                logger.debug("Supabase profile response: Status={}, Body={}", status, body);
                if (status == 200 || status == 201) {
                    return body;
                } else {
                    logger.warn("Profile insert failed: Status={}, Body={}", status, body);
                    throw new SupabaseException("Profile insert failed: " + body, status);
                }
            });

            logger.info("Signup successful for email: {}", email);
            return profileResponse;

        } catch (SupabaseException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Failed to communicate with Supabase for email: {}", email, e);
            throw new SupabaseException("Failed to communicate with Supabase: " + e.getMessage(), 500);
        }
    }

    private String parseUserIdFromResponse(String response) throws SupabaseException {
        try {
            JsonNode root = mapper.readTree(response);
            if (root.has("user")) {
                JsonNode userNode = root.get("user");
                if (userNode.has("id")) {
                    return userNode.get("id").asText();
                } else {
                    logger.error("User ID not found in signup response: {}", response);
                    throw new SupabaseException("User ID not found in signup response", 500);
                }
            } else {
                logger.error("User object not found in signup response: {}", response);
                throw new SupabaseException("User object not found in signup response", 500);
            }
        } catch (Exception e) {
            logger.error("Failed to parse signup response: {}", response, e);
            throw new SupabaseException("Failed to parse signup response: " + e.getMessage(), 500);
        }
    }
}