package com.ecommerce.cart;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cart_items")
public class CartItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String cartId;
  private Long productId;
  private String productName;
  private int price;
  private int quantity;
  private String imageUrl;

  protected CartItem() {
  }

  public CartItem(String cartId, Long productId, String productName, int price, int quantity, String imageUrl) {
    this.cartId = cartId;
    this.productId = productId;
    this.productName = productName;
    this.price = price;
    this.quantity = quantity;
    this.imageUrl = imageUrl;
  }

  public Long getId() { return id; }
  public String getCartId() { return cartId; }
  public Long getProductId() { return productId; }
  public String getProductName() { return productName; }
  public int getPrice() { return price; }
  public int getQuantity() { return quantity; }
  public void setQuantity(int quantity) { this.quantity = quantity; }
  public String getImageUrl() { return imageUrl; }
}
