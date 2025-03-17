package com.tma.testmanagement.security.auth;

import com.tma.testmanagement.security.CustomUserDetailsService;
import com.tma.testmanagement.security.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth/refresh")
@RequiredArgsConstructor
public class TokenRefreshController {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @PostMapping
    public ResponseEntity<TokenResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            // Validate refresh token
            if (!jwtUtil.validateRefreshToken(request.refreshToken())) {
                return ResponseEntity.badRequest().build();
            }
            
            // Extract username from refresh token
            String username = jwtUtil.extractUsername(request.refreshToken());
            
            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Generate new tokens
            String accessToken = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
