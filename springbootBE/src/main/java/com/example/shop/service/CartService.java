package com.example.shop.service;

import com.example.shop.dto.cart.AddToCartRequest;
import com.example.shop.dto.cart.CartResponse;
import com.example.shop.dto.cart.UpdateCartRequest;
import com.example.shop.exception.BadRequestException;
import com.example.shop.exception.ResourceNotFoundException;
import com.example.shop.model.Cart;
import com.example.shop.model.CartItem;
import com.example.shop.model.Product;
import com.example.shop.model.ProductStatus;
import com.example.shop.repository.CartRepository;
import com.example.shop.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductService productService;

    public CartResponse getCart() {
        return toResponse(getOrCreateCart());
    }

    public CartResponse addItem(AddToCartRequest request) {
        Product product = productService.findProduct(request.getProductId());
        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("Product is not available");
        }

        Cart cart = getOrCreateCart();
        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(product.getId()))
                .findFirst();

        int newQty = request.getQuantity();
        if (existing.isPresent()) {
            newQty = existing.get().getQuantity() + request.getQuantity();
        }
        if (newQty > product.getStock()) {
            throw new BadRequestException("Quantity exceeds stock");
        }

        if (existing.isPresent()) {
            existing.get().setQuantity(newQty);
        } else {
            cart.getItems().add(CartItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(request.getQuantity())
                    .imageUrl(product.getImageUrl())
                    .build());
        }

        recalculate(cart);
        return toResponse(cartRepository.save(cart));
    }

    public CartResponse updateItem(UpdateCartRequest request) {
        Product product = productService.findProduct(request.getProductId());
        Cart cart = getOrCreateCart();

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(request.getProductId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not in cart"));

        if (request.getQuantity() > product.getStock()) {
            throw new BadRequestException("Quantity exceeds stock");
        }

        item.setQuantity(request.getQuantity());
        recalculate(cart);
        return toResponse(cartRepository.save(cart));
    }

    public CartResponse removeItem(String productId) {
        Cart cart = getOrCreateCart();
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        recalculate(cart);
        return toResponse(cartRepository.save(cart));
    }

    public void clearCart(String userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cart.setTotalAmount(BigDecimal.ZERO);
            cart.setUpdatedAt(Instant.now());
            cartRepository.save(cart);
        });
    }

    public Cart getOrCreateCart() {
        String userId = SecurityUtils.getCurrentUserId();
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .userId(userId)
                        .items(new ArrayList<>())
                        .totalAmount(BigDecimal.ZERO)
                        .updatedAt(Instant.now())
                        .build()));
    }

    private void recalculate(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
        cart.setUpdatedAt(Instant.now());
    }

    private CartResponse toResponse(Cart cart) {
        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(cart.getItems())
                .totalAmount(cart.getTotalAmount())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
}
