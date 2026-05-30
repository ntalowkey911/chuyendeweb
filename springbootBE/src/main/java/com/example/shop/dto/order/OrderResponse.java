package com.example.shop.dto.order;

import com.example.shop.model.OrderItem;
import com.example.shop.model.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private String id;
    private String userId;
    private List<OrderItem> items;
    private String shippingAddress;
    private String phone;
    private com.example.shop.model.PaymentMethod paymentMethod;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private Instant createdAt;
}
