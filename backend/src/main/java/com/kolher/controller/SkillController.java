package com.kolher.controller;
import com.kolher.model.Skill;
import com.kolher.model.User;
import com.kolher.repository.SkillRepository;
import com.kolher.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/skills")
public class SkillController {
    private final SkillRepository srep; private final UserRepository urep;
    public SkillController(SkillRepository s, UserRepository u){ srep=s; urep=u; }
    @GetMapping("/search")
    public List<Map<String,Object>> search(@RequestParam String q) {
        return srep.findBySkillNameContainingIgnoreCase(q).stream().map(s->{
            User t = urep.findById(s.getTutorId()).orElse(null);
            return Map.of("id",s.getId(),"skill",s.getSkillName(),"tutorName",t!=null?t.getUsername():"Unknown","tutorRating",t!=null?t.getAvgRating():0,"tutorId",s.getTutorId());
        }).toList();
    }
}