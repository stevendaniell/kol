package com.kolher.controller;
import com.kolher.model.User;
import com.kolher.model.Skill;
import com.kolher.repository.UserRepository;
import com.kolher.repository.SkillRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/users")
public class UserController {
    private final UserRepository urep; private final SkillRepository srep;
    public UserController(UserRepository u, SkillRepository s){ urep=u; srep=s; }
    @PostMapping("/register")
    public User register(@RequestBody User u) {
        User saved = urep.save(u);
        String skills = Optional.ofNullable(u.getSkillsOffered()).orElse("");
        if("TUTOR".equals(u.getRole()) && !skills.isBlank())
            Arrays.stream(skills.split(",")).map(String::trim)
                  .forEach(sk -> srep.save(new Skill(sk, saved.getId())));
        return saved;
    }
    @PostMapping("/login")
    public Map<String,Object> login(@RequestBody Map<String,String> body) {
        return urep.findByUsername(body.get("username")).filter(u->u.getPassword().equals(body.get("password")))
            .map(u -> {
                Map<String, Object> result = new HashMap<>();
                result.put("userId", u.getId());
                result.put("role", u.getRole());
                return result;
            })
            .orElseThrow(()->new RuntimeException("Invalid"));
    }
    @GetMapping("/{id}") public User get(@PathVariable Long id) { return urep.findById(id).orElseThrow(); }
}