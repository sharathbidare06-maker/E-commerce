package com.ecommerce.product;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
@RestController
@RequestMapping("/api/products")
public class ProductController {
  private final ProductRepository repository;
  private final List<SseEmitter> subscribers = new CopyOnWriteArrayList<>();

  public ProductController(ProductRepository repository) { this.repository = repository; }

  @GetMapping
  public List<Product> products() { return repository.findAll(); }

  @PostMapping
  public Product addProduct(@RequestBody Product product) {
    Product saved = repository.save(product);
    broadcast();
    return saved;
  }

  @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter stream() {
    SseEmitter emitter = new SseEmitter(0L);
    subscribers.add(emitter);
    emitter.onCompletion(() -> subscribers.remove(emitter));
    emitter.onTimeout(() -> subscribers.remove(emitter));
    send(emitter);
    return emitter;
  }

  private void broadcast() {
    for (SseEmitter subscriber : subscribers) send(subscriber);
  }

  private void send(SseEmitter emitter) {
    try {
      emitter.send(SseEmitter.event().name("catalog-update").data(repository.findAll()));
    } catch (IOException exception) {
      subscribers.remove(emitter);
      emitter.completeWithError(exception);
    }
  }
}
