package com.kolher.controller;

import com.kolher.model.Message;
import com.kolher.repository.MessageRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageRepository mrep;

    public MessageController(MessageRepository mrep) {
        this.mrep = mrep;
    }

    @GetMapping
    public List<Message> list() {
        return mrep.findTop50ByOrderByCreatedAtAsc();
    }

    @PostMapping
    public Message send(@RequestBody Map<String, String> body) {
        Message m = new Message();
        m.setSenderId(Long.valueOf(body.getOrDefault("senderId", "0")));
        m.setSenderRole(body.getOrDefault("senderRole", "STUDENT"));
        m.setContent(body.getOrDefault("content", "").trim());
        m.setCreatedAt(LocalDateTime.now());
        if (m.getContent().isBlank()) {
            throw new RuntimeException("Message content required");
        }
        return mrep.save(m);
    }
}
