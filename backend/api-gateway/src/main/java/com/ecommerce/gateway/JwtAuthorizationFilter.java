package com.ecommerce.gateway;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthorizationFilter implements GlobalFilter, Ordered {
  private static final String OPTIONS = "OPTIONS";
  private final byte[] secret;

  public JwtAuthorizationFilter(@Value("${security.jwt.secret}") String secret) {
    this.secret = secret.getBytes(StandardCharsets.UTF_8);
  }

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    String path = exchange.getRequest().getPath().value();
    String method = exchange.getRequest().getMethod().name();
    boolean adminOperation = path.startsWith("/api/products") && !method.equals("GET") && !method.equals(OPTIONS);
    boolean customerOperation = (path.equals("/api/cart") || path.startsWith("/api/cart/") || path.equals("/api/orders") || path.startsWith("/api/orders/"))
      && !method.equals("GET") && !method.equals(OPTIONS);
    boolean protectedPaymentOrShipping = (path.startsWith("/api/payments") || path.startsWith("/api/shipping"))
      && !method.equals("GET") && !method.equals(OPTIONS);
    boolean reviewWrite = path.startsWith("/api/reviews") && !method.equals("GET") && !method.equals(OPTIONS);
    if (!adminOperation && !customerOperation && !protectedPaymentOrShipping && !reviewWrite) return chain.filter(exchange);

    String header = exchange.getRequest().getHeaders().getFirst("Authorization");
    if (header == null || !header.startsWith("Bearer ")) return reject(exchange, HttpStatus.UNAUTHORIZED);
    try {
      Claims claims = Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret)).build()
          .parseSignedClaims(header.substring(7)).getPayload();
      String role = claims.get("role", String.class);
      if (adminOperation && !"ADMIN".equals(role)) return reject(exchange, HttpStatus.FORBIDDEN);
      if ((customerOperation || protectedPaymentOrShipping) && !"CUSTOMER".equals(role)) return reject(exchange, HttpStatus.FORBIDDEN);
        if (reviewWrite && ((path.matches("/api/reviews/\\d+") && !"ADMIN".equals(role))
          || (path.equals("/api/reviews") && !"CUSTOMER".equals(role)))) return reject(exchange, HttpStatus.FORBIDDEN);
      return chain.filter(exchange.mutate().request(request -> request.headers(headers -> {
        headers.remove("X-User-Role");
        headers.add("X-User-Role", role);
        headers.remove("X-User-Email");
        headers.add("X-User-Email", claims.getSubject());
      })).build());
    } catch (RuntimeException exception) {
      return reject(exchange, HttpStatus.UNAUTHORIZED);
    }
  }

  private Mono<Void> reject(ServerWebExchange exchange, HttpStatus status) {
    exchange.getResponse().setStatusCode(status);
    return exchange.getResponse().setComplete();
  }

  @Override
  public int getOrder() { return -100; }
}