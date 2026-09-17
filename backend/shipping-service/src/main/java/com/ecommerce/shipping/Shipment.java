package com.ecommerce.shipping;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "shipments")
public class Shipment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private Long orderId;
  private String address;
  private String status;
  private String trackingNumber;

  protected Shipment() { }

  public Shipment(Long orderId, String address, String status, String trackingNumber) {
    this.orderId = orderId;
    this.address = address;
    this.status = status;
    this.trackingNumber = trackingNumber;
  }

  public Long getId() { return id; }
  public Long getOrderId() { return orderId; }
  public String getAddress() { return address; }
  public String getStatus() { return status; }
  public String getTrackingNumber() { return trackingNumber; }
}
