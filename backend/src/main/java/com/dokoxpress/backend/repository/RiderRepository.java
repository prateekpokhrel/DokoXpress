package com.dokoxpress.backend.repository;

import com.dokoxpress.backend.model.Rider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiderRepository extends JpaRepository<Rider, Long> {
    Optional<Rider> findByUserId(Long userId);
    List<Rider> findByCityAndAvailableTrue(String city);
}
