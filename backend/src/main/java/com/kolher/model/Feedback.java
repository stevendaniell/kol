package com.kolher.model;
import jakarta.persistence.*;
@Entity @Table(name="FEEDBACK")
public class Feedback {
    @Id @GeneratedValue private Long id;
    private Long sessionId, studentId;
    private Integer rating; private String comments;
    public Feedback(){} 
    public Long getId(){return id;} public void setId(Long i){id=i;}
    public Long getSessionId(){return sessionId;} public void setSessionId(Long s){sessionId=s;}
    public Long getStudentId(){return studentId;} public void setStudentId(Long s){studentId=s;}
    public Integer getRating(){return rating;} public void setRating(Integer r){rating=r;}
    public String getComments(){return comments;} public void setComments(String c){comments=c;}
}