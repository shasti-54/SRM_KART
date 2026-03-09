package com.srmkart.service;

import com.srmkart.dto.ProductRequest;
import com.srmkart.entity.Product;
import com.srmkart.entity.ProductImage;
import com.srmkart.entity.User;
import com.srmkart.repository.CategoryRepository;
import com.srmkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Transactional
    public Product createProduct(ProductRequest request, User seller) {
        Product product = new Product();
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCondition(request.getCondition());
        product.setSeller(seller);
        product.setCategory(categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found")));

        if (request.getImageUrls() != null) {
            List<ProductImage> images = request.getImageUrls().stream()
                    .map(url -> new ProductImage(product, url))
                    .collect(Collectors.toList());
            product.setImages(images);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.searchProducts(query);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
}
