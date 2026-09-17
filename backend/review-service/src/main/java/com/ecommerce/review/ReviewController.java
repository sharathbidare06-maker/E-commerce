package com.ecommerce.review;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
  private final ReviewRepository repository;

  public ReviewController(ReviewRepository repository) {
    this.repository = repository;
  }

  @GetMapping("/product/{productId}")
  public List<Review> reviewsForProduct(@PathVariable Long productId) {
    return repository.findByProductIdOrderByCreatedAtDesc(productId);
  }

  @PostMapping
  public Review addReview(@RequestHeader(value = "X-User-Role", required = false) String role,
      @RequestHeader(value = "X-User-Email", required = false) String email,
      @RequestBody ReviewRequest request) {
    if (!"CUSTOMER".equals(role) || email == null || email.isBlank()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Customer authentication is required");
    }
    if (request.productId() == null || request.productId() < 1) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid product is required");
    }
    if (request.rating() < 1 || request.rating() > 5) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
    }
    if (request.comment() == null || request.comment().isBlank() || request.comment().length() > 1000) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review text must contain 1 to 1000 characters");
    }
    return repository.save(new Review(request.productId(), email.trim().toLowerCase(), request.rating(), request.comment().trim()));
  }

  @DeleteMapping("/{id}")
  public void deleteReview(@RequestHeader(value = "X-User-Role", required = false) String role,
      @PathVariable Long id) {
    if (!"ADMIN".equals(role)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin authentication is required");
    }
    repository.deleteById(id);
  }

  public record ReviewRequest(Long productId, int rating, String comment) { }
}
