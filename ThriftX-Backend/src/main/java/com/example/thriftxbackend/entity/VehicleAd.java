    package com.example.thriftxbackend.entity;

    import jakarta.persistence.*;

    @Entity
    public class VehicleAd {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private  String title;
        private Integer price;
        private String description;
        private String location;
        private String category;
        private String imageUrl;
        private String mileage;
        private String year;
        private String username;
        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;
        public Long getId() {
            return id;
        }
        public void setId(Long id) {
            this.id = id;
        }
        public User getUser() {
            return user;
        }
        public void setUser(User user) {
            this.user = user;
        }

        public String getUsername() {
            return username;
        }
        public void setUsername(String username) {
            this.username = username;
            System.out.println("Setting the username: " + username);
        }
        public String getTitle() {
            return title;
        }
        public void setTitle(String title) {
            this.title = title;
        }
        public Integer getPrice() {
            return price;
        }
        public void setPrice(Integer price) {
            this.price = price;
        }
        public String getDescription() {
            return description;
        }
        public void setDescription(String description) {
            this.description = description;
        }
        public String getLocation() {
            return location;
        }
        public void setLocation(String location) {
            this.location = location;
        }
        public String getCategory() {
            return category;
        }
        public void setCategory(String category) {
            this.category = category;
        }
        public String getMileage() {
            return mileage;
        }
        public void setMileage(String mileage) {
            this.mileage = mileage;
        }
        public String getYear() {
            return year;
        }
        public void setYear(String year) {
            this.year = year;
            System.out.println("Year set to: " + year);
        }    
        public String getImageUrl() {
            return imageUrl;
        }
        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            System.out.println("Image URL set to: " + imageUrl);
        }
    }
