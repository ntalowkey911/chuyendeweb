package com.example.shop.controller;

import com.example.shop.dto.promotion.PromotionRequest;
import com.example.shop.dto.promotion.PromotionResponse;
import com.example.shop.dto.promotion.ValidatePromotionResponse;
import com.example.shop.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    // Public API to validate cart promotion
    @GetMapping("/promotions/validate")
    public ValidatePromotionResponse validatePromotion(@RequestParam String code) {
        return promotionService.validateAndCalculate(code);
    }

    // Admin APIs
    @GetMapping("/admin/promotions")
    public List<PromotionResponse> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    @PostMapping("/admin/promotions")
    @ResponseStatus(HttpStatus.CREATED)
    public PromotionResponse createPromotion(@Valid @RequestBody PromotionRequest request) {
        return promotionService.createPromotion(request);
    }

    @PutMapping("/admin/promotions/{id}")
    public PromotionResponse updatePromotion(@PathVariable String id, @Valid @RequestBody PromotionRequest request) {
        return promotionService.updatePromotion(id, request);
    }

    @DeleteMapping("/admin/promotions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePromotion(@PathVariable String id) {
        promotionService.deletePromotion(id);
    }
}
