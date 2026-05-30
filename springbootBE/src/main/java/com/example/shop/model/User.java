package com.example.shop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String phone;

    private String address;

    @Builder.Default
    private Role role = Role.USER;

    @Indexed(unique = true, sparse = true)
    private String clerkId;

    private String avatarUrl;

    private Instant lastLoginAt;

    @Builder.Default
    private int loginCount = 0;

    @CreatedDate
    private Instant createdAt;
}
