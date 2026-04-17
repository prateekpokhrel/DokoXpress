package com.dokoxpress.backend.repository;

import com.dokoxpress.backend.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);

    @Modifying
    @Transactional
    void deleteByUserId(Long userId);

    List<Cart> findByUserIdAndProductId(Long userId, Long productId);
}
