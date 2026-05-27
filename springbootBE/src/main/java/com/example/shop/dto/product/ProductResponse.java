package com.example.shop.dto.product;

import com.example.shop.model.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ProductResponse {

    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private List<String> imageUrls;
    private String category;
    private String brand;
    private Integer stock;
    private ProductStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
