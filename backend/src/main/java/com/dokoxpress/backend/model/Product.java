package com.dokoxpress.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Vendor ID — references users.id (the vendor's user account)
    @Column(name = "vendor_id")
    private Long vendorId;

    // 📦 Product Name
    @Column(nullable = false)
    private String name;

    // 📝 Description — TEXT to allow longer content
    @Column(columnDefinition = "TEXT")
    private String description;

    // 💰 Price
    @Column(nullable = false)
    private double price;

    // 📊 Stock quantity
    private Integer stock;

    // 🏷 Category
    private String category;

    // ✅ Status (ACTIVE / DRAFT)
    private String status = "ACTIVE";

    // 🖼 Image — LONGTEXT to support base64 encoded images
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    private String vendorName;

    // 🕐 Auto-set by DB default
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // ========================
    // Constructors
    // ========================

    public Product() {}

    public Product(Long vendorId, String name, String description, double price,
                   Integer stock, String category, String status, String imageUrl) {
        this.vendorId    = vendorId;
        this.name        = name;
        this.description = description;
        this.price       = price;
        this.stock       = stock;
        this.category    = category;
        this.status      = status;
        this.imageUrl    = imageUrl;
    }

    // ========================
    // Getters & Setters
    // ========================

    public Long          getId()              { return id; }
    public Long          getVendorId()        { return vendorId; }
    public void          setVendorId(Long v)  { this.vendorId = v; }
    public String        getName()            { return name; }
    public void          setName(String n)    { this.name = n; }
    public String        getDescription()     { return description; }
    public void          setDescription(String d) { this.description = d; }
    public double        getPrice()           { return price; }
    public void          setPrice(double p)   { this.price = p; }
    public Integer       getStock()           { return stock; }
    public void          setStock(Integer s)  { this.stock = s; }
    public String        getCategory()        { return category; }
    public void          setCategory(String c){ this.category = c; }
    public String        getStatus()          { return status; }
    public void          setStatus(String s)  { this.status = s; }
    public String        getImageUrl()        { return imageUrl; }
    public void          setImageUrl(String i){ this.imageUrl = i; }
    public String        getVendorName()      { return vendorName; }
    public void          setVendorName(String vn) { this.vendorName = vn; }
    public LocalDateTime getCreatedAt()       { return createdAt; }
}