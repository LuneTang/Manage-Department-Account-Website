package com.vti.service.Auth;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    // ConcurrentHashMap to store blacklisted tokens in memory
    private final ConcurrentHashMap<String, Long> blacklistedTokens = new ConcurrentHashMap<>();

    // Add token to blacklist
    public void addToBlacklist(String token) {
        blacklistedTokens.put(token, System.currentTimeMillis());
    }

    // Check if token is blacklisted
    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }

    // Remove token from blacklist
    public void removeFromBlacklist(String token) {
        blacklistedTokens.remove(token);
    }
}

