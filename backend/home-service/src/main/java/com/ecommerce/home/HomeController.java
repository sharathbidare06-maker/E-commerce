package com.ecommerce.home;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/home")
public class HomeController {
  @GetMapping public String home() { return "[{\"id\":1,\"title\":\"Featured Products\"}]"; }
}
