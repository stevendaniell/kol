package com.kolher.controller;
import com.kolher.model.Feedback;
import com.kolher.model.Session;
import com.kolher.model.User;
import com.kolher.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/feedback")
public class FeedbackController {
    private final FeedbackRepository frep; private final SessionRepository srep; private final UserRepository urep;
    public FeedbackController(FeedbackRepository f, SessionRepository s, UserRepository u){ frep=f; srep=s; urep=u; }
    @PostMapping("/submit")
    public Map<String,String> submit(@RequestBody Feedback fb) {
        frep.save(fb);
        Session sess = srep.findById(fb.getSessionId()).orElseThrow();
        User tutor = urep.findById(sess.getTutorId()).orElseThrow();
        tutor.setTotalRatings(tutor.getTotalRatings()+1);
        tutor.setAvgRating(((tutor.getAvgRating()*(tutor.getTotalRatings()-1)) + fb.getRating())/tutor.getTotalRatings());
        urep.save(tutor);
        return Map.of("status","ok");
    }
}