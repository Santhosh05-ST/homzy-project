// ============================================================
//  pages/worker/JobBoard.jsx
// ============================================================
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobService } from '../../services/services'
import JobCard from '../../components/JobCard'

export function WorkerJobBoard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    jobService.getAllOpenJobs().then(r => setJobs(r.data)).finally(() => setLoading(false))
  }, [])

  const acceptJob = async (id) => {
    await jobService.updateStatus(id, 'ACCEPTED')
    navigate(`/client/tracking/${id}`)
  }

  return (
    <div className="container py-4">
      <h5 className="fw-bold mb-1">Available Jobs</h5>
      <p className="text-muted small mb-4">Jobs near you — accept to start working</p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{color:'var(--homzy-primary)'}}></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-5">
          <span style={{fontSize:'3rem'}}>📋</span>
          <p className="text-muted mt-2">No open jobs right now. Check back soon!</p>
        </div>
      ) : (
        jobs.map(job => (
          <JobCard key={job.id} job={job}
            actionLabel="Accept Job"
            onAction={acceptJob} />
        ))
      )}
    </div>
  )
}

// ============================================================
//  pages/worker/Dashboard.jsx
// ============================================================
import useAuthStore from '../../store/authStore'

export function WorkerDashboard() {
  const [myJobs, setMyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Worker sees their accepted/in-progress jobs via my-jobs equivalent
    jobService.getAllOpenJobs().then(r => setMyJobs(r.data)).finally(() => setLoading(false))
  }, [])

  const completedCount = myJobs.filter(j => j.status === 'COMPLETED').length
  const activeJob = myJobs.find(j => j.status === 'IN_PROGRESS' || j.status === 'ACCEPTED')

  return (
    <div className="container py-4">
      <h5 className="fw-bold mb-1">My Dashboard</h5>
      <p className="text-muted small mb-4">Welcome back, {user?.name}</p>

      {/* Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-4"><div className="metric-card"><div className="val">₹18,400</div><div className="lbl">This month</div></div></div>
        <div className="col-4"><div className="metric-card"><div className="val">{completedCount}</div><div className="lbl">Jobs done</div></div></div>
        <div className="col-4"><div className="metric-card"><div className="val">4.9 ⭐</div><div className="lbl">Rating</div></div></div>
      </div>

      {/* Active job */}
      {activeJob && (
        <>
          <h6 className="fw-semibold mb-3">Active Job</h6>
          <JobCard job={activeJob}
            actionLabel="Mark Complete"
            onAction={id => jobService.updateStatus(id, 'COMPLETED').then(() => window.location.reload())} />
        </>
      )}

      {/* Quick actions */}
      <h6 className="fw-semibold mb-3 mt-2">Quick Actions</h6>
      <div className="d-flex gap-2">
        <button className="btn btn-homzy flex-fill" onClick={() => navigate('/worker/board')}>
          <i className="bi bi-clipboard-list me-2"></i>Browse Jobs
        </button>
        <button className="btn btn-outline-secondary flex-fill">
          <i className="bi bi-person-circle me-2"></i>My Profile
        </button>
      </div>
    </div>
  )
}
