package com.example.shop.repository;

import com.example.shop.model.Promotion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PromotionRepository extends MongoRepository<Promotion, String> {
    Optional<Promotion> findByCodeIgnoreCase(String code);
}
