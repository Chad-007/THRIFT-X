package com.example.thriftxbackend.repository;


import com.example.thriftxbackend.entity.VehicleAd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface VehicleAdRepository extends JpaRepository<VehicleAd, Long> {
    List<VehicleAd> findByUserUsername(String username);
    List<VehicleAd> findByCategory(String category);
    List<VehicleAd> findByLocation(String location);
    List<VehicleAd> findByYear(String year);
    List<VehicleAd> findByMileage(String mileage);
    List<VehicleAd> findByUserId(Long user_id);
    @Query(value = "SELECT * FROM vehicle_ad v WHERE " +
    "(:search IS NULL OR " +
    "LOWER(v.title) LIKE LOWER('%' || :search || '%') OR " +
    "LOWER(v.description) LIKE LOWER('%' || :search || '%') OR " +
    "v.year LIKE '%' || :search || '%') " +
    "AND (:category IS NULL OR LOWER(v.category) = LOWER(:category)) " +
    "AND (:location IS NULL OR LOWER(v.location) LIKE LOWER('%' || :location || '%')) " +
    "AND (:minPrice IS NULL OR v.price >= :minPrice) " +
    "AND (:maxPrice IS NULL OR v.price <= :maxPrice)",
    nativeQuery = true)
Page<VehicleAd> searchVehicles(
 @Param("search") String search,   
 @Param("category") String category,
 @Param("location") String location,
 @Param("minPrice") Integer minPrice,
 @Param("maxPrice") Integer maxPrice,
 Pageable pageable);
}