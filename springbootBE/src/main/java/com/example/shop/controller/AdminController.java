package com.example.shop.controller;

import com.example.shop.dto.admin.AdminOverviewResponse;
import com.example.shop.dto.admin.CustomerStatsResponse;
import com.example.shop.dto.admin.DashboardResponse;
import com.example.shop.dto.auth.UserResponse;
import com.example.shop.dto.category.CategoryRequest;
import com.example.shop.dto.category.CategoryResponse;
import com.example.shop.dto.order.OrderResponse;
import com.example.shop.dto.order.UpdateOrderStatusRequest;
import com.example.shop.dto.product.ProductRequest;
import com.example.shop.dto.product.ProductResponse;
import com.example.shop.service.AdminService;
import com.example.shop.service.CategoryService;
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
    private final CategoryService categoryService;

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return adminService.getDashboard();
    }

    @GetMapping("/overview")
    public AdminOverviewResponse overview() {
        return adminService.getOverview();
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

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return categoryService.getAll();
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(@PathVariable String id, @Valid @RequestBody CategoryRequest request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable String id) {
        categoryService.delete(id);
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
