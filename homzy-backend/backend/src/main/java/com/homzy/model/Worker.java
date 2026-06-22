package com.homzy.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "workers")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String skills;
    private Integer experience = 0;
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "total_jobs")
    private Integer totalJobs = 0;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    private String location;

    public Worker() {}

    public Long getId()             { return id; }
    public User getUser()           { return user; }
    public String getSkills()       { return skills; }
    public Integer getExperience()  { return experience; }
    public BigDecimal getRating()   { return rating; }
    public Integer getTotalJobs()   { return totalJobs; }
    public Boolean getIsAvailable() { return isAvailable; }
    public String getLocation()     { return location; }

    public void setId(Long id)               { this.id = id; }
    public void setUser(User user)           { this.user = user; }
    public void setSkills(String s)          { this.skills = s; }
    public void setExperience(Integer e)     { this.experience = e; }
    public void setRating(BigDecimal r)      { this.rating = r; }
    public void setTotalJobs(Integer t)      { this.totalJobs = t; }
    public void setIsAvailable(Boolean b)    { this.isAvailable = b; }
    public void setLocation(String l)        { this.location = l; }
}
