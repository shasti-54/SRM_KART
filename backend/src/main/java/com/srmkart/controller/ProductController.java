package com.srmkart.controller;

import com.srmkart.dto.ProductRequest;
import com.srmkart.entity.Product;
import com.srmkart.entity.User;
import com.srmkart.repository.UserRepository;
import com.srmkart.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        if (search != null)
            return productService.searchProducts(search);
        if (categoryId != null)
            return productService.getProductsByCategory(categoryId);
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(productService.createProduct(request, seller));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @productService.getProductById(#id).seller.email == authentication.name")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
