package com.example.shop.repository;

import com.example.shop.model.Order;
import com.example.shop.model.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Order> findByStatus(OrderStatus status);
}
