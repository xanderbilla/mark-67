package com.project.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
        // CORS configuration for API and Actuator endpoints

        @Override
        public void addCorsMappings(CorsRegistry registry) {
                // API endpoints
                registry.addMapping("/api/**")
                                .allowedOrigins(
                                                "http://localhost:3000",
                                                "http://localhost:3001",
                                                "http://127.0.0.1:3000",
                                                "http://44.223.101.20:3000" // Current frontend EC2 IP
                                )
                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                                .allowedHeaders("*")
                                .allowCredentials(true);

                // Actuator endpoints
                registry.addMapping("/actuator/**")
                                .allowedOrigins(
                                                "http://localhost:3000",
                                                "http://localhost:3001",
                                                "http://127.0.0.1:3000",
                                                "http://44.223.101.20:3000" // Current frontend EC2 IP
                                )
                                .allowedMethods("GET", "OPTIONS")
                                .allowedHeaders("*")
                                .allowCredentials(true);
        }
}