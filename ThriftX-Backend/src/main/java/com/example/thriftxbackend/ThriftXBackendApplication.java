package com.example.thriftxbackend;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ThriftXBackendApplication {

    private static final Logger log = LoggerFactory.getLogger(ThriftXBackendApplication.class);
    public static void main(String[] args) {
      SpringApplication.run(ThriftXBackendApplication.class, args);
      

    }
}