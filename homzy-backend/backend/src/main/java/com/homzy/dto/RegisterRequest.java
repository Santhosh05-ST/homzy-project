package com.homzy.dto;

import com.homzy.model.User;

public class RegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String role = "CLIENT";

    public String getName()     { return name; }
    public String getEmail()    { return email; }
    public String getPhone()    { return phone; }
    public String getPassword() { return password; }
    public String getRole()     { return role; }

    public void setName(String n)     { this.name = n; }
    public void setEmail(String e)    { this.email = e; }
    public void setPhone(String p)    { this.phone = p; }
    public void setPassword(String p) { this.password = p; }
    public void setRole(String r)     { this.role = r; }

    public User.Role getRoleEnum() {
        try { return User.Role.valueOf(role.toUpperCase()); }
        catch (Exception e) { return User.Role.CLIENT; }
    }
}
