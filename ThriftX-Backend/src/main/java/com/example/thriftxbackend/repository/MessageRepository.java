package com.example.thriftxbackend.repository;

import org.springframework.stereotype.Repository;

import com.example.thriftxbackend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message>  findBySenderidAndReceiveridAndAdidOrderByIdAsc(String senderid,String receiverid, String adid);
    List<Message> findByReceiveridAndSenderidAndAdidOrderByIdAsc(String receiverid,String senderid, String adid);
    
}