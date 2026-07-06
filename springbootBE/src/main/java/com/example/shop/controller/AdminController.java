package com.example.shop.controller;

import com.example.shop.dto.PageResponse;
import com.example.shop.dto.admin.AdminOverviewResponse;
import com.example.shop.dto.admin.CustomerStatsResponse;
import com.example.shop.dto.admin.DashboardResponse;
import com.example.shop.dto.admin.StatisticsResponse;
import com.example.shop.dto.auth.UserResponse;
import com.example.shop.dto.category.CategoryRequest;
import com.example.shop.dto.category.CategoryResponse;
import com.example.shop.dto.order.OrderResponse;
import com.example.shop.dto.order.UpdateOrderStatusRequest;
import com.example.shop.dto.product.ProductRequest;
import com.example.shop.dto.product.ProductResponse;
import com.example.shop.dto.article.ArticleRequest;
import com.example.shop.dto.article.ArticleResponse;
import com.example.shop.dto.contact.ContactResponse;
import com.example.shop.service.AdminService;
import com.example.shop.service.ArticleService;
import com.example.shop.service.CategoryService;
import com.example.shop.service.ContactService;
import com.example.shop.service.OrderService;
import com.example.shop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private final ArticleService articleService;
    private final ContactService contactService;

    @GetMapping("/statistics")
    public ResponseEntity<StatisticsResponse> getStatistics() {
        return ResponseEntity.ok(adminService.getStatistics());
    }

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
    public PageResponse<ProductResponse> products(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getAllProducts(page, size);
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
    public PageResponse<OrderResponse> orders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getAllOrders(page, size);
    }

    @PutMapping("/orders/{id}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return orderService.updateStatus(id, request);
    }

    @GetMapping("/articles")
    public PageResponse<ArticleResponse> adminArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return articleService.getAdminArticles(page, size);
    }

    @PostMapping("/articles")
    @ResponseStatus(HttpStatus.CREATED)
    public ArticleResponse createArticle(@Valid @RequestBody ArticleRequest request) {
        return articleService.createArticle(request);
    }

    @PutMapping("/articles/{id}")
    public ArticleResponse updateArticle(@PathVariable String id, @Valid @RequestBody ArticleRequest request) {
        return articleService.updateArticle(id, request);
    }

    @DeleteMapping("/articles/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteArticle(@PathVariable String id) {
        articleService.deleteArticle(id);
    }

    @GetMapping("/contacts")
    public PageResponse<ContactResponse> adminContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return contactService.getAllContacts(page, size);
    }

    @PutMapping("/contacts/{id}/read")
    public ContactResponse markContactAsRead(@PathVariable String id) {
        return contactService.markAsRead(id);
    }

    @DeleteMapping("/contacts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContact(@PathVariable String id) {
        contactService.deleteContact(id);
    }
}
