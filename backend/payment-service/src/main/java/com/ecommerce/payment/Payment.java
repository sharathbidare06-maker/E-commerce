package com.ecommerce.payment;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private Long orderId;
  private int amount;
  private String status;
  private String providerReference;

  protected Payment() { }

  public Payment(Long orderId, int amount, String status, String providerReference) {
    this.orderId = orderId;
    this.amount = amount;
    this.status = status;
    this.providerReference = providerReference;
  }

  public Long getId() { return id; }
  public Long getOrderId() { return orderId; }
  public int getAmount() { return amount; }
  public String getStatus() { return status; }
  public String getProviderReference() { return providerReference; }
}
