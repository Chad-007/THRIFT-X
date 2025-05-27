package com.example.thriftxbackend.dto;

import com.example.thriftxbackend.entity.VehicleAd;

public class VehicleAdResponseDTO {
    private Long id;
    private String username;
    private Long userId;    
    private String title;
    private Integer price;
    private String category;
    private String location;
    private String year;
    private String mileage;
    private String description;
    private String imageUrl;

    public VehicleAdResponseDTO() {
    }
    public VehicleAdResponseDTO(VehicleAd vehicleAd) {
        this.id = vehicleAd.getId();
        this.username = vehicleAd.getUsername() != null ? vehicleAd.getUsername()
                          : (vehicleAd.getUser() != null ? vehicleAd.getUser().getUsername() : null);
        this.userId = vehicleAd.getUser() != null ? vehicleAd.getUser().getId() : null;
        this.title = vehicleAd.getTitle();
        this.price = vehicleAd.getPrice();
        this.category = vehicleAd.getCategory();
        this.location = vehicleAd.getLocation();
        this.year = vehicleAd.getYear();
        this.mileage = vehicleAd.getMileage();
        this.description = vehicleAd.getDescription();
        this.imageUrl = vehicleAd.getImageUrl();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; 
        System.out.println("Setting the username: " + username);
       }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; 
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getMileage() { return mileage; }
    public void setMileage(String mileage) { this.mileage = mileage; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
