package com.ecommerce.product;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/products")
public class ProductController {
  @GetMapping public String products() { return "[{\"id\":1,\"name\":\"Laptop\",\"price\":79999}]"; }
}
