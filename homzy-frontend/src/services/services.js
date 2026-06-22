// ============================================================
//  services/authService.js
// ============================================================
import api from './api'

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ============================================================
//  services/jobService.js
// ============================================================
export const jobService = {
  getAllOpenJobs:  ()       => api.get('/jobs'),
  getMyJobs:      ()       => api.get('/jobs/my-jobs'),
  getJobById:     (id)     => api.get(`/jobs/${id}`),
  createJob:      (data)   => api.post('/jobs/create', data),
  updateStatus:   (id, status) => api.put(`/jobs/${id}/status?status=${status}`),
  cancelJob:      (id)     => api.delete(`/jobs/${id}/cancel`),
}

// ============================================================
//  services/chatService.js
// ============================================================
export const chatService = {
  getMessages: (jobId) => api.get(`/chat/${jobId}/messages`),
}

// ============================================================
//  services/workerService.js
// ============================================================
export const workerService = {
  getAvailableWorkers: () => api.get('/workers'),
  getWorkerDashboard:  () => api.get('/workers/dashboard'),
}
