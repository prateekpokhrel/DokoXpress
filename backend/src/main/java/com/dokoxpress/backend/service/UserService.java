package com.dokoxpress.backend.service;

import com.dokoxpress.backend.model.User;
import com.dokoxpress.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
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
        
        return userRepository.save(existing);
    }
}