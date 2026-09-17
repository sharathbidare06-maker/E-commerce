package com.ecommerce.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final byte[] jwtSecret;
  private final String adminSignupCode;

  public AuthController(UserRepository repository, PasswordEncoder passwordEncoder,
      @Value("${security.jwt.secret}") String secret,
      @Value("${security.admin.signup-code:}") String adminSignupCode) {
    this.repository = repository;
    this.passwordEncoder = passwordEncoder;
    this.jwtSecret = secret.getBytes(StandardCharsets.UTF_8);
    this.adminSignupCode = adminSignupCode;
  }

  @PostMapping("/register")
  public AuthResult register(@RequestBody Credentials request) {
    String email = normalizeEmail(request.email());
    if (request.password() == null || request.password().length() < 8) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must contain at least 8 characters");
    }
    if (repository.findByEmailIgnoreCase(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
    }
    String role = "CUSTOMER";
    if ("ADMIN".equalsIgnoreCase(request.role())) {
      if (adminSignupCode.isBlank() || !adminSignupCode.equals(request.inviteCode())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "A valid admin invite code is required");
      }
      role = "ADMIN";
    }
    User user = repository.save(new User(normalizeName(request.firstName()), normalizeName(request.lastName()), email,
      passwordEncoder.encode(request.password()), role));
    return issue(user);
  }

  @PostMapping("/login")
  public AuthResult login(@RequestBody Credentials request) {
    User user = repository.findByEmailIgnoreCase(normalizeEmail(request.email()))
        .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPasswordHash()))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
    return issue(user);
  }

  private AuthResult issue(User user) {
    Instant now = Instant.now();
    String token = Jwts.builder()
        .subject(user.getEmail())
        .claims(Map.of("role", user.getRole(), "userId", user.getId()))
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plusSeconds(3600)))
        .signWith(Keys.hmacShaKeyFor(jwtSecret))
        .compact();
    return new AuthResult(token, user.getEmail(), user.getRole(), user.getFirstName(), user.getLastName());
  }

  private String normalizeEmail(String email) {
    if (email == null || email.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
    return email.trim().toLowerCase();
  }

  private String normalizeName(String name) {
    if (name == null) return "";
    return name.trim();
  }

  public record Credentials(String email, String password, String role, String inviteCode, String firstName, String lastName) { }
  public record AuthResult(String token, String email, String role, String firstName, String lastName) { }
}
