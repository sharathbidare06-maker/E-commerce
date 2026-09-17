package com.ecommerce.review;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {
  @Mock private ReviewRepository repository;
  @InjectMocks private ReviewController controller;

  @Test
  void listsReviewsForProduct() {
    when(repository.findByProductIdOrderByCreatedAtDesc(7L)).thenReturn(List.of());

    assertThat(controller.reviewsForProduct(7L)).isEmpty();
    verify(repository).findByProductIdOrderByCreatedAtDesc(7L);
  }

  @Test
  void storesCustomerReviewWithAuthenticatedEmail() {
    ReviewController.ReviewRequest request = new ReviewController.ReviewRequest(7L, 5, "Excellent quality");
    when(repository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

    Review saved = controller.addReview("CUSTOMER", "SHOPPER@EXAMPLE.COM", request);

    assertThat(saved.getProductId()).isEqualTo(7L);
    assertThat(saved.getCustomerEmail()).isEqualTo("shopper@example.com");
    assertThat(saved.getRating()).isEqualTo(5);
    verify(repository).save(any(Review.class));
  }

  @Test
  void rejectsInvalidRating() {
    ReviewController.ReviewRequest request = new ReviewController.ReviewRequest(7L, 6, "Too high");

    assertThatThrownBy(() -> controller.addReview("CUSTOMER", "shopper@example.com", request))
        .isInstanceOf(ResponseStatusException.class)
        .hasMessageContaining("Rating must be between 1 and 5");
  }
}
