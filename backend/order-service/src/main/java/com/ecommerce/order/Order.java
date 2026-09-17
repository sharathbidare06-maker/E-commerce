package com.ecommerce.order;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String status;
  private int total;
  private String customerEmail;
  private String deliveryAddress;

  protected Order() { }

  public Order(String status, int total, String customerEmail, String deliveryAddress) {
    this.status = status;
    this.total = total;
    this.customerEmail = customerEmail;
    this.deliveryAddress = deliveryAddress;
  }

  public Long getId() { return id; }
  public String getStatus() { return status; }
  public int getTotal() { return total; }
  public String getCustomerEmail() { return customerEmail; }
  public String getDeliveryAddress() { return deliveryAddress; }
  public void setStatus(String status) { this.status = status; }
}
