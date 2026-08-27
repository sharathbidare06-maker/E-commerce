package com.ecommerce.order;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/orders")
public class OrderController {
  @GetMapping public String orders() { return "[{\"id\":1,\"status\":\"CREATED\"}]"; }
}
