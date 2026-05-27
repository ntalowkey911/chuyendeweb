package com.example.shop.service;

import com.example.shop.dto.product.ProductRequest;
import com.example.shop.dto.product.ProductResponse;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.model.Product;
import com.example.shop.model.ProductStatus;
import com.example.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAll() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse getById(String id) {
        return toResponse(findProduct(id));
    }

    public List<ProductResponse> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAll();
        }
        String query = keyword.trim();
        return productRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrBrandContainingIgnoreCase(
                        query, query, query, query
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> getByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category)
                .stream().map(this::toResponse).toList();
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

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .imageUrls(product.getImageUrls())
                .category(product.getCategory())
                .brand(product.getBrand())
                .stock(product.getStock())
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
}
