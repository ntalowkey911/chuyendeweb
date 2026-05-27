package com.example.shop.dto.cart;

import com.example.shop.model.CartItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class CartResponse {

    private String id;
    private String userId;
    private List<CartItem> items;
    private BigDecimal totalAmount;
    private Instant updatedAt;
}
