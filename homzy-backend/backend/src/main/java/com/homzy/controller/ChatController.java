	package com.homzy.controller;

import com.homzy.dto.MessageRequest;
import com.homzy.model.Job;
import com.homzy.model.Message;
import com.homzy.model.User;
import com.homzy.repository.JobRepository;
import com.homzy.repository.MessageRepository;
import com.homzy.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final MessageRepository msgRepo;
    private final JobRepository jobRepo;
    private final UserRepository userRepo;

    public ChatController(MessageRepository msgRepo, JobRepository jobRepo,
                          UserRepository userRepo) {
        this.msgRepo  = msgRepo;
        this.jobRepo  = jobRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/{jobId}/messages")
    public ResponseEntity<List<Map<String, Object>>> getMessages(@PathVariable Long jobId) {
        List<Message> list = msgRepo.findByJobIdOrderBySentAtAsc(jobId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Message m : list) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id",       m.getId());
            map.put("sender",   m.getSender().getName());
            map.put("senderId", m.getSender().getId());
            map.put("content",  m.getContent());
            map.put("sentAt",   m.getSentAt());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(@RequestBody MessageRequest req,
                                                     Authentication auth) {
        Job job = jobRepo.findById(req.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        User sender = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message msg = new Message();
        msg.setJob(job);
        msg.setSender(sender);
        msg.setContent(req.getContent());
        msgRepo.save(msg);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("sender",  sender.getName());
        res.put("content", req.getContent());
        res.put("sentAt",  msg.getSentAt());
        return ResponseEntity.ok(res);
    }
}
