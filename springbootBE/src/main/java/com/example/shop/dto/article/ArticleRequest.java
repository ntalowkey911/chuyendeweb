package com.example.shop.dto.article;

import lombok.Data;

@Data
public class ArticleRequest {
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String imageUrl;
    private Boolean isActive;
}
