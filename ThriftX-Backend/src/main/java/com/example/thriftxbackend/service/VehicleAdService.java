package com.example.thriftxbackend.service;

import java.util.Base64;
import java.util.stream.Collectors;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.Files;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.thriftxbackend.dto.VehicleAdResponseDTO;
import com.example.thriftxbackend.entity.User;
import com.example.thriftxbackend.entity.VehicleAd;
import com.example.thriftxbackend.repository.UserRepository;
import com.example.thriftxbackend.repository.VehicleAdRepository;
import java.util.List;
import org.springframework.data.domain.Page;

@Service
public class VehicleAdService {
    private final VehicleAdRepository vehicleAdRepository;
    private final UserRepository userRepository;

    public VehicleAdService(VehicleAdRepository vehicleAdRepository, UserRepository userRepository) {
        this.vehicleAdRepository = vehicleAdRepository;
        this.userRepository = userRepository;
    }

    public void saveAd(VehicleAdResponseDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        
        VehicleAd ad = new VehicleAd();
        ad.setUser(user);
        ad.setUsername(dto.getUsername());
        ad.setTitle(dto.getTitle());
        ad.setPrice(dto.getPrice());
        ad.setCategory(dto.getCategory());
        ad.setLocation(dto.getLocation());
        ad.setYear(dto.getYear());
        ad.setMileage(dto.getMileage());
        ad.setDescription(dto.getDescription());
        ad.setImageUrl(dto.getImageUrl());
        System.out.println("Saving ad: " + ad.getTitle() + " for user: " + user.getUsername()+ "with the image url as "+ad.getImageUrl());
        vehicleAdRepository.save(ad);
    }
    public Page<VehicleAdResponseDTO> getAllAds(int page, int size) {
        Page<VehicleAd> vehicleAds = vehicleAdRepository.findAll(PageRequest.of(page, size));
        return vehicleAds.map(VehicleAdResponseDTO::new);
        

    }
    
    public Page<VehicleAdResponseDTO> searchAds(
    String search, String category, String location,
    Integer minPrice, Integer maxPrice, int page, int size) {

    search = (search == null || search.trim().isEmpty()) ? null : search.trim();
    category = (category == null || category.trim().isEmpty()) ? null : category.trim();
    location = (location == null || location.trim().isEmpty()) ? null : location.trim();

    boolean noFilters = (search == null && category == null && location == null && minPrice == null && maxPrice == null);

    Page<VehicleAd> vehicleAds;

    if (noFilters) {
        vehicleAds = vehicleAdRepository.findAll(PageRequest.of(page, size));
    } else {
        vehicleAds = vehicleAdRepository.searchVehicles(
            search, category, location, minPrice, maxPrice, PageRequest.of(page, size)
        );
    }

    return vehicleAds.map(VehicleAdResponseDTO::new);
}
public List<VehicleAdResponseDTO> getAdsByUserId(Long user_id) {
    return vehicleAdRepository.findByUserId(user_id)
            .stream()
            .map(VehicleAdResponseDTO::new)
            .collect(Collectors.toList());
}

}
