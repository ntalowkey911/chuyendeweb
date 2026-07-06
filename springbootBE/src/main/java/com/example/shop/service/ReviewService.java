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
    private final com.example.shop.repository.OrderRepository orderRepository;

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

        // Check if user has bought this product and order is completed
        boolean hasBought = orderRepository.existsByUserIdAndStatusAndItemsProductId(user.getId(), com.example.shop.model.OrderStatus.COMPLETED, productId);
        if (!hasBought) {
            throw new BadRequestException("Bạn phải mua và nhận hàng thành công mới được đánh giá.");
        }

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
