package com.dokoxpress.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vendors")
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true)
    private Long userId;

    @Column(name = "shop_name")
    private String shopName;

    private String location; // City, State
    
    // Citizenship & License links (keeping simple pointers/summaries for the mirrored table)
    @Column(columnDefinition = "LONGTEXT")
    private String citizenshipDocument;

    @Column(columnDefinition = "LONGTEXT")
    private String storeLicense;
}
