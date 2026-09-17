package com.ecommerce.review;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.Instant;

@Entity
@Table(name = "reviews")
public class Review {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private Long productId;
  private String customerEmail;
  private int rating;
  private String comment;
  private Instant createdAt;

  protected Review() { }

  public Review(Long productId, String customerEmail, int rating, String comment) {
    this.productId = productId;
    this.customerEmail = customerEmail;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = Instant.now();
  }

  public Long getId() { return id; }
  public Long getProductId() { return productId; }
  @JsonIgnore
  public String getCustomerEmail() { return customerEmail; }
  public int getRating() { return rating; }
  public String getComment() { return comment; }
  public Instant getCreatedAt() { return createdAt; }
}
