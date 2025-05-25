package com.example.thriftxbackend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.thriftxbackend.dto.VehicleAdDTO;
import com.example.thriftxbackend.service.VehicleAdService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/")
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
}