package com.example.shop.dto.article;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ArticleResponse {
    private String id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String imageUrl;
    private String author;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
