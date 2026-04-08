package com.kolher.model;
import jakarta.persistence.*;
@Entity @Table(name="USERS")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String username, password, role;
    private Double avgRating=0.0; private Integer totalRatings=0;
    private String skillsOffered="";
    public User(){} public User(String u, String p, String r, String s) { username=u; password=p; role=r; skillsOffered=s; }
    public Long getId(){return id;} public void setId(Long i){id=i;}
    public String getUsername(){return username;} public void setUsername(String u){username=u;}
    public String getPassword(){return password;} public void setPassword(String p){password=p;}
    public String getRole(){return role;} public void setRole(String r){role=r;}
    public Double getAvgRating(){return avgRating;} public void setAvgRating(Double a){avgRating=a;}
    public Integer getTotalRatings(){return totalRatings;} public void setTotalRatings(Integer t){totalRatings=t;}
    public String getSkillsOffered(){return skillsOffered;} public void setSkillsOffered(String s){skillsOffered=s;}
}