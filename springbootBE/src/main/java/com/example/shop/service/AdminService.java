package com.example.shop.service;

import com.example.shop.dto.admin.AdminOverviewResponse;
import com.example.shop.dto.admin.CustomerStatsResponse;
import com.example.shop.dto.admin.DashboardResponse;
import com.example.shop.dto.category.CategoryResponse;
import com.example.shop.dto.auth.UserResponse;
import com.example.shop.dto.order.OrderResponse;
import com.example.shop.dto.product.ProductResponse;
import com.example.shop.model.Order;
import com.example.shop.model.OrderStatus;
import com.example.shop.model.User;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final OrderService orderService;
    private final CategoryService categoryService;

    public DashboardResponse getDashboard() {
        BigDecimal revenue = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .totalRevenue(revenue)
                .build();
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .toList();
    }

    public List<CustomerStatsResponse> getCustomerStats() {
        List<Order> orders = orderRepository.findAll();
        return userRepository.findAll().stream()
                .map(user -> toCustomerStats(user, orders))
                .toList();
    }

    public List<ProductResponse> getAllProducts() {
        return productService.getAll();
    }

    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    public AdminOverviewResponse getOverview() {
        DashboardResponse stats = getDashboard();
        List<ProductResponse> products = productService.getCatalog(null, null, null, null, null, false);
        List<CustomerStatsResponse> customers = getCustomerStats();
        List<CategoryResponse> categories = categoryService.getAll();

        return AdminOverviewResponse.builder()
                .stats(stats)
                .products(products)
                .customers(customers)
                .categories(categories)
                .build();
    }

    private CustomerStatsResponse toCustomerStats(User user, List<Order> orders) {
        List<Order> userOrders = orders.stream()
                .filter(order -> user.getId().equals(order.getUserId()))
                .toList();
        BigDecimal revenue = userOrders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CustomerStatsResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole())
                .totalOrders(userOrders.size())
                .completedOrders(userOrders.stream().filter(order -> order.getStatus() == OrderStatus.COMPLETED).count())
                .totalRevenue(revenue)
                .createdAt(user.getCreatedAt())
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
