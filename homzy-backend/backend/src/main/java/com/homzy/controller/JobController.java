package com.homzy.controller;

import com.homzy.dto.JobRequest;
import com.homzy.dto.JobResponse;
import com.homzy.service.JobService;


import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/create")
    public ResponseEntity<JobResponse> create(@RequestBody JobRequest req, Authentication auth) {
        return ResponseEntity.ok(jobService.create(req, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllOpen() {
        return ResponseEntity.ok(jobService.getAllOpen());
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobResponse>> myJobs(Authentication auth) {
        return ResponseEntity.ok(jobService.getMyJobs(auth.getName()));
    }
    @GetMapping("/worker-jobs")
    public ResponseEntity<List<JobResponse>> workerJobs(Authentication auth) {
        return ResponseEntity.ok(jobService.getWorkerJobs(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<JobResponse> updateStatus(@PathVariable Long id,
                                                     @RequestParam String status,
                                                     Authentication auth) {
        return ResponseEntity.ok(jobService.updateStatus(id, status, auth.getName()));
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id, Authentication auth) {
        jobService.cancel(id, auth.getName());
        return ResponseEntity.ok().build();
    }
    @GetMapping("/filter")
    public ResponseEntity<List<JobResponse>> filterJobs(@RequestParam String category) {
        return ResponseEntity.ok(jobService.getOpenJobsByCategory(category));
    }
    
    @PostMapping("/create-with-image")
    public ResponseEntity<JobResponse> createJobWithImage(
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal budget,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobDate,
            @RequestParam(required = false) MultipartFile image,
            Authentication auth
    ) throws IOException {

        return ResponseEntity.ok(
                jobService.createJobWithImage(
                        title,
                        category,
                        description,
                        budget,
                        location,
                        jobDate,
                        image,
                        auth.getName()
                )
        );
    }
}
