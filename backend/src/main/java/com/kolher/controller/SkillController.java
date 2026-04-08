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

    private Map<String, Object> toSkillMap(Skill s) {
        User t = urep.findById(s.getTutorId()).orElse(null);
        Map<String, Object> result = new HashMap<>();
        result.put("id", s.getId());
        result.put("skill", s.getSkillName());
        result.put("tutorName", t != null ? t.getUsername() : "Demo Tutor");
        result.put("tutorRating", t != null ? t.getAvgRating() : 4.8);
        result.put("tutorId", s.getTutorId());
        return result;
    }

    @GetMapping("/all")
    public List<Map<String,Object>> all() {
        List<Skill> saved = srep.findAll();
        if (saved.isEmpty()) {
            List<Map<String, Object>> demo = new ArrayList<>();
            demo.add(new HashMap<>(Map.of("id", -1, "skill", "Java Fundamentals", "tutorName", "Demo Tutor 1", "tutorRating", 4.9, "tutorId", 0)));
            demo.add(new HashMap<>(Map.of("id", -2, "skill", "Web Development Basics", "tutorName", "Demo Tutor 2", "tutorRating", 4.7, "tutorId", 0)));
            demo.add(new HashMap<>(Map.of("id", -3, "skill", "Data Structures", "tutorName", "Demo Tutor 3", "tutorRating", 4.8, "tutorId", 0)));
            return demo;
        }
        return saved.stream().map(this::toSkillMap).toList();
    }

    @GetMapping("/search")
    public List<Map<String,Object>> search(@RequestParam String q) {
        return srep.findBySkillNameContainingIgnoreCase(q).stream().map(this::toSkillMap).toList();
    }

    @GetMapping("/tutor/{tutorId}")
    public List<Skill> tutorCourses(@PathVariable Long tutorId) {
        return srep.findByTutorId(tutorId);
    }

    @PostMapping("/create")
    public Skill create(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("skillName", "").trim();
        Long tutorId = Long.valueOf(body.getOrDefault("tutorId", "0"));
        if (name.isBlank() || tutorId <= 0) {
            throw new RuntimeException("skillName and tutorId are required");
        }
        return srep.save(new Skill(name, tutorId));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @RequestParam Long tutorId) {
        Skill s = srep.findById(id).orElseThrow();
        if (!Objects.equals(s.getTutorId(), tutorId)) {
            throw new RuntimeException("Cannot delete another tutor's course");
        }
        srep.deleteById(id);
    }
}