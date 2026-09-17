package com.ecommerce.cart;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/cart")
public class CartController {
  private final CartItemRepository repository;

  public CartController(CartItemRepository repository) { this.repository = repository; }

  @GetMapping
  public Map<String, Object> cart(@RequestParam(name = "cartId", defaultValue = "guest") String cartId) {
    List<CartItem> items = repository.findByCartId(cartId);
    int total = items.stream().mapToInt(item -> item.getPrice() * item.getQuantity()).sum();
    return Map.of("items", items, "total", total);
  }

  @PostMapping
  public Map<String, Object> add(@RequestParam(name = "cartId", defaultValue = "guest") String cartId, @RequestBody AddItem request) {
    CartItem item = repository.findByCartIdAndProductId(cartId, request.productId())
        .orElseGet(() -> new CartItem(cartId, request.productId(), request.productName(), request.price(), 0, request.imageUrl()));
    item.setQuantity(item.getQuantity() + Math.max(1, request.quantity()));
    repository.save(item);
    return cart(cartId);
  }

  @PatchMapping("/{id}")
  public Map<String, Object> update(@PathVariable(name = "id") Long id, @RequestParam(name = "cartId", defaultValue = "guest") String cartId, @RequestBody Quantity request) {
    CartItem item = repository.findById(id).filter(value -> Objects.equals(value.getCartId(), cartId)).orElseThrow();
    if (request.quantity() <= 0) repository.delete(item); else item.setQuantity(request.quantity());
    if (request.quantity() > 0) repository.save(item);
    return cart(cartId);
  }

  @DeleteMapping("/{id}")
  public Map<String, Object> remove(@PathVariable(name = "id") Long id, @RequestParam(name = "cartId", defaultValue = "guest") String cartId) {
    repository.findById(id).filter(value -> Objects.equals(value.getCartId(), cartId)).ifPresent(repository::delete);
    return cart(cartId);
  }

  public record AddItem(Long productId, String productName, int price, int quantity, String imageUrl) { }
  public record Quantity(int quantity) { }
}
