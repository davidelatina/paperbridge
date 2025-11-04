package org.paperbridge.backend.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCorsConfig implements WebMvcConfigurer {
  
  @Override
  public void addCorsMappings(@NonNull CorsRegistry registry) {
    // allow CORS for all paths
    registry.addMapping("/**") 
        // Angular app origin
        .allowedOrigins("http://localhost:4200/")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true) 
        // how long preflight requests can be cached
        .maxAge(3600); 
  }
}
