package com.example.shop.repository;

import com.example.shop.model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleRepository extends MongoRepository<Article, String> {
    Optional<Article> findBySlug(String slug);
    Page<Article> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    Page<Article> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
