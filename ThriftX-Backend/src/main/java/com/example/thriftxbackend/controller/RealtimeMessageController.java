package com.example.thriftxbackend.controller;

import com.example.thriftxbackend.dto.MessageDTO;
import com.example.thriftxbackend.entity.Message;
import com.example.thriftxbackend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/realtime-messages")
public class RealtimeMessageController {

    @Autowired
    private MessageService messageService;
    @GetMapping("/{user1}/{user2}/{adid}")
    public List<Message> getChatMessages(
            @PathVariable String user1,
            @PathVariable String user2,
            @PathVariable String adid) {
        return messageService.getChatMessages(user1, user2, adid);
    }

    @PostMapping
    public Message sendMessage(@RequestBody MessageDTO messageDTO) {
        return messageService.saveMessage(messageDTO);
    }
}
