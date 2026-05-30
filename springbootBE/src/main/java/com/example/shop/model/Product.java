package com.example.shop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;

    private String description;

    @Indexed
    private BigDecimal price;

    private String imageUrl;

    private List<String> imageUrls;

    @Indexed
    private String category;

    private String brand;

    private Integer stock;

    @Indexed
    @Builder.Default
    private Integer soldCount = 0;

    @Indexed
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @Indexed
    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
