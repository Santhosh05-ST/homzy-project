package com.homzy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homzy.service.AiService;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @GetMapping("/chat")
    public String chat(@RequestParam String message) {

        String prompt = """
                Generate a short home service request description in 2 to 3 lines.

                Customer problem: %s

                Return only the service description.
                Do not include job title.
                Do not include salary.
                Do not include requirements.
                Do not include qualifications.
                Do not include how to apply.
                """.formatted(message);

        return aiService.askAI(prompt);
    }
}