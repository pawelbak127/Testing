package com.tma.testmanagement.security.auth.google;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.tma.testmanagement.security.CustomUserDetails;
import com.tma.testmanagement.security.config.JwtUtil;
import com.tma.testmanagement.security.auth.TokenResponse;
import com.tma.testmanagement.user.models.User;
import com.tma.testmanagement.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleAuthService {

    @Value("${google.client-id}")
    private String clientId;

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authenticates a user using a Google ID token.
     * If the token is valid, it creates or finds the user and generates a JWT token.
     *
     * @param idTokenString The Google ID token string
     * @return A TokenResponse containing the JWT token
     * @throws GeneralSecurityException If token verification fails
     * @throws IOException If network communication fails
     * @throws IllegalArgumentException If the token is invalid
     */
    @Transactional
    public TokenResponse authenticateWithGoogle(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google ID token");
        }

        Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String firstName = (String) payload.get("given_name");
        String lastName = (String) payload.get("family_name");
        
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update user details if they've changed
            user.setFirst(firstName);
            user.setLast(lastName);
            user = userRepository.save(user);
        } else {
            // Create new user
            user = createGoogleUser(email, firstName, lastName);
        }
        
        // Generate JWT tokens
        String jwtToken = jwtUtil.generateToken(new CustomUserDetails(user));
        String refreshToken = jwtUtil.generateRefreshToken(new CustomUserDetails(user));
        
        return new TokenResponse(jwtToken, refreshToken);
    }
    
    private User createGoogleUser(String email, String firstName, String lastName) {
        User user = new User();
        user.setEmail(email);
        user.setFirst(firstName != null ? firstName : "");
        user.setLast(lastName != null ? lastName : "");
        user.setLogin(createUniqueLogin(email));
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setLocale("en");
        user.setActive(true);
        user.setCreationTs(Instant.now());
        user.setExpirationDate(LocalDate.now().plus(365, ChronoUnit.DAYS));
        return userRepository.save(user);
    }
    
    private String createUniqueLogin(String email) {
        String baseLogin = email.substring(0, email.indexOf('@'));
        String login = baseLogin;
        int counter = 1;
        
        while (userRepository.findByLogin(login).isPresent()) {
            login = baseLogin + counter++;
        }
        
        return login;
    }
}
