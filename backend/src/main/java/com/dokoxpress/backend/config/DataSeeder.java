package com.dokoxpress.backend.config;

import com.dokoxpress.backend.model.User;
import com.dokoxpress.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        String adminEmail = "admin.dokoxpress@gmail.com";

        // create admin if its not exist
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword("Inspiron@15");
            admin.setName("Master Admin");
            admin.setRole("admin");
            userRepository.save(admin);
            System.out.println(" Master Admin created!");
        }
    }
}