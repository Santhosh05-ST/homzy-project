package com.homzy.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private Worker worker;

    private String imageUrl;
    
    public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	@Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal budget;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;

    @Column(length = 255)
    private String location;

    @Column(name = "job_date")
    private LocalDate jobDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public enum Category {
        PLUMBING, PAINTING, CLEANING, ELECTRICAL,
        CARPENTRY, AC_SERVICE, GARDENING, TILING, OTHER
    }

    public enum Status {
        OPEN, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED
    }

    public Job() {}

    public Long getId()                { return id; }
    public User getClient()            { return client; }
    public Worker getWorker()          { return worker; }
    public String getTitle()           { return title; }
    public Category getCategory()      { return category; }
    public String getDescription()     { return description; }
    public BigDecimal getBudget()      { return budget; }
    public Status getStatus()          { return status; }
    public String getLocation()        { return location; }
    public LocalDate getJobDate()      { return jobDate; }
    public LocalDateTime getCreatedAt(){ return createdAt; }
    public LocalDateTime getUpdatedAt(){ return updatedAt; }

    public void setId(Long id)                 { this.id = id; }
    public void setClient(User client)         { this.client = client; }
    public void setWorker(Worker worker)       { this.worker = worker; }
    public void setTitle(String title)         { this.title = title; }
    public void setCategory(Category category) { this.category = category; }
    public void setDescription(String d)       { this.description = d; }
    public void setBudget(BigDecimal budget)   { this.budget = budget; }
    public void setStatus(Status status)       { this.status = status; }
    public void setLocation(String location)   { this.location = location; }
    public void setJobDate(LocalDate jobDate)  { this.jobDate = jobDate; }
    public void setCreatedAt(LocalDateTime t)  { this.createdAt = t; }
    public void setUpdatedAt(LocalDateTime t)  { this.updatedAt = t; }
}
