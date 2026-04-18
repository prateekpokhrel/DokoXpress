package com.dokoxpress.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "riders")
public class Rider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String vehicleNumber;
    private int age;
    
    // Address fields (redundant with User but useful for specific rider targeting)
    private String country;
    private String district;
    private String city;

    @Column(columnDefinition = "LONGTEXT")
    private String drivingLicensePhoto;

    @Column(columnDefinition = "LONGTEXT")
    private String citizenshipPhoto;

    private boolean available = true;
    
    private String contact;
}
