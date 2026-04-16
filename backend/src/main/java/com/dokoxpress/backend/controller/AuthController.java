package com.dokoxpress.backend.controller;

import com.dokoxpress.backend.config.JwtUtil;
import com.dokoxpress.backend.model.User;
import com.dokoxpress.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> payload) {
        String email = String.valueOf(payload.get("email"));
        String password = String.valueOf(payload.get("password"));
        String requestedRole = String.valueOf(payload.get("role"));

        if ("admin".equalsIgnoreCase(requestedRole)) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null && user.getPassword().equals(password) && "admin".equalsIgnoreCase(user.getRole())) {
                String jwt = jwtUtil.generateToken(userDetailsService.loadUserByUsername(user.getEmail()), "admin");
                return ResponseEntity.ok(buildMockedResponse(user, jwt));
            }
            return ResponseEntity.status(401).body("Invalid admin credentials");
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        User user = userRepository.findByEmail(email).orElseThrow();

        if (!user.getRole().equalsIgnoreCase(requestedRole)) {
            return ResponseEntity.status(401).body("Invalid role for this user");
        }

        String jwt = jwtUtil.generateToken(userDetails, user.getRole());

        return ResponseEntity.ok(buildMockedResponse(user, jwt));
    }

    @PostMapping("/signup/customer")
    public ResponseEntity<?> signupCustomer(@RequestBody Map<String, Object> payload) {
        return signup(payload, "user");
    }

    @PostMapping("/signup/vendor")
    public ResponseEntity<?> signupVendor(@RequestBody Map<String, Object> payload) {
        return signup(payload, "vendor");
    }

    @PostMapping("/signup/admin")
    public ResponseEntity<?> signupAdmin(@RequestBody Map<String, Object> payload) {
        User user = new User();
        user.setEmail(String.valueOf(payload.get("email")));
        user.setPassword(String.valueOf(payload.get("password")));
        user.setName(String.valueOf(payload.getOrDefault("fullName", "Admin")));
        user.setRole("admin");
        userRepository.save(user);

        return ResponseEntity.ok(buildMockedResponse(user, null));
    }
    
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, Object> payload) {
        String role = String.valueOf(payload.get("role"));
        String email = role + ".google@example.com";
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setPassword("google123");
            user.setName("Google " + role);
            user.setRole(role);
            userRepository.save(user);
        }
        String jwt = null;
        if (!"admin".equalsIgnoreCase(role)) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            jwt = jwtUtil.generateToken(userDetails, role);
        }
        return ResponseEntity.ok(buildMockedResponse(user, jwt));
    }

    private ResponseEntity<?> signup(Map<String, Object> payload, String role) {
        String email = String.valueOf(payload.get("email"));
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(String.valueOf(payload.get("password")));
        user.setName(String.valueOf(payload.getOrDefault("fullName", "User")));
        user.setRole(role);
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwt = jwtUtil.generateToken(userDetails, role);

        return ResponseEntity.ok(buildMockedResponse(user, jwt));
    }

    private Map<String, Object> buildMockedResponse(User user, String jwt) {
        Map<String, Object> session = new HashMap<>();
        if (jwt != null) session.put("token", jwt);
        session.put("userId", user.getId());
        session.put("role", user.getRole());
        
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("fullName", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("session", session);
        response.put("user", userMap);
        
        return response;
    }
}
