package com.dokoxpress.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/reset-vendors")
    public String resetVendors() {
        try {
            // Disable FK checks to allow truncation/deletion of interrelated data
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");

            // 1. Clear mirrored vendor and product tables
            jdbcTemplate.execute("TRUNCATE TABLE vendors");
            jdbcTemplate.execute("DELETE FROM products WHERE vendor_id = 13 OR status = 'active' OR vendor_id IS NULL");

            // 2. Clear transactional data that depends on products/vendors
            jdbcTemplate.execute("DELETE FROM cart");
            jdbcTemplate.execute("DELETE FROM order_items");
            jdbcTemplate.execute("DELETE FROM orders");

            // 3. Delete the actual vendor user accounts
            jdbcTemplate.execute("DELETE FROM users WHERE role = 'vendor' OR role = 'VENDOR'");

            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");

            return "SUCCESS: All vendor data, products, orders, and cart items have been cleared. You can now start fresh.";
        } catch (Exception e) {
            // Ensure FK checks are re-enabled even on error
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");
            return "ERROR: " + e.getMessage();
        }
    }
}
