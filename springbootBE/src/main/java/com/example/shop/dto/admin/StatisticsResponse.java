package com.example.shop.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatisticsResponse {
    private BigDecimal todayRevenue;
    private BigDecimal weekRevenue;
    private BigDecimal monthRevenue;
    private BigDecimal totalRevenue;
    private long todayOrders;
    private long weekOrders;
    private long monthOrders;
    private long totalOrders;
    private List<DailyRevenue> dailyRevenue;
    private List<MonthlyRevenue> monthlyRevenue;
    private List<OrderStatusCount> orderStatusCounts;
    private List<TopProduct> topProducts;
    private List<RevenueByPaymentMethod> revenueByPaymentMethod;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyRevenue {
        private String date; // format: yyyy-MM-dd
        private BigDecimal revenue;
        private long orderCount;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyRevenue {
        private String month; // format: yyyy-MM
        private BigDecimal revenue;
        private long orderCount;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderStatusCount {
        private String status;
        private long count;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopProduct {
        private String productId;
        private String name;
        private int soldCount;
        private BigDecimal revenue;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RevenueByPaymentMethod {
        private String method;
        private BigDecimal revenue;
        private long count;
    }
}
