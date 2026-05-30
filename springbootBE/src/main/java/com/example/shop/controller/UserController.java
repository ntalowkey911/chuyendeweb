package com.example.shop.controller;

import com.example.shop.dto.user.SyncClerkRequest;
import com.example.shop.model.User;
import com.example.shop.model.Role;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PostMapping("/sync-clerk")
    public ResponseEntity<?> syncClerkUser(@RequestBody SyncClerkRequest request) {
        Optional<User> optionalUser = userRepository.findByClerkId(request.getClerkId());
        User user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            user.setAvatarUrl(request.getAvatarUrl());
            user.setFullName(request.getFullName());
            user.setLastLoginAt(Instant.now());
            user.setLoginCount(user.getLoginCount() + 1);
        } else {
            // Also check by email just in case they logged in previously with custom auth
            Optional<User> byEmail = userRepository.findByEmail(request.getEmail());
            if (byEmail.isPresent()) {
                user = byEmail.get();
                user.setClerkId(request.getClerkId());
                user.setAvatarUrl(request.getAvatarUrl());
                user.setFullName(request.getFullName());
                user.setLastLoginAt(Instant.now());
                user.setLoginCount(user.getLoginCount() + 1);
            } else {
                user = User.builder()
                        .clerkId(request.getClerkId())
                        .email(request.getEmail())
                        .fullName(request.getFullName())
                        .avatarUrl(request.getAvatarUrl())
                        .role(Role.USER)
                        .createdAt(Instant.now())
                        .lastLoginAt(Instant.now())
                        .loginCount(1)
                        .build();
            }
        }

        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null && !request.getAddress().isEmpty()) {
            user.setAddress(request.getAddress());
        }

        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}
