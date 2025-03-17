package com.tma.testmanagement.security.auth.google;

import com.tma.testmanagement.security.auth.TokenResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth/google")
@RequiredArgsConstructor
@Slf4j
public class GoogleAuthController {

    private final GoogleAuthService googleAuthService;

    @PostMapping
    public ResponseEntity<TokenResponse> authenticateGoogle(@Valid @RequestBody GoogleAuthRequest request) {
        try {
            TokenResponse tokenResponse = googleAuthService.authenticateWithGoogle(request.idToken());
            return ResponseEntity.ok(tokenResponse);
        } catch (Exception e) {
            log.error("Error during Google authentication", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
