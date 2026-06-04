package com.example.shop.service;

import com.example.shop.dto.promotion.PromotionRequest;
import com.example.shop.dto.promotion.PromotionResponse;
import com.example.shop.dto.promotion.ValidatePromotionResponse;
import com.example.shop.exception.BadRequestException;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.model.Cart;
import com.example.shop.model.DiscountType;
import com.example.shop.model.Promotion;
import com.example.shop.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final CartService cartService;

    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public PromotionResponse createPromotion(PromotionRequest request) {
        if (promotionRepository.findByCodeIgnoreCase(request.getCode()).isPresent()) {
            throw new BadRequestException("Promotion code already exists");
        }

        Promotion promotion = Promotion.builder()
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderValue(request.getMinOrderValue())
                .maxDiscount(request.getMaxDiscount())
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .usageLimit(request.getUsageLimit())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .createdAt(Instant.now())
                .usedCount(0)
                .build();

        return toResponse(promotionRepository.save(promotion));
    }

    public PromotionResponse updatePromotion(String id, PromotionRequest request) {
        Promotion promotion = findPromotion(id);

        if (!promotion.getCode().equalsIgnoreCase(request.getCode()) &&
                promotionRepository.findByCodeIgnoreCase(request.getCode()).isPresent()) {
            throw new BadRequestException("Promotion code already exists");
        }

        promotion.setCode(request.getCode().toUpperCase());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountType(request.getDiscountType());
        promotion.setDiscountValue(request.getDiscountValue());
        promotion.setMinOrderValue(request.getMinOrderValue());
        promotion.setMaxDiscount(request.getMaxDiscount());
        promotion.setValidFrom(request.getValidFrom());
        promotion.setValidUntil(request.getValidUntil());
        promotion.setUsageLimit(request.getUsageLimit());
        if (request.getIsActive() != null) {
            promotion.setIsActive(request.getIsActive());
        }

        return toResponse(promotionRepository.save(promotion));
    }

    public void deletePromotion(String id) {
        if (!promotionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Promotion not found");
        }
        promotionRepository.deleteById(id);
    }

    public ValidatePromotionResponse validateAndCalculate(String code) {
        Cart cart = cartService.getOrCreateCart();
        BigDecimal totalOrderValue = cart.getTotalAmount();
        return validateAndCalculate(code, totalOrderValue);
    }

    public ValidatePromotionResponse validateAndCalculate(String code, BigDecimal orderValue) {
        if (code == null || code.isBlank()) {
            return ValidatePromotionResponse.builder().isValid(false).message("Mã không hợp lệ").build();
        }

        Promotion promotion = promotionRepository.findByCodeIgnoreCase(code.trim()).orElse(null);
        if (promotion == null) {
            return ValidatePromotionResponse.builder().isValid(false).message("Mã giảm giá không tồn tại").build();
        }

        if (!promotion.getIsActive()) {
            return ValidatePromotionResponse.builder().isValid(false).message("Mã giảm giá đã bị khóa").build();
        }

        Instant now = Instant.now();
        if (promotion.getValidFrom() != null && now.isBefore(promotion.getValidFrom())) {
            return ValidatePromotionResponse.builder().isValid(false).message("Mã giảm giá chưa có hiệu lực").build();
        }

        if (promotion.getValidUntil() != null && now.isAfter(promotion.getValidUntil())) {
            return ValidatePromotionResponse.builder().isValid(false).message("Mã giảm giá đã hết hạn").build();
        }

        if (promotion.getUsageLimit() != null && promotion.getUsedCount() >= promotion.getUsageLimit()) {
            return ValidatePromotionResponse.builder().isValid(false).message("Mã giảm giá đã hết lượt sử dụng").build();
        }

        if (promotion.getMinOrderValue() != null && orderValue.compareTo(promotion.getMinOrderValue()) < 0) {
            return ValidatePromotionResponse.builder().isValid(false)
                    .message("Đơn hàng chưa đạt giá trị tối thiểu " + promotion.getMinOrderValue()).build();
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (promotion.getDiscountType() == DiscountType.FIXED_AMOUNT) {
            discountAmount = promotion.getDiscountValue();
        } else if (promotion.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = orderValue.multiply(promotion.getDiscountValue()).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            if (promotion.getMaxDiscount() != null && discountAmount.compareTo(promotion.getMaxDiscount()) > 0) {
                discountAmount = promotion.getMaxDiscount();
            }
        }

        if (discountAmount.compareTo(orderValue) > 0) {
            discountAmount = orderValue; // Cannot discount more than order value
        }

        return ValidatePromotionResponse.builder()
                .isValid(true)
                .message("Áp dụng mã thành công")
                .discountAmount(discountAmount)
                .promotion(toResponse(promotion))
                .build();
    }

    public void incrementUsedCount(String code) {
        if (code != null && !code.isBlank()) {
            promotionRepository.findByCodeIgnoreCase(code).ifPresent(promotion -> {
                promotion.setUsedCount(promotion.getUsedCount() + 1);
                promotionRepository.save(promotion);
            });
        }
    }

    private Promotion findPromotion(String id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));
    }

    private PromotionResponse toResponse(Promotion promotion) {
        return PromotionResponse.builder()
                .id(promotion.getId())
                .code(promotion.getCode())
                .description(promotion.getDescription())
                .discountType(promotion.getDiscountType())
                .discountValue(promotion.getDiscountValue())
                .minOrderValue(promotion.getMinOrderValue())
                .maxDiscount(promotion.getMaxDiscount())
                .validFrom(promotion.getValidFrom())
                .validUntil(promotion.getValidUntil())
                .usageLimit(promotion.getUsageLimit())
                .usedCount(promotion.getUsedCount())
                .isActive(promotion.getIsActive())
                .createdAt(promotion.getCreatedAt())
                .build();
    }
}
