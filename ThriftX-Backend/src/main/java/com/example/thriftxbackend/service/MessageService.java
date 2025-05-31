package com.example.thriftxbackend.service;

import com.example.thriftxbackend.dto.MessageDTO;
import com.example.thriftxbackend.entity.Message;
import com.example.thriftxbackend.entity.User;
import com.example.thriftxbackend.repository.MessageRepository;
import com.example.thriftxbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Message> getChatMessages(String user1, String user2, String adid) {
        return messageRepository.findAllMessagesBetweenUsers(user1, user2, adid);
    }    
    
    public Message saveMessage(MessageDTO dto) {
        Message message = new Message();
        message.setSenderid(dto.getSenderid());
        message.setReceiverid(dto.getReceiverid());
        message.setAdid(dto.getAdid());
        message.setContent(dto.getContent());
        return messageRepository.save(message);
    }
    
    public List<Map<String, Object>> getLatestConversations(String buyerId) {
        List<Message> messages = messageRepository.findLatestMessagesByBuyer(buyerId);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Message message : messages) {
            Map<String, Object> messageData = new HashMap<>();
            
            // Add all original message fields
            messageData.put("id", message.getId());
            messageData.put("senderid", message.getSenderid());
            messageData.put("receiverid", message.getReceiverid());
            messageData.put("adid", message.getAdid());
            messageData.put("content", message.getContent());
            
            // Determine the other user ID
            String otherUserId = message.getSenderid().equals(buyerId) 
                ? message.getReceiverid() 
                : message.getSenderid();
            
            // Get username from users table
            String username = getUsernameById(otherUserId);
            messageData.put("username", username);
            messageData.put("otherUserId", otherUserId);
            
            result.add(messageData);
        }
        
        return result;
    }
    
    private String getUsernameById(String userId) {
        try {
            Long userIdLong = Long.parseLong(userId);
            Optional<User> user = userRepository.findById(userIdLong);
            if (user.isPresent()) {
                return user.get().getUsername(); // Assuming User entity has getUsername() method
            } else {
                return "User " + userId; // Fallback if user not found
            }
        } catch (Exception e) {
            return "User " + userId; // Fallback on error
        }
    }
}