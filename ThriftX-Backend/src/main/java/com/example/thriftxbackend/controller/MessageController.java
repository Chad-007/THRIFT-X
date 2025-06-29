package com.example.thriftxbackend.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.thriftxbackend.dto.UserDetails;
import com.example.thriftxbackend.service.UserService;
import java.util.HashMap;
import java.util.Map;
import com.example.thriftxbackend.entity.User;
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
    @GetMapping("/users/{username}")
public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
    User user = userService.getUserByUsername(username);
    if (user != null) {
        return ResponseEntity.ok(user);
    } else {
        return ResponseEntity.notFound().build();
    }
}

    @PostMapping("/login")
public ResponseEntity<Map<String, String>> login(@RequestBody UserDetails userDetails) {
    boolean authenticated = userService.authenticateUser(userDetails.getusername(), userDetails.getpassword());
    if (authenticated) {
        User user = userService.getUserByUsername(userDetails.getusername());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("id", String.valueOf(user.getId()));
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    } else {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Invalid username or password");
        return ResponseEntity.status(401).body(response);
    }
}

}

