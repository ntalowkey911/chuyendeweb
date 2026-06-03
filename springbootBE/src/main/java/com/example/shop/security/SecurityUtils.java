package com.example.shop.security;

import com.example.shop.exception.BadRequestException;
import com.example.shop.model.User;
import com.example.shop.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

public final class SecurityUtils {

    private static UserRepository userRepository;

    private SecurityUtils() {
    }

    public static void setUserRepository(UserRepository repo) {
        userRepository = repo;
    }

    public static CustomUserDetails getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new BadRequestException("User not authenticated");
        }
        
        if (auth.getPrincipal() instanceof CustomUserDetails details) {
            return details;
        }
        
        if (auth.getPrincipal() instanceof Jwt jwt) {
            String clerkId = jwt.getSubject();
            User user = userRepository.findByClerkId(clerkId)
                    .orElseThrow(() -> new BadRequestException("User not synced"));
            return new CustomUserDetails(user);
        }
        
        throw new BadRequestException("User not authenticated");
    }

    public static String getCurrentUserId() {
        return getCurrentUser().getUser().getId();
    }

    @Component
    public static class SecurityUtilsInjector {
        public SecurityUtilsInjector(UserRepository repo) {
            SecurityUtils.setUserRepository(repo);
        }
    }
}
