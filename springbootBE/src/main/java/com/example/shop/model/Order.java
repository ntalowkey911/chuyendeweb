package com.example.shop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private Long orderCode;

    private String userId;

    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    private String shippingAddress;

    private String phone;

    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.CASH_ON_DELIVERY;

    private BigDecimal totalAmount;

    private String promotionCode;

    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    private String ghnOrderCode;

    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @CreatedDate
    private Instant createdAt;
}
