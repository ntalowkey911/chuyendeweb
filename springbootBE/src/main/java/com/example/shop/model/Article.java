package com.example.shop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "articles")
public class Article {
    @Id
    private String id;

    private String title;

    @Indexed(unique = true)
    private String slug;

    private String summary;
    private String content;
    private String imageUrl;
    private String author;

    @Builder.Default
    private Boolean isActive = true;

    private Instant createdAt;
    private Instant updatedAt;
}
