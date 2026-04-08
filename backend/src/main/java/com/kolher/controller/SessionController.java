cleapackage com.kolher.controller;
import com.kolher.model.Session;
import com.kolher.repository.SessionRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/sessions")
public class SessionController {
    private final SessionRepository srep;
    public SessionController(SessionRepository s){ srep=s; }
    @PostMapping("/book")
    public Session book(@RequestBody Session s) {
        s.setStatus("PENDING");
        s.setMeetingLink("https://meet.kolher.io/" + UUID.randomUUID());
        return srep.save(s);
    }
    @PutMapping("/{id}/status")
    public Session status(@PathVariable Long id, @RequestBody Map<String,String> body) {
        Session s = srep.findById(id).orElseThrow();
        s.setStatus(body.get("status"));
        return srep.save(s);
    }
    @GetMapping("/user/{uid}")
    public List<Session> getUser(@PathVariable Long uid) { return srep.findByStudentIdOrTutorId(uid, uid); }
}