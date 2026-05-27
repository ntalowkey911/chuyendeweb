package com.example.shop.dto.auth;

import com.example.shop.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    private String token;
    private String userId;
    private String fullName;
    private String email;
    private Role role;
}
