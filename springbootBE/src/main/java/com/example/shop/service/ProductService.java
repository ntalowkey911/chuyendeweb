package com.example.shop.service;

import com.example.shop.dto.product.ProductRequest;
import com.example.shop.dto.product.ProductResponse;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.model.Category;
import com.example.shop.model.Product;
import com.example.shop.model.ProductStatus;
import com.example.shop.repository.CategoryRepository;
import com.example.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MongoTemplate mongoTemplate;

    public List<ProductResponse> getAll() {
        return toResponses(productRepository.findAll());
    }

    public List<ProductResponse> getCatalog(
            String category,
            String keyword,
            String price,
            String sort,
            Integer limit,
            boolean activeOnly
    ) {
        Query query = new Query();

        if (activeOnly) {
            query.addCriteria(Criteria.where("status").is(ProductStatus.ACTIVE));
        }

        if (category != null && !category.isBlank()) {
            query.addCriteria(Criteria.where("category").regex("^" + Pattern.quote(category.trim()) + "$", "i"));
        }

        if (keyword != null && !keyword.isBlank()) {
            String regex = ".*" + Pattern.quote(keyword.trim()) + ".*";
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(regex, "i"),
                    Criteria.where("description").regex(regex, "i"),
                    Criteria.where("brand").regex(regex, "i"),
                    Criteria.where("category").regex(regex, "i")
            ));
        }

        applyPriceFilter(query, price);
        query.with(resolveSort(sort));

        if (limit != null && limit > 0) {
            query.limit(limit);
        }

        return toResponses(mongoTemplate.find(query, Product.class));
    }

    public ProductResponse getById(String id) {
        return toResponse(findProduct(id));
    }

    public List<ProductResponse> search(String keyword) {
        return getCatalog(null, keyword, null, null, null, true);
    }

    public List<ProductResponse> getByCategory(String category) {
        return getCatalog(category, null, null, null, null, true);
    }

    public ProductResponse create(ProductRequest request) {
        Instant now = Instant.now();
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(resolvePrimaryImage(request.getImageUrl(), request.getImageUrls()))
                .imageUrls(request.getImageUrls())
                .category(request.getCategory())
                .brand(request.getBrand())
                .stock(request.getStock())
                .soldCount(0)
                .status(request.getStatus() != null ? request.getStatus() : ProductStatus.ACTIVE)
                .createdAt(now)
                .updatedAt(now)
                .build();
        return toResponse(productRepository.save(product));
    }

    public ProductResponse update(String id, ProductRequest request) {
        Product product = findProduct(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(resolvePrimaryImage(request.getImageUrl(), request.getImageUrls()));
        product.setImageUrls(request.getImageUrls());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setStock(request.getStock());
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        product.setUpdatedAt(Instant.now());
        return toResponse(productRepository.save(product));
    }

    public void delete(String id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public Product findProduct(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    private List<ProductResponse> toResponses(List<Product> products) {
        Map<String, String> categoryNames = new HashMap<>();
        for (Category category : categoryRepository.findAll()) {
            categoryNames.put(category.getSlug(), category.getName());
        }

        return products.stream()
                .map((product) -> toResponse(product, categoryNames))
                .toList();
    }

    private ProductResponse toResponse(Product product) {
        return toResponse(product, Map.of());
    }

    private ProductResponse toResponse(Product product, Map<String, String> categoryNames) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .imageUrls(product.getImageUrls())
                .category(product.getCategory())
                .categoryName(resolveCategoryName(product.getCategory(), categoryNames))
                .brand(product.getBrand())
                .stock(product.getStock())
                .soldCount(product.getSoldCount())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private String resolvePrimaryImage(String imageUrl, List<String> imageUrls) {
        if (imageUrls != null && !imageUrls.isEmpty()) {
            return imageUrls.get(0);
        }
        return imageUrl;
    }

    private String resolveCategoryName(String slug, Map<String, String> categoryNames) {
        String cachedName = categoryNames.get(slug);
        if (cachedName != null) {
            return cachedName;
        }
        Category category = categoryRepository.findBySlug(slug).orElse(null);
        return category != null ? category.getName() : slug;
    }

    private void applyPriceFilter(Query query, String price) {
        if (price == null || price.isBlank()) {
            return;
        }

        switch (price) {
            case "under100" -> query.addCriteria(Criteria.where("price").lt(BigDecimal.valueOf(100_000)));
            case "100to200" -> query.addCriteria(new Criteria().andOperator(
                    Criteria.where("price").gte(BigDecimal.valueOf(100_000)),
                    Criteria.where("price").lte(BigDecimal.valueOf(200_000))
            ));
            case "above200" -> query.addCriteria(Criteria.where("price").gt(BigDecimal.valueOf(200_000)));
            default -> {
            }
        }
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        return switch (sort) {
            case "best-selling" -> Sort.by(Sort.Direction.DESC, "soldCount").and(Sort.by(Sort.Direction.DESC, "createdAt"));
            case "least-selling" -> Sort.by(Sort.Direction.ASC, "soldCount").and(Sort.by(Sort.Direction.DESC, "createdAt"));
            case "price-asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price-desc" -> Sort.by(Sort.Direction.DESC, "price");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
