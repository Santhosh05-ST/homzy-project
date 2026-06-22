import { Link } from 'react-router-dom'

const statusClass = {
  OPEN:        'badge-open',
  ACCEPTED:    'badge-accepted',
  IN_PROGRESS: 'badge-in-progress',
  COMPLETED:   'badge-completed',
  CANCELLED:   'badge-cancelled',
}

const categoryIcon = {
  PLUMBING:    'bi-wrench',
  PAINTING:    'bi-brush',
  CLEANING:    'bi-stars',
  ELECTRICAL:  'bi-lightning-charge',
  CARPENTRY:   'bi-hammer',
  AC_SERVICE:  'bi-thermometer-snow',
  GARDENING:   'bi-tree',
  TILING:      'bi-grid',
  OTHER:       'bi-three-dots',
}

export default function JobCard({ job, actionLabel, onAction }) {
  return (
    <div className="homzy-card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h6 className="mb-0 fw-semibold">{job.title}</h6>
        <span className={`badge rounded-pill px-3 py-1 ${statusClass[job.status] || 'bg-secondary'}`}>
          {job.status?.replace('_', ' ')}
        </span>
      </div>

      <div className="d-flex gap-3 text-muted small mb-2">
        <span>
          <i className={`bi ${categoryIcon[job.category] || 'bi-tools'} me-1`}></i>
          {job.category?.replace('_', ' ')}
        </span>
        {job.location && (
          <span><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
        )}
        {job.jobDate && (
          <span><i className="bi bi-calendar3 me-1"></i>{job.jobDate}</span>
        )}
      </div>

      {job.description && (
        <p className="small text-muted mb-2" style={{overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
          {job.description}
        </p>
      )}

      <div className="d-flex justify-content-between align-items-center mt-2">
        <span className="fw-bold text-homzy fs-5">
          {job.budget ? `₹${Number(job.budget).toLocaleString()}` : 'Open to bids'}
        </span>
        <div className="d-flex gap-2">
          <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-secondary">
            View
          </Link>
          {actionLabel && onAction && (
            <button className="btn btn-sm btn-homzy" onClick={() => onAction(job.id)}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
