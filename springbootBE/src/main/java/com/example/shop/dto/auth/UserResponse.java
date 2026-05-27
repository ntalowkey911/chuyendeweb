package com.example.shop.dto.auth;

import com.example.shop.model.Role;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserResponse {

    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private Role role;
    private Instant createdAt;
}
