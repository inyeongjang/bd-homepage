package com.bd.homepage.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
      .allowedOrigins("https://136lee.github.io", "http://localhost:5173", "http://localhost:5174")
      .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
      .allowedHeaders("*")
      .exposedHeaders("Authorization");
  }
}
