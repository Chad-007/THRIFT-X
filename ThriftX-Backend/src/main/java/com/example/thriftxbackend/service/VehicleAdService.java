package com.example.thriftxbackend.service;

import java.util.Base64;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.Files;
import org.springframework.stereotype.Service;
import com.example.thriftxbackend.dto.VehicleAdDTO;
import com.example.thriftxbackend.entity.User;
import com.example.thriftxbackend.entity.VehicleAd;
import com.example.thriftxbackend.repository.UserRepository;
import com.example.thriftxbackend.repository.VehicleAdRepository;

@Service
public class VehicleAdService {
    private final VehicleAdRepository vehicleAdRepository;
    private final UserRepository userRepository;

    public VehicleAdService(VehicleAdRepository vehicleAdRepository, UserRepository userRepository) {
        this.vehicleAdRepository = vehicleAdRepository;
        this.userRepository = userRepository;
    }
public void saveAd(VehicleAdDTO dto) {
    User user  = userRepository.findByUsername(dto.getUsername())
                  .orElseThrow(() -> new RuntimeException("User not found"));
    VehicleAd ad = new VehicleAd();
    ad.setUser(user);
    ad.setTitle(dto.getTitle());
    ad.setPrice(dto.getPrice());
    ad.setCategory(dto.getCategory());
    ad.setLocation(dto.getLocation());
    ad.setYear(dto.getYear());
    ad.setMileage(dto.getMileage());
    ad.setDescription(dto.getDescription());

    if(dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
        try {
            String base64Image = dto.getImageUrl();
            if (base64Image.contains(",")) {
                base64Image = base64Image.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            String filename = "vehicle_" + System.currentTimeMillis() + ".jpg";

            java.nio.file.Path path = Paths.get("uploads/" + filename);

            Files.createDirectories(path.getParent());

            try (FileOutputStream fos = new FileOutputStream(path.toFile())) {
                fos.write(imageBytes);
            }

            ad.setImageUrl("/uploads/" + filename);

        } catch (IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }
    } else {
        ad.setImageUrl(null);
    }

    vehicleAdRepository.save(ad);
}
}