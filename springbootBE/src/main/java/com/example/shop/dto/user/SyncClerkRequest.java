package com.example.shop.dto.user;

import lombok.Data;

@Data
public class SyncClerkRequest {
    private String clerkId;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String phone;
    private String address;
}
