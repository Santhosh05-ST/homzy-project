package com.homzy.dto;

public class MessageRequest {
    private Long jobId;
    private String content;

    public Long getJobId()      { return jobId; }
    public String getContent()  { return content; }
    public void setJobId(Long j)      { this.jobId = j; }
    public void setContent(String c)  { this.content = c; }
}
