package com.dokoxpress.backend.repository;

import com.dokoxpress.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}