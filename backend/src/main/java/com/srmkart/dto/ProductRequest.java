package com.srmkart.dto;

import com.srmkart.entity.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private Product.Condition condition;
    private Long categoryId;
    private List<String> imageUrls;
}
