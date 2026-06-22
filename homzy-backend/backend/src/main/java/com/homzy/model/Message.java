package com.homzy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "sent_at")
    private LocalDateTime sentAt = LocalDateTime.now();

    public Message() {}

    public Long getId()              { return id; }
    public Job getJob()              { return job; }
    public User getSender()          { return sender; }
    public String getContent()       { return content; }
    public LocalDateTime getSentAt() { return sentAt; }

    public void setId(Long id)             { this.id = id; }
    public void setJob(Job job)            { this.job = job; }
    public void setSender(User sender)     { this.sender = sender; }
    public void setContent(String content) { this.content = content; }
    public void setSentAt(LocalDateTime t) { this.sentAt = t; }
}
