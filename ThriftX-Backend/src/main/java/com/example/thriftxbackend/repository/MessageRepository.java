package com.example.thriftxbackend.repository;

import org.springframework.stereotype.Repository;

import com.example.thriftxbackend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
@Query("SELECT m FROM Message m WHERE ((m.senderid = :user1 AND m.receiverid = :user2) OR (m.senderid = :user2 AND m.receiverid = :user1)) AND m.adid = :adid ORDER BY m.id ASC")
List<Message> findAllMessagesBetweenUsers(String user1, String user2, String adid);@Query("SELECT m FROM Message m WHERE m.id IN (" +
       "SELECT MAX(m2.id) FROM Message m2 WHERE m2.senderid = :buyerId OR m2.receiverid = :buyerId " +
       "GROUP BY " +
       "CASE WHEN m2.senderid = :buyerId THEN m2.receiverid ELSE m2.senderid END, m2.adid" +
       ") ORDER BY m.id DESC")
List<Message> findLatestMessagesByBuyer(@Param("buyerId") String buyerId);

}