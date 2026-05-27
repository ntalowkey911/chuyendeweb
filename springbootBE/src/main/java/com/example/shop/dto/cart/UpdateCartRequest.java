package com.example.shop.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCartRequest {

    @NotBlank
    private String productId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
