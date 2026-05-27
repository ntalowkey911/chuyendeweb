package com.example.shop.controller;

import com.example.shop.dto.cart.AddToCartRequest;
import com.example.shop.dto.cart.CartResponse;
import com.example.shop.dto.cart.UpdateCartRequest;
import com.example.shop.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }

    @PostMapping("/add")
    public CartResponse add(@Valid @RequestBody AddToCartRequest request) {
        return cartService.addItem(request);
    }

    @PutMapping("/update")
    public CartResponse update(@Valid @RequestBody UpdateCartRequest request) {
        return cartService.updateItem(request);
    }

    @DeleteMapping("/remove/{productId}")
    public CartResponse remove(@PathVariable String productId) {
        return cartService.removeItem(productId);
    }

    @DeleteMapping("/clear")
    public CartResponse clear() {
        cartService.clearCart(cartService.getOrCreateCart().getUserId());
        return cartService.getCart();
    }
}
