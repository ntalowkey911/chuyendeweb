package com.example.shop.service;

import com.example.shop.dto.order.CreateOrderRequest;
import com.example.shop.dto.order.OrderResponse;
import com.example.shop.dto.order.UpdateOrderStatusRequest;
import com.example.shop.exception.BadRequestException;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.model.*;
import com.example.shop.repository.OrderRepository;
import com.example.shop.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductService productService;

    public OrderResponse createOrder(CreateOrderRequest request) {
        Cart cart = cartService.getOrCreateCart();
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        for (CartItem item : cart.getItems()) {
            Product product = productService.findProduct(item.getProductId());
            if (product.getStock() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            Product product = productService.findProduct(item.getProductId());
            product.setStock(product.getStock() - item.getQuantity());
            productService.saveProduct(product);

            orderItems.add(OrderItem.builder()
                    .productId(item.getProductId())
                    .productName(item.getProductName())
                    .price(item.getPrice())
                    .quantity(item.getQuantity())
                    .build());
        }

        String userId = SecurityUtils.getCurrentUserId();
        Order order = Order.builder()
                .userId(userId)
                .items(orderItems)
                .shippingAddress(request.getShippingAddress())
                .phone(request.getPhone())
                .totalAmount(cart.getTotalAmount())
                .status(OrderStatus.PENDING)
                .createdAt(Instant.now())
                .build();

        Order saved = orderRepository.save(order);
        cartService.clearCart(userId);
        return toResponse(saved);
    }

    public List<OrderResponse> getMyOrders() {
        String userId = SecurityUtils.getCurrentUserId();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public OrderResponse getById(String id) {
        Order order = findOrder(id);
        if (!order.getUserId().equals(SecurityUtils.getCurrentUserId())
                && SecurityUtils.getCurrentUser().getUser().getRole() != Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }
        return toResponse(order);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    public OrderResponse updateStatus(String id, UpdateOrderStatusRequest request) {
        Order order = findOrder(id);
        order.setStatus(request.getStatus());
        return toResponse(orderRepository.save(order));
    }

    private Order findOrder(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .items(order.getItems())
                .shippingAddress(order.getShippingAddress())
                .phone(order.getPhone())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
