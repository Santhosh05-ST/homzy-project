import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobService } from '../../services/services'

const STEPS = [
  { key:'OPEN',        label:'Job Posted',           sub:'Your job is live' },
  { key:'ACCEPTED',    label:'Worker Accepted',       sub:'A worker has taken your job' },
  { key:'IN_PROGRESS', label:'Work In Progress',      sub:'Worker is at your location' },
  { key:'COMPLETED',   label:'Job Completed',         sub:'Payment released' },
]

const ORDER = ['OPEN','ACCEPTED','IN_PROGRESS','COMPLETED']

export default function JobTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobService.getJobById(id).then(r => setJob(r.data)).finally(() => setLoading(false))
    const interval = setInterval(() => {
      jobService.getJobById(id).then(r => setJob(r.data))
    }, 10000) // poll every 10s
    return () => clearInterval(interval)
  }, [id])

  const currentIdx = ORDER.indexOf(job?.status)

  if (loading) return <div className="text-center py-5"><div className="spinner-border" style={{color:'var(--homzy-primary)'}}></div></div>
  if (!job) return <div className="text-center py-5 text-muted">Job not found.</div>

  return (
    <div className="container py-4" style={{maxWidth:'640px'}}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h5 className="mb-0 fw-bold">Job Tracking</h5>
      </div>

      {/* Job summary */}
      <div className="card border-0 shadow-sm p-4 mb-3" style={{borderRadius:'16px'}}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="fw-bold mb-1">{job.title}</h6>
            <span className="text-muted small">
              <i className="bi bi-geo-alt me-1"></i>{job.location}
            </span>
          </div>
          <span className="badge badge-in-progress px-3 py-2">{job.status?.replace('_',' ')}</span>
        </div>

        {job.workerName && (
          <div className="d-flex align-items-center gap-3 mt-3 p-3 rounded-3 bg-light">
            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
              style={{width:44,height:44,background:'var(--homzy-primary)',fontSize:'1rem'}}>
              {job.workerName.charAt(0)}
            </div>
            <div>
              <div className="fw-semibold">{job.workerName}</div>
              <div className="small text-muted">⭐⭐⭐⭐⭐ Worker</div>
            </div>
            <button className="btn btn-sm btn-homzy ms-auto"
              onClick={() => navigate(`/chat/${id}`)}>
              <i className="bi bi-chat-dots me-1"></i>Chat
            </button>
          </div>
        )}
      </div>

      {/* Stepper */}
      <div className="card border-0 shadow-sm p-4 mb-3" style={{borderRadius:'16px'}}>
        <h6 className="fw-semibold mb-4">Job Progress</h6>
        <ul className="stepper mb-0">
          {STEPS.map((step, idx) => {
            const done   = idx < currentIdx
            const active = idx === currentIdx
            const pending= idx > currentIdx
            return (
              <li key={step.key}>
                <div className="d-flex flex-column align-items-center">
                  <div className={`step-dot ${done?'done':active?'active':''}`}></div>
                  {idx < STEPS.length - 1 && (
                    <div style={{width:2,flex:1,background:done?'var(--homzy-primary)':'#dee2e6',marginTop:2}}></div>
                  )}
                </div>
                <div className="pb-2">
                  <div className={`fw-medium ${pending?'text-muted':''}`}>{step.label}</div>
                  <div className="small text-muted">{active ? '⏳ ' + step.sub : step.sub}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Cost + actions */}
      <div className="card border-0 shadow-sm p-3 d-flex flex-row justify-content-between align-items-center" style={{borderRadius:'16px'}}>
        <div>
          <div className="small text-muted">Estimated cost</div>
          <div className="fw-bold fs-4 text-homzy">₹{Number(job.budget).toLocaleString()}</div>
        </div>
        {job.status === 'OPEN' && (
          <button className="btn btn-outline-danger btn-sm"
            onClick={() => jobService.cancelJob(id).then(() => navigate('/client/home'))}>
            Cancel Job
          </button>
        )}
      </div>
    </div>
  )
}
