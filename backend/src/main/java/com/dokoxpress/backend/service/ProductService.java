package com.dokoxpress.backend.service;

import com.dokoxpress.backend.model.Product;
import com.dokoxpress.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product updateProduct(Long id, Product updates) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        if (updates.getName() != null) existing.setName(updates.getName());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getPrice() > 0) existing.setPrice(updates.getPrice());
        if (updates.getStock() != null) existing.setStock(updates.getStock());
        if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getImageUrl() != null) existing.setImageUrl(updates.getImageUrl());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}