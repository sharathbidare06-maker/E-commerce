package com.ecommerce.shipping;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {
  private final ShipmentRepository repository;

  public ShippingController(ShipmentRepository repository) { this.repository = repository; }

  @PostMapping
  public com.ecommerce.shipping.Shipment create(@RequestBody ShippingRequest request) {
    return repository.findByOrderId(request.orderId())
        .orElseGet(() -> repository.save(new com.ecommerce.shipping.Shipment(request.orderId(), request.address(), "SHIPMENT_CREATED", "SHP-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase())));
  }

  @GetMapping("/{orderId}")
  public com.ecommerce.shipping.Shipment status(@PathVariable(name = "orderId") Long orderId) {
    return repository.findByOrderId(orderId).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Shipment not found"));
  }

  public record ShippingRequest(Long orderId, String address) { }
}
