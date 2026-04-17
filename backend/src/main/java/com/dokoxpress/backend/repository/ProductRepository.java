package com.dokoxpress.backend.repository;

import com.dokoxpress.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}