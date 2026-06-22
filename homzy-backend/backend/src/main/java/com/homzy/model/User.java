package com.homzy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, unique = true, length = 15)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CLIENT;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role { CLIENT, WORKER, ADMIN }

    public User() {}

    public Long getId()                { return id; }
    public String getName()            { return name; }
    public String getEmail()           { return email; }
    public String getPhone()           { return phone; }
    public String getPassword()        { return password; }
    public Role getRole()              { return role; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    public void setId(Long id)                    { this.id = id; }
    public void setName(String name)              { this.name = name; }
    public void setEmail(String email)            { this.email = email; }
    public void setPhone(String phone)            { this.phone = phone; }
    public void setPassword(String password)      { this.password = password; }
    public void setRole(Role role)                { this.role = role; }
    public void setCreatedAt(LocalDateTime t)     { this.createdAt = t; }
}
