package com.ecommerce.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AuthConfig {
  @Bean
  PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

  @Bean
  CommandLineRunner provisionAdmin(UserRepository repository, PasswordEncoder encoder,
      @Value("${security.admin.email:}") String email,
      @Value("${security.admin.password:}") String password) {
    return args -> {
      if (!email.isBlank() && password.length() >= 8 && repository.findByEmailIgnoreCase(email).isEmpty()) {
        repository.save(new User(email.trim().toLowerCase(), encoder.encode(password), "ADMIN"));
      }
    };
  }
}
