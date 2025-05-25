package com.example.thriftxbackend.repository;


import com.example.thriftxbackend.entity.VehicleAd;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleAdRepository extends JpaRepository<VehicleAd, Long> {
    List<VehicleAd> findByUserUsername(String username);
    List<VehicleAd> findByCategory(String category);
    List<VehicleAd> findByLocation(String location);
    List<VehicleAd> findByYear(String year);
    List<VehicleAd> findByMileage(String mileage);
}