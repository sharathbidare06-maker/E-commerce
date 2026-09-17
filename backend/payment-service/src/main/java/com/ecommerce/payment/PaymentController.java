package com.ecommerce.payment;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
  private final PaymentRepository repository;

  public PaymentController(PaymentRepository repository) { this.repository = repository; }

  @GetMapping public java.util.List<Payment> payments() { return repository.findAll(); }

  @PostMapping
  public Payment pay(@RequestBody PaymentRequest request) {
    return repository.findByOrderId(request.orderId())
        .orElseGet(() -> repository.save(new Payment(
            request.orderId(), request.amount(), "PAID", "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())));
  }

  public record PaymentRequest(Long orderId, int amount) { }
}
