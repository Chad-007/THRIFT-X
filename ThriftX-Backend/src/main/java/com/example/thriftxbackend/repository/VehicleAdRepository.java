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
    @Query("SELECT v FROM VehicleAd v WHERE " +
           "(:search IS NULL OR LOWER(v.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(v.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(v.year) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:category IS NULL OR v.category = :category) " +
           "AND (:location IS NULL OR LOWER(v.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:minPrice IS NULL OR v.price  >= :minPrice) " +
           "AND (:maxPrice IS NULL OR v.price  <= :maxPrice)")
    Page<VehicleAd> searchVehicles(
        @Param("search") String search,   
        @Param("category") String category,
        @Param("location") String location,
        @Param("minPrice") Integer minPrice,
        @Param("maxPrice") Integer maxPrice,
        Pageable pageable);

}