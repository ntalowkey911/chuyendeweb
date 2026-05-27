package com.example.shop.controller;

import com.example.shop.dto.order.CreateOrderRequest;
import com.example.shop.dto.order.OrderResponse;
import com.example.shop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/api/orders/my-orders")
    public List<OrderResponse> myOrders() {
        return orderService.getMyOrders();
    }

    @GetMapping("/api/orders/{id}")
    public OrderResponse getById(@PathVariable String id) {
        return orderService.getById(id);
    }
}
