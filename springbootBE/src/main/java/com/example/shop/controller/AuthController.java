package com.example.shop.controller;

import com.example.shop.dto.auth.AuthResponse;
import com.example.shop.dto.auth.LoginRequest;
import com.example.shop.dto.auth.RegisterRequest;
import com.example.shop.dto.auth.UserResponse;
import com.example.shop.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me() {
        return authService.getMe();
    }
}
