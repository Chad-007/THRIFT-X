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
        List<Message> list1 = messageRepository.findBySenderidAndReceiveridAndAdidOrderByIdAsc(user1, user2, adid);
        List<Message> list2 = messageRepository.findByReceiveridAndSenderidAndAdidOrderByIdAsc(user1, user2, adid);
        List<Message> fullChat = new ArrayList<>();
        fullChat.addAll(list1);
        fullChat.addAll(list2);
        fullChat.sort((m1, m2) -> m1.getId().compareTo(m2.getId()));
        return fullChat;
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
