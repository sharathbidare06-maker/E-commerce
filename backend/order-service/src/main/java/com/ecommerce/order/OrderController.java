package com.ecommerce.order;
import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/orders")
public class OrderController {
  private final OrderRepository repository;
  private final NotificationRepository notificationRepository;

  public OrderController(OrderRepository repository, NotificationRepository notificationRepository) {
    this.repository = repository;
    this.notificationRepository = notificationRepository;
  }

  @GetMapping public java.util.List<Order> orders() { return repository.findAll(); }

  @GetMapping("/{orderId}/notifications")
  public java.util.List<Notification> notifications(@PathVariable Long orderId) {
    return notificationRepository.findByOrderId(orderId);
  }

  @PostMapping
  public Order create(@RequestBody CreateOrder request) {
    Order order = repository.save(new Order("CREATED", request.total(), request.customerEmail(), request.deliveryAddress()));
    notificationRepository.save(new Notification(order.getId(), request.customerEmail(), "ORDER_CREATED", "PENDING", "Order #" + order.getId() + " was created."));
    return order;
  }

  @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter stream() {
    SseEmitter emitter = new SseEmitter(0L);
    ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    Runnable update = new Runnable() {
      private int sequence;

      @Override
      public void run() {
        try {
          emitter.send(SseEmitter.event()
              .name("order-status")
              .data("{\"id\":1,\"status\":\"PROCESSING\",\"update\":" + (++sequence) + "}"));
        } catch (IOException exception) {
          scheduler.shutdown();
          emitter.completeWithError(exception);
        }
      }
    };
    emitter.onCompletion(scheduler::shutdown);
    emitter.onTimeout(() -> {
      scheduler.shutdown();
      emitter.complete();
    });
    scheduler.scheduleAtFixedRate(update, 0, 5, TimeUnit.SECONDS);
    return emitter;
  }

  public record CreateOrder(int total, String customerEmail, String deliveryAddress) { }
}
