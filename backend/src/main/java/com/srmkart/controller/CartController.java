package com.srmkart.controller;

import com.srmkart.dto.AddToCartRequest;
import com.srmkart.entity.Cart;
import com.srmkart.entity.User;
import com.srmkart.repository.UserRepository;
import com.srmkart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Cart> getCart() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(cartService.getCartByUser(user));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(cartService.addToCart(user, request));
    }

    @DeleteMapping("/remove/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Cart> removeFromCart(@PathVariable Long productId) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(cartService.removeFromCart(user, productId));
    }

    @DeleteMapping("/clear")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> clearCart() {
        User user = getAuthenticatedUser();
        cartService.clearCart(user);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}
