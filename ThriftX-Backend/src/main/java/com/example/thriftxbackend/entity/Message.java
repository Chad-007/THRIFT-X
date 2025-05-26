package com.example.thriftxbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private String senderid;
    private String receiverid;
    private String adid;
    private String content;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getSenderid() {
        return senderid;
    }
    public void setSenderid(String senderid) {
        this.senderid = senderid;
    }
    public String getReceiverid() {
        return receiverid;
    }
    public void setReceiverid(String receiverid) {
        this.receiverid = receiverid;
    }
    public String getAdid() {
        return adid;
    }
    public void setAdid(String adid) {
        this.adid = adid;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }    
}
