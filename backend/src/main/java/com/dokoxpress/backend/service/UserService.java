package com.dokoxpress.backend.service;

import com.dokoxpress.backend.model.User;
import com.dokoxpress.backend.repository.UserRepository;
import com.dokoxpress.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    public User saveUser(User user) {
        User saved = userRepository.save(user);
        if ("vendor".equalsIgnoreCase(saved.getRole())) {
            syncToVendorTable(saved);
        }
        return saved;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserWithMap(Long id, java.util.Map<String, Object> updates) {
        User existing = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("name")) existing.setName((String) updates.get("name"));
        if (updates.containsKey("phone")) existing.setPhone((String) updates.get("phone"));
        if (updates.containsKey("country")) existing.setCountry((String) updates.get("country"));
        if (updates.containsKey("state")) existing.setState((String) updates.get("state"));
        if (updates.containsKey("city")) existing.setCity((String) updates.get("city"));
        if (updates.containsKey("storeName")) existing.setStoreName((String) updates.get("storeName"));
        if (updates.containsKey("profilePhoto")) existing.setProfilePhoto((String) updates.get("profilePhoto"));
        if (updates.containsKey("citizenshipDocument")) existing.setCitizenshipDocument((String) updates.get("citizenshipDocument"));
        if (updates.containsKey("storeLicense")) existing.setStoreLicense((String) updates.get("storeLicense"));
        if (updates.containsKey("verificationStatus")) existing.setVerificationStatus((String) updates.get("verificationStatus"));

        User saved = userRepository.save(existing);
        if ("vendor".equalsIgnoreCase(saved.getRole())) {
            syncToVendorTable(saved);
        }
        return saved;
    }

    public User updateUser(Long id, User updates) {
        User existing = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updates.getName() != null) existing.setName(updates.getName());
        if (updates.getPhone() != null) existing.setPhone(updates.getPhone());
        if (updates.getCountry() != null) existing.setCountry(updates.getCountry());
        if (updates.getState() != null) existing.setState(updates.getState());
        if (updates.getCity() != null) existing.setCity(updates.getCity());
        
        if (updates.getStoreName() != null) existing.setStoreName(updates.getStoreName());
        
        if (updates.getProfilePhoto() != null) existing.setProfilePhoto(updates.getProfilePhoto());
        if (updates.getCitizenshipDocument() != null) existing.setCitizenshipDocument(updates.getCitizenshipDocument());
        if (updates.getStoreLicense() != null) existing.setStoreLicense(updates.getStoreLicense());
        
        if (updates.getVerificationStatus() != null) existing.setVerificationStatus(updates.getVerificationStatus());

        User saved = userRepository.save(existing);
        if ("vendor".equalsIgnoreCase(saved.getRole())) {
            syncToVendorTable(saved);
        }
        return saved;
    }

    private void syncToVendorTable(User user) {
        com.dokoxpress.backend.model.Vendor vendor = vendorRepository.findByUserId(user.getId())
                .orElse(new com.dokoxpress.backend.model.Vendor());
        
        vendor.setUserId(user.getId());
        vendor.setShopName(user.getStoreName());
        vendor.setLocation((user.getCity() != null ? user.getCity() : "") + ", " + (user.getState() != null ? user.getState() : ""));
        vendor.setCitizenshipDocument(user.getCitizenshipDocument());
        vendor.setStoreLicense(user.getStoreLicense());
        
        vendorRepository.save(vendor);
    }
}