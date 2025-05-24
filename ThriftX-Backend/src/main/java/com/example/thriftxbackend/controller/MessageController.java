package com.example.thriftxbackend.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.thriftxbackend.dto.UserDetails;
import com.example.thriftxbackend.service.UserService;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MessageController {
    private final UserService userService;
    
    public MessageController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/signup")
    public String receivemessage(@RequestBody UserDetails userDetails){
        userService.saveuser(userDetails);
        return "User registered successfully";
    }
    @PostMapping("/login")
    public ResponseEntity<String>login(@RequestBody UserDetails userDetails){
        boolean authenticated = userService.authenticateUser(userDetails.getusername(), userDetails.getpassword());
        if (authenticated){
            return ResponseEntity.ok("Login successful");
        }
        else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}

