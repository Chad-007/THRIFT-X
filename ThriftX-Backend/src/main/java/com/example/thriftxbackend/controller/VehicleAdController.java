package com.example.thriftxbackend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.thriftxbackend.dto.VehicleAdDTO;
import com.example.thriftxbackend.entity.VehicleAd;
import com.example.thriftxbackend.service.VehicleAdService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VehicleAdController {
    
    private final VehicleAdService vehicleAdService;
    public VehicleAdController(VehicleAdService vehicleAdService) {
        this.vehicleAdService = vehicleAdService;
    }
    @PostMapping("/ads/post")
    public String postAd(@RequestBody VehicleAdDTO dto){
        vehicleAdService.saveAd(dto);
        return "Ad posted successfully";
    }
    @GetMapping("/ads")
    public Page<VehicleAd> getAds(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) Integer minPrice,
        @RequestParam(required = false) Integer maxPrice,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return vehicleAdService.searchAds(search, category, location, minPrice, maxPrice, page, size);
    }
    
}