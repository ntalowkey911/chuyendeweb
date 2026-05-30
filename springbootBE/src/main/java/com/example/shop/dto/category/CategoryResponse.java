package com.example.shop.dto.category;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CategoryResponse {

    private String id;
    private String name;
    private String slug;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}
