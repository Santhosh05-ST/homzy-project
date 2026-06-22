package com.homzy.dto;

import com.homzy.model.Job;
import java.math.BigDecimal;
import java.time.LocalDate;

public class JobResponse {
    private Long id;
    private String title;
    private String category;
    private String description;
    private BigDecimal budget;
    private String status;
    private String location;
    private LocalDate jobDate;
    private String clientName;
    private String workerName;
    public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	private String imageUrl;

    public static JobResponse from(Job job) {
        JobResponse r = new JobResponse();
        r.id          = job.getId();
        r.title       = job.getTitle();
        r.category    = job.getCategory() != null ? job.getCategory().name() : null;
        r.description = job.getDescription();
        r.budget      = job.getBudget();
        r.status      = job.getStatus() != null ? job.getStatus().name() : null;
        r.location    = job.getLocation();
        r.jobDate     = job.getJobDate();
        r.clientName  = job.getClient() != null ? job.getClient().getName() : null;
        r.workerName  = (job.getWorker() != null && job.getWorker().getUser() != null)
                        ? job.getWorker().getUser().getName() : null;
        r.setImageUrl(job.getImageUrl());
        return r;
    }

    public Long getId()           { return id; }
    public String getTitle()      { return title; }
    public String getCategory()   { return category; }
    public String getDescription(){ return description; }
    public BigDecimal getBudget() { return budget; }
    public String getStatus()     { return status; }
    public String getLocation()   { return location; }
    public LocalDate getJobDate() { return jobDate; }
    public String getClientName() { return clientName; }
    public String getWorkerName() { return workerName; }
}
