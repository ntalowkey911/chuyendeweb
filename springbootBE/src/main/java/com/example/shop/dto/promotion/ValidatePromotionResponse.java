package com.example.shop.dto.promotion;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
public class ValidatePromotionResponse {
    @JsonProperty("isValid")
    private boolean isValid;
    private String message;
    private BigDecimal discountAmount;
    private PromotionResponse promotion;
}
