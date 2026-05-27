package com.example.shop.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateOrderRequest {

    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String phone;
}
