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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "promotions")
public class Promotion {

    @Id
    private String id;

    private String code;

    private String description;

    private DiscountType discountType;

    private BigDecimal discountValue;

    private BigDecimal minOrderValue;

    private BigDecimal maxDiscount;

    private Instant validFrom;

    private Instant validUntil;

    private Integer usageLimit; // total usage allowed

    @Builder.Default
    private Integer usedCount = 0; // how many times used

    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    private Instant createdAt;
}
