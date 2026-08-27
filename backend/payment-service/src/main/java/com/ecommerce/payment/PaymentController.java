package com.ecommerce.payment;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
  @GetMapping public String payments() { return "{\"status\":\"READY\"}"; }
}
