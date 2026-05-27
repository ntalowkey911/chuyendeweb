package com.example.shop.controller;

import com.example.shop.dto.admin.CustomerStatsResponse;
import com.example.shop.dto.admin.DashboardResponse;
import com.example.shop.dto.auth.UserResponse;
import com.example.shop.dto.order.OrderResponse;
import com.example.shop.dto.order.UpdateOrderStatusRequest;
import com.example.shop.dto.product.ProductRequest;
import com.example.shop.dto.product.ProductResponse;
import com.example.shop.service.AdminService;
import com.example.shop.service.OrderService;
import com.example.shop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final OrderService orderService;

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return adminService.getDashboard();
    }

    @GetMapping("/users")
    public List<UserResponse> users() {
        return adminService.getAllUsers();
    }

    @GetMapping("/customers")
    public List<CustomerStatsResponse> customers() {
        return adminService.getCustomerStats();
    }

    @GetMapping("/products")
    public List<ProductResponse> products() {
        return adminService.getAllProducts();
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @PutMapping("/products/{id}")
    public ProductResponse updateProduct(@PathVariable String id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id) {
        productService.delete(id);
    }

    @GetMapping("/orders")
    public List<OrderResponse> orders() {
        return adminService.getAllOrders();
    }

    @PutMapping("/orders/{id}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return orderService.updateStatus(id, request);
    }
}
