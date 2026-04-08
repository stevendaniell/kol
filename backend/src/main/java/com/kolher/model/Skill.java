package com.kolher.model;
import jakarta.persistence.*;
@Entity @Table(name="SKILLS")
public class Skill {
    @Id @GeneratedValue private Long id;
    private String skillName; private Long tutorId;
    public Skill(){} public Skill(String n, Long t) { skillName=n; tutorId=t; }
    public Long getId(){return id;} public void setId(Long i){id=i;}
    public String getSkillName(){return skillName;} public void setSkillName(String s){skillName=s;}
    public Long getTutorId(){return tutorId;} public void setTutorId(Long t){tutorId=t;}
}