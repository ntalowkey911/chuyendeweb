package com.example.shop.service;

import com.example.shop.dto.PageResponse;
import com.example.shop.dto.article.ArticleRequest;
import com.example.shop.dto.article.ArticleResponse;
import com.example.shop.exception.BadRequestException;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.model.Article;
import com.example.shop.model.User;
import com.example.shop.repository.ArticleRepository;
import com.example.shop.repository.UserRepository;
import com.example.shop.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public PageResponse<ArticleResponse> getPublicArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Article> articlePage = articleRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
        return toPageResponse(articlePage);
    }

    public ArticleResponse getArticleBySlug(String slug) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));
        if (!article.getIsActive()) {
            throw new ResourceNotFoundException("Article not found");
        }
        return toResponse(article);
    }

    public PageResponse<ArticleResponse> getAdminArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Article> articlePage = articleRepository.findAllByOrderByCreatedAtDesc(pageable);
        return toPageResponse(articlePage);
    }

    public ArticleResponse createArticle(ArticleRequest request) {
        if (articleRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Slug already exists");
        }

        String authorName = "Admin";
        String userId = SecurityUtils.getCurrentUserId();
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                authorName = user.getFullName();
            }
        }

        Article article = Article.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .summary(request.getSummary())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .author(authorName)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return toResponse(articleRepository.save(article));
    }

    public ArticleResponse updateArticle(String id, ArticleRequest request) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        if (!article.getSlug().equals(request.getSlug()) &&
                articleRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Slug already exists");
        }

        article.setTitle(request.getTitle());
        article.setSlug(request.getSlug());
        article.setSummary(request.getSummary());
        article.setContent(request.getContent());
        article.setImageUrl(request.getImageUrl());
        if (request.getIsActive() != null) {
            article.setIsActive(request.getIsActive());
        }
        article.setUpdatedAt(Instant.now());

        return toResponse(articleRepository.save(article));
    }

    public void deleteArticle(String id) {
        if (!articleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Article not found");
        }
        articleRepository.deleteById(id);
    }

    private ArticleResponse toResponse(Article article) {
        return ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .slug(article.getSlug())
                .summary(article.getSummary())
                .content(article.getContent())
                .imageUrl(article.getImageUrl())
                .author(article.getAuthor())
                .isActive(article.getIsActive())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }

    private PageResponse<ArticleResponse> toPageResponse(Page<Article> page) {
        return PageResponse.<ArticleResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
