package com.dokoxpress.backend.controller;

import com.dokoxpress.backend.model.Rider;
import com.dokoxpress.backend.service.RiderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/riders")
public class RiderController {

    @Autowired
    private RiderService riderService;

    @PostMapping("/register/{userId}")
    public ResponseEntity<?> registerRider(@PathVariable Long userId, @RequestBody Rider rider) {
        try {
            Rider savedRider = riderService.registerRider(rider, userId);
            return ResponseEntity.ok(savedRider);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getRiderProfile(@PathVariable Long userId) {
        return riderService.getRiderProfile(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{riderId}/availability")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long riderId) {
        try {
            Rider rider = riderService.toggleAvailability(riderId);
            return ResponseEntity.ok(rider);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Rider> getAllRiders() {
        return riderService.getAllRiders();
    }
}
