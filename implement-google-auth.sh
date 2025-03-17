#!/bin/bash

# Script to implement Google OAuth with JWT authentication
# Usage: ./implement-google-auth.sh /path/to/TestManagementApplication [google-client-id]

set -e

# Check if the path argument is provided
if [ -z "$1" ]; then
  echo "Error: Please provide the path to TestManagementApplication directory."
  echo "Usage: ./implement-google-auth.sh /path/to/TestManagementApplication [google-client-id]"
  exit 1
fi

# Set project root path
PROJECT_ROOT="$1"
GOOGLE_CLIENT_ID="${2:-YOUR_GOOGLE_CLIENT_ID}"

# Validate project directory
if [ ! -d "$PROJECT_ROOT" ]; then
  echo "Error: Directory $PROJECT_ROOT does not exist."
  exit 1
fi

# Check if it's a valid TestManagementApplication
if [ ! -f "$PROJECT_ROOT/backend/pom.xml" ] || [ ! -d "$PROJECT_ROOT/frontend" ]; then
  echo "Error: $PROJECT_ROOT does not appear to be a valid TestManagementApplication directory."
  echo "Expected to find backend/pom.xml and frontend/ directory."
  exit 1
fi

# Create a timestamp for backups
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_DIR="$PROJECT_ROOT/auth_implementation_backup_$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

echo "Created backup directory: $BACKUP_DIR"

# Function to back up a file before modifying it
backup_file() {
  local file="$1"
  if [ -f "$file" ]; then
    local rel_path="${file#$PROJECT_ROOT/}"
    local backup_path="$BACKUP_DIR/$rel_path"
    mkdir -p "$(dirname "$backup_path")"
    cp "$file" "$backup_path"
    echo "Backed up: $rel_path"
  fi
}

# Function to ensure directory exists
ensure_dir() {
  local dir="$1"
  if [ ! -d "$dir" ]; then
    mkdir -p "$dir"
    echo "Created directory: ${dir#$PROJECT_ROOT/}"
  fi
}

echo "Starting implementation of Google OAuth with JWT authentication..."

# --- BACKEND IMPLEMENTATION ---

# 1. Update pom.xml - Add new dependencies
BACKEND_POM="$PROJECT_ROOT/backend/pom.xml"
backup_file "$BACKEND_POM"

# Insert new dependencies before closing </dependencies> tag
sed -i '/<\/dependencies>/i \
\t\t<!-- Google OAuth -->\
\t\t<dependency>\
\t\t\t<groupId>com.google.api-client</groupId>\
\t\t\t<artifactId>google-api-client</artifactId>\
\t\t\t<version>2.4.0</version>\
\t\t</dependency>\
\
\t\t<!-- OAuth2 Client -->\
\t\t<dependency>\
\t\t\t<groupId>org.springframework.boot</groupId>\
\t\t\t<artifactId>spring-boot-starter-oauth2-client</artifactId>\
\t\t</dependency>\
\
\t\t<!-- Validation -->\
\t\t<dependency>\
\t\t\t<groupId>org.springframework.boot</groupId>\
\t\t\t<artifactId>spring-boot-starter-validation</artifactId>\
\t\t</dependency>' "$BACKEND_POM"

echo "Updated: backend/pom.xml with new dependencies"

# 2. Create Google Auth related files
BACKEND_SECURITY_DIR="$PROJECT_ROOT/backend/src/main/java/com/tma/testmanagement/security"
BACKEND_AUTH_DIR="$BACKEND_SECURITY_DIR/auth"
ensure_dir "$BACKEND_AUTH_DIR"
ensure_dir "$BACKEND_AUTH_DIR/google"

# Custom User Details Implementation
backup_file "$BACKEND_SECURITY_DIR/CustomUserDetails.java"
cat > "$BACKEND_SECURITY_DIR/CustomUserDetails.java" << 'EOF'
package com.tma.testmanagement.security;

import com.tma.testmanagement.user.models.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public String getUsername() {
        return user.getLogin();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getActive();
    }
}
EOF

