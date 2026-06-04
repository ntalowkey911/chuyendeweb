package com.example.shop.service;

import com.example.shop.dto.review.CreateReviewRequest;
import com.example.shop.exception.BadRequestException;
import com.example.shop.model.Review;
import com.example.shop.model.User;
import com.example.shop.repository.ReviewRepository;
import com.example.shop.security.CustomUserDetails;
import com.example.shop.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final ProductService productService;

    public List<Review> getReviewsByProduct(String productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Review addReview(String productId, CreateReviewRequest request) {
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        // Verify product exists
        productService.findProduct(productId);

        CustomUserDetails userDetails = SecurityUtils.getCurrentUser();
        User user = userDetails.getUser();

        Review review = Review.builder()
                .productId(productId)
                .userId(user.getId())
                .userName(user.getFullName())
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(Instant.now())
                .build();

        return reviewRepository.save(review);
    }
}
