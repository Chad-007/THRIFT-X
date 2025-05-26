package com.example.thriftxbackend.service;

import com.example.thriftxbackend.dto.MessageDTO;
import com.example.thriftxbackend.entity.Message;
import com.example.thriftxbackend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

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
}
