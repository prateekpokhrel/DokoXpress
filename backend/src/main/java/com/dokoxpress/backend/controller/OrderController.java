package com.dokoxpress.backend.controller;

import com.dokoxpress.backend.model.*;
import com.dokoxpress.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/checkout/{userId}")
    @Transactional
    public ResponseEntity<?> checkout(@PathVariable Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty");
        }

        User customer = userRepository.findById(userId).orElse(null);
        String customerName = customer != null ? customer.getName() : "Customer";

        // Group cart items by vendor ID to split orders
        Map<Long, List<Cart>> vendorItems = new HashMap<>();
        for (Cart cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId()).orElse(null);
            if (product != null) {
                cartItem.setProduct(product);
                vendorItems.computeIfAbsent(product.getVendorId(), k -> new ArrayList<>()).add(cartItem);
            }
        }

        List<Order> placedOrders = new ArrayList<>();

        for (Map.Entry<Long, List<Cart>> entry : vendorItems.entrySet()) {
            Long vendorId = entry.getKey();
            List<Cart> itemsForVendor = entry.getValue();

            User vendor = userRepository.findById(vendorId).orElse(null);
            String vendorName = vendor != null ? vendor.getName() : "Vendor";

            double vendorTotal = 0;
            Order order = new Order();
            order.setUserId(userId);
            order.setVendorId(vendorId);
            order.setStatus("Placed");
            order = orderRepository.save(order);

            List<OrderItem> orderItems = new ArrayList<>();
            for (Cart cartItem : itemsForVendor) {
                Product product = cartItem.getProduct();
                
                // CRITICAL: Reduce stock
                if (product.getStock() != null && product.getStock() >= cartItem.getQuantity()) {
                    product.setStock(product.getStock() - cartItem.getQuantity());
                    productRepository.save(product);
                }

                double price = product.getPrice();
                vendorTotal += price * cartItem.getQuantity();

                OrderItem orderItem = new OrderItem();
                orderItem.setOrderId(order.getId());
                orderItem.setProductId(product.getId());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(price);
                orderItem.setProduct(product);
                orderItemRepository.save(orderItem);
                
                orderItems.add(orderItem);
            }

            order.setTotalPrice(vendorTotal);
            orderRepository.save(order);
            
            order.setItems(orderItems);
            order.setUserName(customerName);
            order.setVendorName(vendorName);
            placedOrders.add(order);
        }

        // Clear user's cart
        cartRepository.deleteAll(cartItems);

        return ResponseEntity.ok(placedOrders);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        for (Order order : orders) {
            populateOrderDetails(order);
        }
        return orders;
    }

    @GetMapping("/vendor/{vendorId}")
    public List<Order> getVendorOrders(@PathVariable Long vendorId) {
        List<Order> orders = orderRepository.findByVendorId(vendorId);
        for (Order order : orders) {
            populateOrderDetails(order);
        }
        return orders;
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            order.setStatus(status);
            orderRepository.save(order);
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        for (Order order : orders) {
            populateOrderDetails(order);
        }
        return orders;
    }

    private void populateOrderDetails(Order order) {
        User user = userRepository.findById(order.getUserId()).orElse(null);
        if (user != null) order.setUserName(user.getName());
        
        User vendor = userRepository.findById(order.getVendorId()).orElse(null);
        if (vendor != null) order.setVendorName(vendor.getName());
        
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        for (OrderItem item : items) {
            item.setProduct(productRepository.findById(item.getProductId()).orElse(null));
        }
        order.setItems(items);
    }
}
