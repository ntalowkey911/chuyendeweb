package com.example.shop.dto.admin;

import com.example.shop.dto.category.CategoryResponse;
import com.example.shop.dto.product.ProductResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminOverviewResponse {

    private DashboardResponse stats;
    private List<ProductResponse> products;
    private List<CustomerStatsResponse> customers;
    private List<CategoryResponse> categories;
}