# Token Response Class
cat > "$BACKEND_AUTH_DIR/TokenResponse.java" << 'EOF'
package com.tma.testmanagement.security.auth;

public record TokenResponse(String accessToken, String refreshToken) {}
EOF

# Refresh Token Request
cat > "$BACKEND_AUTH_DIR/RefreshTokenRequest.java" << 'EOF'
package com.tma.testmanagement.security.auth;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(@NotBlank String refreshToken) {}
EOF

# Token Refresh Controller
cat > "$BACKEND_AUTH_DIR/TokenRefreshController.java" << 'EOF'
package com.tma.testmanagement.security.auth;

import com.tma.testmanagement.security.CustomUserDetailsService;
import com.tma.testmanagement.security.JwtUtil;
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
EOF

# Google Authentication Request
cat > "$BACKEND_AUTH_DIR/google/GoogleAuthRequest.java" << 'EOF'
package com.tma.testmanagement.security.auth.google;

import jakarta.validation.constraints.NotBlank;

public record GoogleAuthRequest(@NotBlank String idToken) {}
EOF

# Google Authentication Controller
cat > "$BACKEND_AUTH_DIR/google/GoogleAuthController.java" << 'EOF'
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
EOF

# Google Authentication Service
cat > "$BACKEND_AUTH_DIR/google/GoogleAuthService.java" << 'EOF'
package com.tma.testmanagement.security.auth.google;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.tma.testmanagement.security.CustomUserDetails;
import com.tma.testmanagement.security.JwtUtil;
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
EOF

