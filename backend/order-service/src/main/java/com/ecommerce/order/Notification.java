package com.ecommerce.order;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "notifications")
public class Notification {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private Long orderId;
  private String recipient;
  private String type;
  private String status;
  private String message;

  protected Notification() { }

  public Notification(Long orderId, String recipient, String type, String status, String message) {
    this.orderId = orderId;
    this.recipient = recipient;
    this.type = type;
    this.status = status;
    this.message = message;
  }

  public Long getId() { return id; }
  public Long getOrderId() { return orderId; }
  public String getRecipient() { return recipient; }
  public String getType() { return type; }
  public String getStatus() { return status; }
  public String getMessage() { return message; }
}
