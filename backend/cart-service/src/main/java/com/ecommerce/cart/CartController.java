package com.ecommerce.cart;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/cart")
public class CartController {
  @GetMapping public String cart() { return "{\"items\":[],\"total\":0}"; }
}
