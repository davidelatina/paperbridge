package org.paperbridge.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable()) // Disable CSRF
        .cors(cors -> cors.configurationSource(request -> {
          CorsConfiguration config = new CorsConfiguration();
          config.addAllowedOrigin("http://localhost:4200");
          config.addAllowedMethod("*"); // Allow all methods
          config.addAllowedHeader("*"); // Allow all headers
          config.setAllowCredentials(true);
          return config;
        }))
        .authorizeHttpRequests(authz -> authz
            .anyRequest().permitAll() // Allow all requests
        );
    return http.build();
  }
}
