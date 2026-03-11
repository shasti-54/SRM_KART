package com.srmkart.config;

import com.srmkart.entity.Category;
import com.srmkart.entity.Product;
import com.srmkart.entity.ProductImage;
import com.srmkart.entity.User;
import com.srmkart.repository.CategoryRepository;
import com.srmkart.repository.ProductRepository;
import com.srmkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Create an admin user if not exists
        User admin = userRepository.findByEmail("admin@srmkart.com").orElseGet(() -> {
            User newUser = new User();
            newUser.setName("SRM KART Admin");
            newUser.setEmail("admin@srmkart.com");
            newUser.setPassword(passwordEncoder.encode("admin123"));
            newUser.setRole(User.Role.ADMIN);
            return userRepository.save(newUser);
        });

        // Create category if not exists
        Category category = categoryRepository.findBySlug("electronics").orElseGet(() -> {
            Category newCategory = new Category();
            newCategory.setName("Electronics");
            newCategory.setSlug("electronics");
            return categoryRepository.save(newCategory);
        });

        // Check if Casio calculator already exists
        boolean calculatorExists = productRepository.findAll().stream()
                .anyMatch(p -> p.getTitle().contains("Casio fx-991ES"));

        if (!calculatorExists) {
            Product casio = new Product();
            casio.setTitle("Casio fx-991ES PLUS Scientific Calculator");
            casio.setDescription("Casio fx-991ES PLUS NATURAL-V.P.A.M. 2nd edition scientific calculator. Excellent condition, barely used.");
            casio.setPrice(new BigDecimal("500.00"));
            casio.setCondition(Product.Condition.USED);
            casio.setCategory(category);
            casio.setSeller(admin);
            casio.setStatus(Product.Status.AVAILABLE);

            ProductImage image = new ProductImage(casio, "https://m.media-amazon.com/images/I/71w1BpxbC-L._AC_SL1500_.jpg");
            casio.setImages(List.of(image));

            productRepository.save(casio);
            System.out.println("Seeded Casio calculator to DB!");
        }
    }
}
