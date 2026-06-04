package com.example.shop.dto.promotion;

import com.example.shop.model.DiscountType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class PromotionResponse {
    private String id;
    private String code;
    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderValue;
    private BigDecimal maxDiscount;
    private Instant validFrom;
    private Instant validUntil;
    private Integer usageLimit;
    private Integer usedCount;
    private Boolean isActive;
    private Instant createdAt;
}
