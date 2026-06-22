package com.homzy.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ── Core send method ─────────────────────────────
    private void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML
            mailSender.send(message);
            System.out.println("Email sent to: " + to + " | Subject: " + subject);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    // ── 1. Welcome email after register ──────────────
    public void sendWelcomeEmail(String to, String name, String role) {
        String subject = "Welcome to Homzy! 🏠";
        String body = buildHtml(
            "Welcome to Homzy, " + name + "!",
            role.equals("CLIENT")
                ? "Your account is ready. Start posting home service jobs and get them done fast!"
                : "Your worker account is ready. Browse open jobs near you and start earning!",
            role.equals("CLIENT") ? "Post a Job" : "Browse Jobs",
            role.equals("CLIENT") ? "http://localhost:5173/client/post-job" : "http://localhost:5173/worker/jobs"
        );
        sendEmail(to, subject, body);
    }

    // ── 2. Job posted - confirm to client ────────────
    public void sendJobPostedEmail(String to, String clientName, String jobTitle) {
        String subject = "Your job has been posted — " + jobTitle;
        String body = buildHtml(
            "Job Posted Successfully!",
            "Hi " + clientName + ", your job <b>" + jobTitle + "</b> is now live. Workers near you will see and accept it shortly.",
            "Track Your Job",
            "http://localhost:5173/client/my-jobs"
        );
        sendEmail(to, subject, body);
    }

    // ── 3. Job accepted - notify client ──────────────
    public void sendJobAcceptedEmail(String to, String clientName, String jobTitle, String workerName) {
        String subject = "Worker accepted your job — " + jobTitle;
        String body = buildHtml(
            "A Worker Accepted Your Job!",
            "Hi " + clientName + ", good news! <b>" + workerName + "</b> has accepted your job <b>" + jobTitle + "</b> and will be arriving soon.",
            "Track & Chat",
            "http://localhost:5173/client/my-jobs"
        );
        sendEmail(to, subject, body);
    }

    // ── 4. New job alert to worker ───────────────────
    public void sendNewJobAlertEmail(String to, String workerName, String jobTitle, String location) {
        String subject = "New job available near you — " + jobTitle;
        String body = buildHtml(
            "New Job Available!",
            "Hi " + workerName + ", a new job <b>" + jobTitle + "</b> has been posted near <b>" + location + "</b>. Accept it before someone else does!",
            "View Job",
            "http://localhost:5173/worker/jobs"
        );
        sendEmail(to, subject, body);
    }

    // ── 5. Job completed ─────────────────────────────
    public void sendJobCompletedEmail(String to, String name, String jobTitle) {
        String subject = "Job completed — " + jobTitle;
        String body = buildHtml(
            "Job Completed!",
            "Hi " + name + ", the job <b>" + jobTitle + "</b> has been marked as completed. Thank you for using Homzy!",
            "View My Jobs",
            "http://localhost:5173/client/my-jobs"
        );
        sendEmail(to, subject, body);
    }

    // ── HTML email template ───────────────────────────
    private String buildHtml(String heading, String message, String btnText, String btnUrl) {
        return "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,sans-serif;'>" +
            "<table width='100%' cellpadding='0' cellspacing='0'><tr><td align='center' style='padding:40px 20px;'>" +
            "<table width='560' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);'>" +

            // Header
            "<tr><td style='background:#1D9E75;padding:28px 40px;'>" +
            "<h1 style='margin:0;color:#fff;font-size:22px;font-weight:700;'>🏠 Homzy</h1>" +
            "<p style='margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;'>Home Services Marketplace</p></td></tr>" +

            // Body
            "<tr><td style='padding:36px 40px;'>" +
            "<h2 style='margin:0 0 16px;color:#111;font-size:20px;font-weight:700;'>" + heading + "</h2>" +
            "<p style='margin:0 0 28px;color:#555;font-size:15px;line-height:1.7;'>" + message + "</p>" +
            "<a href='" + btnUrl + "' style='background:#1D9E75;color:#fff;text-decoration:none;padding:13px 28px;border-radius:9px;font-size:14px;font-weight:700;display:inline-block;'>" + btnText + "</a>" +
            "</td></tr>" +

            // Footer
            "<tr><td style='background:#f8f9fa;padding:20px 40px;border-top:1px solid #e9ecef;'>" +
            "<p style='margin:0;color:#aaa;font-size:12px;text-align:center;'>© 2026 Homzy · Chennai, Tamil Nadu · support@homzy.com</p>" +
            "</td></tr>" +

            "</table></td></tr></table></body></html>";
    }
}