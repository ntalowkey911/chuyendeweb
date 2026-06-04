package com.example.shop.controller;

import com.example.shop.dto.PageResponse;
import com.example.shop.dto.article.ArticleResponse;
import com.example.shop.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public PageResponse<ArticleResponse> getArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return articleService.getPublicArticles(page, size);
    }

    @GetMapping("/{slug}")
    public ArticleResponse getArticleBySlug(@PathVariable String slug) {
        return articleService.getArticleBySlug(slug);
    }
}
