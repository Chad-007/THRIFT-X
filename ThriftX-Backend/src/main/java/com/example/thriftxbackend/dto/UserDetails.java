package com.example.thriftxbackend.dto;

public class UserDetails {
    public String username;
    public String email;
    public String password;
    public String getusername(){
        return username;
    }
    public void setusername(String username){
        this.username = username;
    }
    public String getemail(){
        return email;
    }
    public void setemail(String email){
        this.email = email;
    }
    public String getpassword(){
        return password;
    }
    public void setpassword(String password){
        this.password = password;
    }

}
