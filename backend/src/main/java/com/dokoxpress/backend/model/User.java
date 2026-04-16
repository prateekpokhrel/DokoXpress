package com.dokoxpress.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String role;

    // Contact & Location
    private String phone;
    private String country;
    private String state;
    private String city;

    // Vendor Specific
    private String storeName;

    // Base64 or Image paths (use LONGTEXT for base64 flexibility)
    @Column(columnDefinition = "LONGTEXT")
    private String profilePhoto;

    @Column(columnDefinition = "LONGTEXT")
    private String citizenshipDocument;

    @Column(columnDefinition = "LONGTEXT")
    private String storeLicense;
}