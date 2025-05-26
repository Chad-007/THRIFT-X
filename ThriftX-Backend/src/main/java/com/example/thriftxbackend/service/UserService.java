    package com.example.thriftxbackend.service;


    import org.springframework.stereotype.*;

    import com.example.thriftxbackend.dto.UserDetails;
    import com.example.thriftxbackend.repository.UserRepository;
    import com.example.thriftxbackend.entity.User;
    @Service
    public class UserService {

        private final UserRepository userRepository;
        public UserService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }
        public void  saveuser(UserDetails userDetails){
            User user  = new User();
            user.setUsername(userDetails.getusername());
            user.setEmail(userDetails.getemail());
            user.setPassword(userDetails.getpassword());
            userRepository.save(user);
        } 
        public boolean authenticateUser(String username, String password) {
            return userRepository.findByUsername(username)
                    .map(user -> user.getPassword().equals(password))
                    .orElse(false);
        }
        public User getUserByUsername(String username) {
            return userRepository.findByUsername(username)
                    .orElse(null);  
        }
    }
