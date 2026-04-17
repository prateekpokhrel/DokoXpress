package com.dokoxpress.backend.controller;

import com.dokoxpress.backend.model.Cart;
import com.dokoxpress.backend.model.Product;
import com.dokoxpress.backend.repository.CartRepository;
import com.dokoxpress.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@org.springframework.transaction.annotation.Transactional
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        for (Cart item : cartItems) {
            if (item.getProductId() != null) {
                Product product = productRepository.findById(item.getProductId()).orElse(null);
                item.setProduct(product);
            }
        }
        return cartItems;
    }

    @PostMapping("/{userId}")
    @org.springframework.transaction.annotation.Transactional
    public List<Cart> addToCart(@PathVariable Long userId, @RequestBody CartRequest request) {
        Long productId = request.getProductId();
        if (productId == null) return getCart(userId);

        // Handle possible multiple entries gracefully by taking the first one
        List<Cart> items = cartRepository.findByUserIdAndProductId(userId, productId);
        Cart existingItem = items.isEmpty() ? null : items.get(0);
        
        if (existingItem != null) {
            int currentQty = existingItem.getQuantity() != null ? existingItem.getQuantity() : 0;
            existingItem.setQuantity(currentQty + 1);
            cartRepository.save(existingItem);
        } else {
            Cart newItem = new Cart(userId, productId, 1);
            cartRepository.save(newItem);
        }
        
        return getCart(userId);
    }

    @PutMapping("/{userId}")
    @org.springframework.transaction.annotation.Transactional
    public List<Cart> updateCartQuantity(@PathVariable Long userId, @RequestBody CartRequest request) {
        Long productId = request.getProductId();
        Integer quantity = request.getQuantity();
        
        if (productId == null || quantity == null) return getCart(userId);

        List<Cart> items = cartRepository.findByUserIdAndProductId(userId, productId);
        Cart existingItem = items.isEmpty() ? null : items.get(0);
        
        if (existingItem != null) {
            if (quantity <= 0) {
                cartRepository.delete(existingItem);
            } else {
                existingItem.setQuantity(quantity);
                cartRepository.save(existingItem);
            }
        }
        return getCart(userId);
    }

    @DeleteMapping("/{userId}/{productId}")
    @org.springframework.transaction.annotation.Transactional
    public List<Cart> removeFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        List<Cart> items = cartRepository.findByUserIdAndProductId(userId, productId);
        if (!items.isEmpty()) {
            cartRepository.deleteAll(items);
        }
        return getCart(userId);
    }

    // --- DTO ---
    public static class CartRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
