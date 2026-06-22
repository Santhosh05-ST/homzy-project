package com.homzy.dto;

import com.homzy.model.Job;
import java.math.BigDecimal;
import java.time.LocalDate;

public class JobRequest {
    private String title;
    private String category;
    private String description;
    private BigDecimal budget;
    private String location;
    private LocalDate jobDate;

    public String getTitle()       { return title; }
    public String getCategory()    { return category; }
    public String getDescription() { return description; }
    public BigDecimal getBudget()  { return budget; }
    public String getLocation()    { return location; }
    public LocalDate getJobDate()  { return jobDate; }

    public void setTitle(String t)         { this.title = t; }
    public void setCategory(String c)      { this.category = c; }
    public void setDescription(String d)   { this.description = d; }
    public void setBudget(BigDecimal b)    { this.budget = b; }
    public void setLocation(String l)      { this.location = l; }
    public void setJobDate(LocalDate d)    { this.jobDate = d; }

    public Job.Category getCategoryEnum() {
        try { return Job.Category.valueOf(category.toUpperCase()); }
        catch (Exception e) { return Job.Category.OTHER; }
    }
}
