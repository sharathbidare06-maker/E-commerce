package com.ecommerce.cart;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
  List<CartItem> findByCartId(String cartId);
  Optional<CartItem> findByCartIdAndProductId(String cartId, Long productId);
}
