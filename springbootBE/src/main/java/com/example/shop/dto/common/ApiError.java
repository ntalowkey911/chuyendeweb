package com.example.shop.dto.common;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ApiError {

    private int status;
    private String message;
    private Instant timestamp;
}
