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
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        for (Cart item : cartItems) {
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            item.setProduct(product);
        }
        return cartItems;
    }

    @PostMapping("/{userId}")
    public List<Cart> addToCart(@PathVariable Long userId, @RequestBody Map<String, Long> payload) {
        Long productId = payload.get("productId");
        Cart existingItem = cartRepository.findByUserIdAndProductId(userId, productId);
        
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + 1);
            cartRepository.save(existingItem);
        } else {
            Cart newItem = new Cart(userId, productId, 1);
            cartRepository.save(newItem);
        }
        
        return getCart(userId);
    }

    @PutMapping("/{userId}")
    public List<Cart> updateCartQuantity(@PathVariable Long userId, @RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());
        
        Cart existingItem = cartRepository.findByUserIdAndProductId(userId, productId);
        
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
    public List<Cart> removeFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        Cart existingItem = cartRepository.findByUserIdAndProductId(userId, productId);
        if (existingItem != null) {
            cartRepository.delete(existingItem);
        }
        return getCart(userId);
    }
}
