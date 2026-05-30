package com.example.shop.service;

import com.example.shop.dto.category.CategoryRequest;
import com.example.shop.dto.category.CategoryResponse;
import com.example.shop.exception.BadRequestException;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.model.Category;
import com.example.shop.model.Product;
import com.example.shop.repository.CategoryRepository;
import com.example.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAllByOrderByNameAsc().stream().map(this::toResponse).toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        String normalizedName = request.getName().trim();
        String slug = toSlug(normalizedName);
        if (categoryRepository.existsBySlug(slug)) {
            throw new BadRequestException("Category already exists");
        }

        Instant now = Instant.now();
        Category category = Category.builder()
                .name(normalizedName)
                .slug(slug)
                .description(request.getDescription() == null ? null : request.getDescription().trim())
                .createdAt(now)
                .updatedAt(now)
                .build();
        return toResponse(categoryRepository.save(category));
    }

    public CategoryResponse update(String id, CategoryRequest request) {
        Category category = findCategory(id);
        String normalizedName = request.getName().trim();
        String newSlug = toSlug(normalizedName);

        categoryRepository.findBySlug(newSlug)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new BadRequestException("Category already exists");
                });

        String oldSlug = category.getSlug();
        category.setName(normalizedName);
        category.setSlug(newSlug);
        category.setDescription(request.getDescription() == null ? null : request.getDescription().trim());
        category.setUpdatedAt(Instant.now());
        Category saved = categoryRepository.save(category);

        if (!oldSlug.equalsIgnoreCase(newSlug)) {
            List<Product> products = productRepository.findByCategoryIgnoreCase(oldSlug);
            products.forEach(product -> product.setCategory(newSlug));
            productRepository.saveAll(products);
        }

        return toResponse(saved);
    }

    public void delete(String id) {
        Category category = findCategory(id);
        if (productRepository.existsByCategoryIgnoreCase(category.getSlug())) {
            throw new BadRequestException("Cannot delete category that still has products");
        }
        categoryRepository.delete(category);
    }

    public Category findBySlug(String slug) {
        return categoryRepository.findBySlug(slug).orElse(null);
    }

    public void seedCategory(String name, String description) {
        String slug = toSlug(name);
        if (categoryRepository.existsBySlug(slug)) {
            return;
        }

        Instant now = Instant.now();
        categoryRepository.save(Category.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .createdAt(now)
                .updatedAt(now)
                .build());
    }

    private Category findCategory(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    private String toSlug(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        if (normalized.isBlank()) {
            throw new BadRequestException("Invalid category name");
        }
        return normalized;
    }
}