# 3. Update JwtUtil
backup_file "$BACKEND_SECURITY_DIR/config/JwtUtil.java"
cat > "$BACKEND_SECURITY_DIR/config/JwtUtil.java" << 'EOF'
package com.tma.testmanagement.security.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret-key}")
    private String secretKey;
    
    @Value("${jwt.expiration-time}")
    private String expirationTime;
    
    @Value("${jwt.refresh-expiration-time:2592000000}") // Default: 30 days
    private String refreshExpirationTime;

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, Long.parseLong(expirationTime));
    }
    
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("token_type", "refresh");
        return generateToken(claims, userDetails, Long.parseLong(refreshExpirationTime));
    }
    
    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
    
    public boolean validateRefreshToken(String token) {
        try {
            // Check if token is expired
            if (isTokenExpired(token)) {
                return false;
            }
            
            // Verify token type
            Claims claims = extractAllClaims(token);
            return "refresh".equals(claims.get("token_type"));
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenExpired(String token) {
        return extractExpirationTime(token).before(new Date());
    }

    public Date extractExpirationTime(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
EOF

# 4. Update Security Config
backup_file "$BACKEND_SECURITY_DIR/config/SecurityConfig.java"
cat > "$BACKEND_SECURITY_DIR/config/SecurityConfig.java" << 'EOF'
package com.tma.testmanagement.security.config;

import com.tma.testmanagement.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(CsrfConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/google")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/refresh")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(customUserDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
EOF

# 5. Update UserRepository
backup_file "$PROJECT_ROOT/backend/src/main/java/com/tma/testmanagement/user/repositories/UserRepository.java"
cat > "$PROJECT_ROOT/backend/src/main/java/com/tma/testmanagement/user/repositories/UserRepository.java" << 'EOF'
package com.tma.testmanagement.user.repositories;

import com.tma.testmanagement.user.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);
    
    Optional<User> findByEmail(String email);
}
EOF

# 6. Update application-dev.yml
backup_file "$PROJECT_ROOT/backend/src/main/resources/application-dev.yml"
cat > "$PROJECT_ROOT/backend/src/main/resources/application-dev.yml" << EOF
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:postgresql://db:5432/tma_db
    username: dev_user
    password: dev_password
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    database-platform: org.hibernate.dialect.PostgreSQLDialect
  flyway:
    enabled: true
    baseline-on-migrate: true
server:
  port: 8080
jwt:
  expiration-time: 3600000 # 1 hour
  refresh-expiration-time: 2592000000 # 30 days
  secret-key: Smt3dWRyTDdXUEYzd3hTOWpIWG9GMUsrSzVOWHdRek42V1FjU1VrdXJZMmZ1aVpLWkN2b3p5MWNlTmhjM21XeQ==
google:
  client-id: ${GOOGLE_CLIENT_ID} # Replace with your actual Client ID
EOF

echo "Backend implementation completed successfully!"

# --- FRONTEND IMPLEMENTATION ---

# 1. Create interceptor
FRONTEND_APP_DIR="$PROJECT_ROOT/frontend/src/app"
ensure_dir "$FRONTEND_APP_DIR/services"

cat > "$FRONTEND_APP_DIR/auth.interceptor.ts" << 'EOF'
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  
  // Skip interceptor for auth requests
  if (req.url.includes('/auth/') || req.url.includes('/refresh/')) {
    return next(req);
  }

  // Get token from storage
  const token = authService.getAccessToken();
  
  // Clone the request and add auth header if token exists
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    // Handle the request with token
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If 401 Unauthorized, try to refresh token
        if (error.status === 401) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Get new token and retry request
              const newToken = authService.getAccessToken();
              const newAuthReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(newAuthReq);
            }),
            catchError((refreshError) => {
              // If refresh fails, logout and redirect to login
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};
EOF

# 2. Create token storage service
cat > "$FRONTEND_APP_DIR/services/token-storage.service.ts" << 'EOF'
import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {}

  signOut(): void {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
}
EOF

# 3. Update Auth Service
backup_file "$FRONTEND_APP_DIR/services/auth.service.ts"
cat > "$FRONTEND_APP_DIR/services/auth.service.ts" << 'EOF'
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);
  private authStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    const token = this.tokenStorage.getAccessToken();
    this.authStateSubject.next(!!token);
  }

  private updateAuthState(state: boolean): void {
    this.authStateSubject.next(state);
  }

  public isLoggedIn(): boolean {
    return !!this.tokenStorage.getAccessToken();
  }

  public getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  public loginWithGoogle(googleIdToken: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.apiUrl}/auth/google`,
      { idToken: googleIdToken } as GoogleAuthRequest
    ).pipe(
      tap(response => {
        this.tokenStorage.saveTokens(response.accessToken, response.refreshToken);
        this.updateAuthState(true);
      })
    );
  }

  public loginWithCredentials(login: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.apiUrl}/auth`,
      { login, password }
    ).pipe(
      tap(response => {
        this.tokenStorage.saveTokens(response.accessToken, response.refreshToken);
        this.updateAuthState(true);
      })
    );
  }

  public refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<TokenResponse>(
      `${environment.apiUrl}/auth/refresh`,
      { refreshToken } as RefreshTokenRequest
    ).pipe(
      tap(response => {
        this.tokenStorage.saveTokens(response.accessToken, response.refreshToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public logout(): void {
    this.tokenStorage.signOut();
    this.updateAuthState(false);
  }

  public initGoogleAuth(): Promise<google.accounts.id.IdConfiguration> {
    return new Promise<google.accounts.id.IdConfiguration>((resolve, reject) => {
      // Load the Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Initialize Google Identity Services
        const config: google.accounts.id.IdConfiguration = {
          client_id: environment.googleClientId,
          callback: ({ credential }) => {
            // This callback will be triggered after Google authentication
            // We'll handle this in the component that uses this service
          },
          auto_select: false,
          cancel_on_tap_outside: true
        };
        resolve(config);
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  }
}
EOF

# 4. Update Environment Configuration
backup_file "$PROJECT_ROOT/frontend/src/environments/environment.ts"
cat > "$PROJECT_ROOT/frontend/src/environments/environment.ts" << EOF
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  googleClientId: '${GOOGLE_CLIENT_ID}' // Replace with your actual Client ID
};
EOF

# 5. Update Login Component
backup_file "$FRONTEND_APP_DIR/login/login.component.ts"
cat > "$FRONTEND_APP_DIR/login/login.component.ts" << 'EOF'
import { Component, OnInit, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        }
      }
    }
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('googleButton') googleButtonRef!: ElementRef;
  
  hidePassword = true;
  isLoading = false;
  
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    // Initialize Google Identity Services
    this.initGoogleSignIn();
  }

  ngAfterViewInit(): void {
    // The button will be rendered when the Google SDK is loaded
  }

  private initGoogleSignIn(): void {
    this.authService.initGoogleAuth().then(config => {
      // Override the callback to handle the credential
      const fullConfig = {
        ...config,
        callback: ({ credential }: { credential: string }) => {
          this.handleGoogleCredential(credential);
        }
      };
      
      // Initialize and render the button
      window.google?.accounts.id.initialize(fullConfig);
      
      // Render after view is initialized
      setTimeout(() => {
        if (this.googleButtonRef && this.googleButtonRef.nativeElement) {
          window.google?.accounts.id.renderButton(this.googleButtonRef.nativeElement, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 320
          });
        }
      }, 0);
    }).catch(error => {
      console.error('Error initializing Google Sign-In', error);
      this.snackBar.open('Failed to load Google Sign-In', 'Close', { duration: 5000 });
    });
  }

  private handleGoogleCredential(idToken: string): void {
    this.isLoading = true;
    
    this.authService.loginWithGoogle(idToken).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Successfully logged in with Google', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Google login error', error);
        this.snackBar.open('Google login failed. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { login, password } = this.loginForm.value;
      
      this.authService.loginWithCredentials(login!, password!).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Successfully logged in', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error', error);
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 5000 });
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('You have been logged out', 'Close', { duration: 3000 });
  }
}
EOF

