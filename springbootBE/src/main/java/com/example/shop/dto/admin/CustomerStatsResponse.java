package com.example.shop.dto.admin;

import com.example.shop.model.Role;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class CustomerStatsResponse {

    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private Role role;
    private long totalOrders;
    private long completedOrders;
    private BigDecimal totalRevenue;
    private Instant createdAt;
}
