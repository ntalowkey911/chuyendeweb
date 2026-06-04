package com.example.shop.controller;

import com.example.shop.dto.review.CreateReviewRequest;
import com.example.shop.model.Review;
import com.example.shop.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviews(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<Review> addReview(
            @PathVariable String productId,
            @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.addReview(productId, request));
    }
}
