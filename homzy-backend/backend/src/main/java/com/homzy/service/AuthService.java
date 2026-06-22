package com.homzy.service;

import com.homzy.config.JwtUtil;
import com.homzy.dto.AuthResponse;
import com.homzy.dto.LoginRequest;
import com.homzy.dto.RegisterRequest;
import com.homzy.model.User;
import com.homzy.model.Worker;
import com.homzy.repository.UserRepository;
import com.homzy.repository.WorkerRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final WorkerRepository workerRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(UserRepository userRepo, WorkerRepository workerRepo,
                       PasswordEncoder encoder, AuthenticationManager authManager,
                       JwtUtil jwtUtil, EmailService emailService) {  // FIX 1: added comma before EmailService
        this.userRepo     = userRepo;
        this.workerRepo   = workerRepo;
        this.encoder      = encoder;
        this.authManager  = authManager;
        this.jwtUtil      = jwtUtil;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered. Please login.");
        if (userRepo.existsByPhone(req.getPhone()))
            throw new RuntimeException("Phone number already registered.");

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRole(req.getRoleEnum());
        userRepo.save(user);

        if (user.getRole() == User.Role.WORKER) {
            Worker worker = new Worker();
            worker.setUser(user);
            worker.setSkills("General");
            worker.setExperience(0);
            worker.setIsAvailable(true);
            workerRepo.save(worker);
        }

        // FIX 2: email BEFORE return, not after
        emailService.sendWelcomeEmail(user.getEmail(), user.getName(), user.getRole().name());

        // FIX 3: only ONE token + return (removed the duplicate)
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password.");
        }
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole().name());
    }
}