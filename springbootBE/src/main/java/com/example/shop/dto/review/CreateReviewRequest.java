package com.example.shop.dto.review;

import lombok.Data;

@Data
public class CreateReviewRequest {
    private int rating;
    private String comment;
}
