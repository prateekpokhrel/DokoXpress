package com.dokoxpress.backend.service;

import com.dokoxpress.backend.model.Rider;
import com.dokoxpress.backend.model.User;
import com.dokoxpress.backend.repository.RiderRepository;
import com.dokoxpress.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RiderService {

    @Autowired
    private RiderRepository riderRepository;

    @Autowired
    private UserRepository userRepository;

    public Rider registerRider(Rider rider, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole("rider");
        userRepository.save(user);
        
        rider.setUser(user);
        return riderRepository.save(rider);
    }

    public Optional<Rider> getRiderProfile(Long userId) {
        return riderRepository.findByUserId(userId);
    }

    public List<Rider> findAvailableRidersInCity(String city) {
        return riderRepository.findByCityAndAvailableTrue(city);
    }

    public Rider toggleAvailability(Long riderId) {
        Rider rider = riderRepository.findById(riderId).orElseThrow(() -> new RuntimeException("Rider not found"));
        rider.setAvailable(!rider.isAvailable());
        return riderRepository.save(rider);
    }
    
    public List<Rider> getAllRiders() {
        return riderRepository.findAll();
    }
}
