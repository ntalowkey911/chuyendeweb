package com.example.shop.service;

import com.example.shop.dto.PageResponse;
import com.example.shop.dto.admin.AdminOverviewResponse;
import com.example.shop.dto.admin.CustomerStatsResponse;
import com.example.shop.dto.admin.DashboardResponse;
import com.example.shop.dto.admin.StatisticsResponse;
import com.example.shop.dto.category.CategoryResponse;
import com.example.shop.dto.auth.UserResponse;
import com.example.shop.dto.order.OrderResponse;
import com.example.shop.dto.product.ProductResponse;
import com.example.shop.model.Order;
import com.example.shop.model.OrderStatus;
import com.example.shop.model.Product;
import com.example.shop.model.User;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

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

    public StatisticsResponse getStatistics() {
        List<Order> allOrders = orderRepository.findAll();
        List<Order> completedOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .toList();

        ZonedDateTime now = ZonedDateTime.now(ZONE);
        Instant startOfToday = now.toLocalDate().atStartOfDay(ZONE).toInstant();
        Instant startOfWeek = now.toLocalDate().with(DayOfWeek.MONDAY).atStartOfDay(ZONE).toInstant();
        Instant startOfMonth = now.toLocalDate().with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay(ZONE).toInstant();

        // Revenue from COMPLETED orders
        BigDecimal todayRevenue = sumRevenue(completedOrders, startOfToday);
        BigDecimal weekRevenue = sumRevenue(completedOrders, startOfWeek);
        BigDecimal monthRevenue = sumRevenue(completedOrders, startOfMonth);
        BigDecimal totalRevenue = completedOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Order counts from ALL orders
        long todayOrders = countOrders(allOrders, startOfToday);
        long weekOrders = countOrders(allOrders, startOfWeek);
        long monthOrders = countOrders(allOrders, startOfMonth);
        long totalOrders = allOrders.size();

        // Daily revenue (last 30 days)
        List<StatisticsResponse.DailyRevenue> dailyRevenue = buildDailyRevenue(completedOrders, now);

        // Monthly revenue (last 12 months)
        List<StatisticsResponse.MonthlyRevenue> monthlyRevenue = buildMonthlyRevenue(completedOrders, now);

        // Order status counts (ALL orders)
        List<StatisticsResponse.OrderStatusCount> orderStatusCounts = Arrays.stream(OrderStatus.values())
                .map(status -> StatisticsResponse.OrderStatusCount.builder()
                        .status(status.name())
                        .count(allOrders.stream().filter(o -> o.getStatus() == status).count())
                        .build())
                .toList();

        // Top 10 products by soldCount
        List<StatisticsResponse.TopProduct> topProducts = productRepository.findAll().stream()
                .sorted(Comparator.comparingInt((Product p) -> p.getSoldCount() != null ? p.getSoldCount() : 0).reversed())
                .limit(10)
                .map(p -> StatisticsResponse.TopProduct.builder()
                        .productId(p.getId())
                        .name(p.getName())
                        .soldCount(p.getSoldCount() != null ? p.getSoldCount() : 0)
                        .revenue(p.getPrice().multiply(BigDecimal.valueOf(p.getSoldCount() != null ? p.getSoldCount() : 0)))
                        .build())
                .toList();

        // Revenue by payment method (COMPLETED orders)
        List<StatisticsResponse.RevenueByPaymentMethod> revenueByPaymentMethod = completedOrders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getPaymentMethod().name(),
                        Collectors.toList()))
                .entrySet().stream()
                .map(e -> StatisticsResponse.RevenueByPaymentMethod.builder()
                        .method(e.getKey())
                        .revenue(e.getValue().stream()
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add))
                        .count(e.getValue().size())
                        .build())
                .toList();

        return StatisticsResponse.builder()
                .todayRevenue(todayRevenue)
                .weekRevenue(weekRevenue)
                .monthRevenue(monthRevenue)
                .totalRevenue(totalRevenue)
                .todayOrders(todayOrders)
                .weekOrders(weekOrders)
                .monthOrders(monthOrders)
                .totalOrders(totalOrders)
                .dailyRevenue(dailyRevenue)
                .monthlyRevenue(monthlyRevenue)
                .orderStatusCounts(orderStatusCounts)
                .topProducts(topProducts)
                .revenueByPaymentMethod(revenueByPaymentMethod)
                .build();
    }

    private BigDecimal sumRevenue(List<Order> orders, Instant from) {
        return orders.stream()
                .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(from))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private long countOrders(List<Order> orders, Instant from) {
        return orders.stream()
                .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(from))
                .count();
    }

    private List<StatisticsResponse.DailyRevenue> buildDailyRevenue(List<Order> completedOrders, ZonedDateTime now) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = now.toLocalDate();

        Map<String, List<Order>> grouped = completedOrders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .filter(o -> !o.getCreatedAt().isBefore(today.minusDays(29).atStartOfDay(ZONE).toInstant()))
                .collect(Collectors.groupingBy(o -> o.getCreatedAt().atZone(ZONE).toLocalDate().format(fmt)));

        List<StatisticsResponse.DailyRevenue> result = new ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            String dateStr = today.minusDays(i).format(fmt);
            List<Order> dayOrders = grouped.getOrDefault(dateStr, Collections.emptyList());
            result.add(StatisticsResponse.DailyRevenue.builder()
                    .date(dateStr)
                    .revenue(dayOrders.stream().map(Order::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add))
                    .orderCount(dayOrders.size())
                    .build());
        }
        return result;
    }

    private List<StatisticsResponse.MonthlyRevenue> buildMonthlyRevenue(List<Order> completedOrders, ZonedDateTime now) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        YearMonth currentMonth = YearMonth.from(now);

        Map<String, List<Order>> grouped = completedOrders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .filter(o -> !YearMonth.from(o.getCreatedAt().atZone(ZONE)).isBefore(currentMonth.minusMonths(11)))
                .collect(Collectors.groupingBy(o -> YearMonth.from(o.getCreatedAt().atZone(ZONE)).format(fmt)));

        List<StatisticsResponse.MonthlyRevenue> result = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            String monthStr = currentMonth.minusMonths(i).format(fmt);
            List<Order> monthOrders = grouped.getOrDefault(monthStr, Collections.emptyList());
            result.add(StatisticsResponse.MonthlyRevenue.builder()
                    .month(monthStr)
                    .revenue(monthOrders.stream().map(Order::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add))
                    .orderCount(monthOrders.size())
                    .build());
        }
        return result;
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

    public PageResponse<ProductResponse> getAllProducts(int page, int size) {
        return productService.getAllAdmin(page, size);
    }

    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        return orderService.getAllOrders(page, size);
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
