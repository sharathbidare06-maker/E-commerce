package com.ecommerce.product;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private int price;
  private int stock;
  private String imageUrl;
  private String category;

  protected Product() {
  }

  public Product(String name, int price, int stock, String imageUrl) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.imageUrl = imageUrl;
    this.category = "Essentials";
  }

  public Long getId() { return id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public int getPrice() { return price; }
  public void setPrice(int price) { this.price = price; }
  public int getStock() { return stock; }
  public void setStock(int stock) { this.stock = stock; }
  public String getImageUrl() { return imageUrl; }
  public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }
}
