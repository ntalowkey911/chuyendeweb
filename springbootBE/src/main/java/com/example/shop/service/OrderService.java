package com.example.shop.service;

import com.example.shop.dto.PageResponse;
import com.example.shop.dto.order.CreateOrderRequest;
import com.example.shop.dto.order.OrderResponse;
import com.example.shop.dto.order.UpdateOrderStatusRequest;
import com.example.shop.exception.BadRequestException;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.model.*;
import com.example.shop.repository.OrderRepository;
import com.example.shop.dto.promotion.ValidatePromotionResponse;
import com.example.shop.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private final PromotionService promotionService;
    private final GhnService ghnService;

    public OrderResponse createOrder(CreateOrderRequest request) {
        Cart cart = cartService.getOrCreateCart();
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        int totalWeight = 500; // Base weight
        int totalQuantity = 0;

        for (CartItem item : cart.getItems()) {
            Product product = productService.findProduct(item.getProductId());
            if (product.getStock() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }
            totalQuantity += item.getQuantity();
        }
        
        totalWeight += (totalQuantity * 200);
        int length = 20, width = 20, height = 20;
        if (totalQuantity > 3) {
            length = 35; width = 25; height = 25;
            totalWeight += 500;
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            Product product = productService.findProduct(item.getProductId());
            product.setStock(product.getStock() - item.getQuantity());
            product.setSoldCount((product.getSoldCount() == null ? 0 : product.getSoldCount()) + item.getQuantity());
            productService.saveProduct(product);

            orderItems.add(OrderItem.builder()
                    .productId(item.getProductId())
                    .productName(item.getProductName())
                    .price(item.getPrice())
                    .quantity(item.getQuantity())
                    .build());
        }

        String userId = SecurityUtils.getCurrentUserId();
        long orderCode = (System.currentTimeMillis() / 1000) % 10000000L * 100L + java.util.concurrent.ThreadLocalRandom.current().nextInt(100);
        
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getPromotionCode() != null && !request.getPromotionCode().isBlank()) {
            ValidatePromotionResponse promotionValidation = promotionService.validateAndCalculate(request.getPromotionCode(), cart.getTotalAmount());
            if (!promotionValidation.isValid()) {
                throw new BadRequestException(promotionValidation.getMessage());
            }
            discountAmount = promotionValidation.getDiscountAmount();
            promotionService.incrementUsedCount(request.getPromotionCode());
        }

        // Calculate Shipping Fee if GHN fields are provided
        BigDecimal shippingFee = BigDecimal.ZERO;
        boolean isFreeship = request.getPromotionCode() != null && 
                            (request.getPromotionCode().toUpperCase().contains("FREESHIP") || 
                             request.getPromotionCode().toUpperCase().contains("MIENPHISHIP"));
        
        if (!isFreeship && request.getToDistrictId() > 0 && request.getToWardCode() != null) {
            try {
                Object feeResponse = ghnService.calculateFee(request.getToDistrictId(), request.getToWardCode(), totalWeight, length, width, height);
                if (feeResponse instanceof java.util.Map) {
                    java.util.Map<?, ?> map = (java.util.Map<?, ?>) feeResponse;
                    if (map.containsKey("data")) {
                        java.util.Map<?, ?> dataMap = (java.util.Map<?, ?>) map.get("data");
                        if (dataMap.containsKey("total")) {
                            shippingFee = new BigDecimal(dataMap.get("total").toString());
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("GHN Fee Error: " + e.getMessage());
            }
        }
        
        BigDecimal totalAmount = cart.getTotalAmount().subtract(discountAmount).add(shippingFee);

        // Create GHN Order
        String ghnOrderCode = null;
        if (request.getToDistrictId() > 0 && request.getToWardCode() != null) {
            try {
                Object orderResponse = ghnService.createOrder(
                        request.getCustomerName(),
                        request.getPhone(),
                        request.getShippingAddress(),
                        request.getToWardCode(),
                        request.getToDistrictId(),
                        totalAmount.intValue(),
                        totalWeight, length, width, height,
                        "FastBite Order " + orderCode
                );
                
                if (orderResponse instanceof java.util.Map) {
                    java.util.Map<?, ?> map = (java.util.Map<?, ?>) orderResponse;
                    if (map.containsKey("data")) {
                        java.util.Map<?, ?> dataMap = (java.util.Map<?, ?>) map.get("data");
                        if (dataMap.containsKey("order_code")) {
                            ghnOrderCode = dataMap.get("order_code").toString();
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("GHN Create Order Error: " + e.getMessage());
            }
        }

        Order order = Order.builder()
                .userId(userId)
                .orderCode(orderCode)
                .items(orderItems)
                .shippingAddress(request.getShippingAddress())
                .phone(request.getPhone())
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(totalAmount)
                .promotionCode(request.getPromotionCode())
                .discountAmount(discountAmount)
                .shippingFee(shippingFee)
                .ghnOrderCode(ghnOrderCode)
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

    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findAll(pageable);
        List<OrderResponse> responses = orderPage.getContent().stream().map(this::toResponse).toList();
        
        return PageResponse.<OrderResponse>builder()
                .content(responses)
                .pageNo(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
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
                .orderCode(order.getOrderCode())
                .userId(order.getUserId())
                .items(order.getItems())
                .shippingAddress(order.getShippingAddress())
                .phone(order.getPhone())
                .paymentMethod(order.getPaymentMethod())
                .totalAmount(order.getTotalAmount())
                .promotionCode(order.getPromotionCode())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .ghnOrderCode(order.getGhnOrderCode())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
