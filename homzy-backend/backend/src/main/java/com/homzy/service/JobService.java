package com.homzy.service;

import com.homzy.dto.JobRequest;
import com.homzy.dto.JobResponse;
import com.homzy.model.Job;
import com.homzy.model.User;
import com.homzy.model.Worker;
import com.homzy.repository.JobRepository;
import com.homzy.repository.UserRepository;
import com.homzy.repository.WorkerRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.math.BigDecimal;

@Service
public class JobService {

    private final JobRepository jobRepo;
    private final UserRepository userRepo;
    private final WorkerRepository workerRepo;
    private final EmailService emailService;  // ADDED

    public JobService(JobRepository jobRepo, UserRepository userRepo,
                      WorkerRepository workerRepo, EmailService emailService) {  // ADDED
        this.jobRepo       = jobRepo;
        this.userRepo      = userRepo;
        this.workerRepo    = workerRepo;
        this.emailService  = emailService;  // ADDED
    }

    public JobResponse create(JobRequest req, String email) {
        User client = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job job = new Job();
        job.setClient(client);
        job.setTitle(req.getTitle());
        job.setCategory(req.getCategoryEnum());
        job.setDescription(req.getDescription());
        job.setBudget(req.getBudget());
        job.setLocation(req.getLocation());
        job.setJobDate(req.getJobDate());
        job.setStatus(Job.Status.OPEN);
        Job saved = jobRepo.save(job);

        // ADDED: email to client confirming job posted
        emailService.sendJobPostedEmail(client.getEmail(), client.getName(), saved.getTitle());

        return JobResponse.from(saved);
    }

    public List<JobResponse> getAllOpen() {
        return jobRepo.findOpenJobs().stream()
                .map(JobResponse::from).collect(Collectors.toList());
    }

    public List<JobResponse> getMyJobs(String email) {
        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jobRepo.findByClientId(u.getId()).stream()
                .map(JobResponse::from).collect(Collectors.toList());
    }

    // NEW: get jobs accepted by this worker
    public List<JobResponse> getWorkerJobs(String email) {
        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Worker w = workerRepo.findByUserId(u.getId())
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
        return jobRepo.findByWorkerId(w.getId()).stream()
                .map(JobResponse::from).collect(Collectors.toList());
    }

    public JobResponse getById(Long id) {
        return JobResponse.from(jobRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found")));
    }

    public JobResponse updateStatus(Long id, String status, String email) {
        Job job = jobRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Job.Status newStatus = Job.Status.valueOf(status.toUpperCase());

        if (newStatus == Job.Status.ACCEPTED) {
            User workerUser = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Worker worker = workerRepo.findByUserId(workerUser.getId())
                    .orElseGet(() -> {
                        Worker w = new Worker();
                        w.setUser(workerUser);
                        w.setSkills("General");
                        w.setExperience(0);
                        w.setIsAvailable(true);
                        return workerRepo.save(w);
                    });
            job.setWorker(worker);

            // ADDED: email to client that worker accepted
            User client = job.getClient();
            emailService.sendJobAcceptedEmail(
                client.getEmail(), client.getName(),
                job.getTitle(), workerUser.getName()
            );
        }

        if (newStatus == Job.Status.COMPLETED) {
            // ADDED: email to client that job is done
            User client = job.getClient();
            emailService.sendJobCompletedEmail(
                client.getEmail(), client.getName(), job.getTitle()
            );
        }

        job.setStatus(newStatus);
        return JobResponse.from(jobRepo.save(job));
    }

    public void cancel(Long id, String email) {
        Job job = jobRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getClient().getEmail().equals(email))
            throw new RuntimeException("Not authorized");
        job.setStatus(Job.Status.CANCELLED);
        jobRepo.save(job);
    }

    public List<JobResponse> getOpenJobsByCategory(String category) {
        Job.Category cat = Job.Category.valueOf(category.toUpperCase());
        return jobRepo.findOpenJobsByCategory(cat)
                .stream()
                .map(JobResponse::from)
                .collect(Collectors.toList());
    }
    public JobResponse createJobWithImage(
            String title,
            String category,
            String description,
            BigDecimal budget,
            String location,
            String jobDate,
            MultipartFile image,
            String email
    ) throws IOException {

        User client = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = new Job();
        job.setTitle(title);
        job.setCategory(Job.Category.valueOf(category));
        job.setDescription(description);
        job.setBudget(budget);
        job.setLocation(location);

        if (jobDate != null && !jobDate.isEmpty()) {
            job.setJobDate(LocalDate.parse(jobDate));
        }

        job.setClient(client);
        job.setStatus(Job.Status.OPEN);

        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path path = Paths.get("uploads/" + fileName);
            Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            job.setImageUrl("/uploads/" + fileName);
        }

        return JobResponse.from(jobRepo.save(job));
    }	
}