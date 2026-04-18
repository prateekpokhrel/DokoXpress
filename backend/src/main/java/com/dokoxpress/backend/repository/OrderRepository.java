package com.dokoxpress.backend.repository;

import com.dokoxpress.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByVendorId(Long vendorId);
    List<Order> findByRiderId(Long riderId);
}
