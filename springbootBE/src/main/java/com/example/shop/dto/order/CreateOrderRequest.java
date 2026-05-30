package com.example.shop.dto.order;

import com.example.shop.model.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOrderRequest {

    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String phone;

    @NotNull
    private PaymentMethod paymentMethod;
}
