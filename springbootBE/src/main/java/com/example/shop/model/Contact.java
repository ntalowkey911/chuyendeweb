package com.example.shop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "contacts")
public class Contact {
    @Id
    private String id;
    
    private String name;
    private String email;
    private String subject;
    private String message;
    
    @Builder.Default
    private boolean isRead = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