# 6. Update Login Component HTML
backup_file "$FRONTEND_APP_DIR/login/login.component.html"
cat > "$FRONTEND_APP_DIR/login/login.component.html" << 'EOF'
<div class="login-container">
  <mat-card>
    <mat-card-title>Login</mat-card-title>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Username</mat-label>
        <input matInput formControlName="login" required />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Password</mat-label>
        <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required />
        <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
          <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
      </mat-form-field>

      <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="loginForm.invalid || isLoading">
        <mat-icon>login</mat-icon> Log in
      </button>
      
      <div class="separator">
        <span>OR</span>
      </div>
      
      <!-- Google Sign-In Button will be rendered here -->
      <div #googleButton class="google-button-container"></div>
    </form>
  </mat-card>
</div>
EOF

# 7. Update Login Component CSS
backup_file "$FRONTEND_APP_DIR/login/login.component.css"
cat > "$FRONTEND_APP_DIR/login/login.component.css" << 'EOF'
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

mat-card {
  width: 350px;
  padding: 20px;
}

.full-width {
  width: 100%;
  margin-bottom: 10px;
}

.google-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.separator span {
  padding: 0 10px;
  color: #777;
  font-size: 12px;
}
EOF

# 8. Update App Config
backup_file "$FRONTEND_APP_DIR/app.config.ts"
cat > "$FRONTEND_APP_DIR/app.config.ts" << 'EOF'
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor]))
  ]
};
EOF

echo "Frontend implementation completed successfully!"

# Make the appropriate changes to package.json to remove Firebase dependencies
FRONTEND_PACKAGE_JSON="$PROJECT_ROOT/frontend/package.json"
backup_file "$FRONTEND_PACKAGE_JSON"

# Remove Firebase dependencies using temporary file and sed
sed -i '/firebase/d; /@angular\/fire/d' "$FRONTEND_PACKAGE_JSON"

echo "Removed Firebase dependencies from frontend/package.json."

echo ""
echo "======================================================"
echo "Google OAuth + JWT Authentication Implementation Complete!"
echo "======================================================"
echo ""
echo "Backup files are stored in: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Replace the Google Client ID placeholder in:"
echo "   - backend/src/main/resources/application-dev.yml"
echo "   - frontend/src/environments/environment.ts"
echo ""
echo "2. Install the required dependencies:"
echo "   - cd $PROJECT_ROOT/backend && ./mvnw clean install"
echo "   - cd $PROJECT_ROOT/frontend && npm install"
echo ""
echo "3. Restart your application:"
echo "   - docker-compose down"
echo "   - docker-compose up --build"
echo ""
echo "4. Test the authentication flow with both Google sign-in and regular login"
