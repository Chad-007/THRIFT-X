package com.example.thriftxbackend.service;

public class SupabaseException extends RuntimeException {
    private final int statusCode;

    public SupabaseException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}