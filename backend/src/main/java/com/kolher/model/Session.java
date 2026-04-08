package com.kolher.model;
import jakarta.persistence.*;
@Entity @Table(name="SESSIONS")
public class Session {
    @Id @GeneratedValue private Long id;
    private Long studentId, tutorId;
    private String dateTime, status, meetingLink;
    public Session(){} 
    public Long getId(){return id;} public void setId(Long i){id=i;}
    public Long getStudentId(){return studentId;} public void setStudentId(Long s){studentId=s;}
    public Long getTutorId(){return tutorId;} public void setTutorId(Long t){tutorId=t;}
    public String getDateTime(){return dateTime;} public void setDateTime(String d){dateTime=d;}
    public String getStatus(){return status;} public void setStatus(String s){status=s;}
    public String getMeetingLink(){return meetingLink;} public void setMeetingLink(String m){meetingLink=m;}
}