import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobService } from '../../services/services'
import JobCard from '../../components/JobCard'
import useAuthStore from '../../store/authStore'

const CATEGORIES = [
  { key:'PLUMBING',   icon:'🔧', label:'Plumbing' },
  { key:'PAINTING',   icon:'🎨', label:'Painting' },
  { key:'CLEANING',   icon:'🧹', label:'Cleaning' },
  { key:'ELECTRICAL', icon:'⚡', label:'Electrical' },
  { key:'CARPENTRY',  icon:'🪵', label:'Carpentry' },
  { key:'AC_SERVICE', icon:'❄️', label:'AC Service' },
  { key:'GARDENING',  icon:'🌿', label:'Gardening' },
  { key:'TILING',     icon:'🪟', label:'Tiling' },
]

export default function ClientHome() {
  const [jobs, setJobs] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([jobService.getAllOpenJobs(), jobService.getMyJobs()])
      .then(([open, mine]) => {
        setJobs(open.data)
        setMyJobs(mine.data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container-fluid py-4">
      {/* Welcome banner */}
      <div className="rounded-4 p-4 mb-4 text-white" style={{background:'var(--homzy-primary)'}}>
        <h5 className="mb-1">Hello, {user?.name?.split(' ')[0]} 👋</h5>
        <p className="mb-3 opacity-75 small">What home service do you need today?</p>
        <button className="btn btn-light fw-semibold" onClick={() => navigate('/client/post-job')}>
          + Post a Job
        </button>
      </div>

      {/* Categories */}
      <h6 className="fw-semibold mb-3">Browse Categories</h6>
      <div className="row row-cols-4 row-cols-md-8 g-2 mb-4">
        {CATEGORIES.map(c => (
          <div key={c.key} className="col">
            <div className="cat-tile">
              <div className="cat-icon">{c.icon}</div>
              <div className="cat-name">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* My Jobs */}
      {myJobs.length > 0 && (
        <>
          <h6 className="fw-semibold mb-3">My Jobs</h6>
          {myJobs.slice(0,3).map(job => (
            <JobCard key={job.id} job={job}
              actionLabel={job.status === 'OPEN' ? 'Track' : 'Track'}
              onAction={id => navigate(`/client/tracking/${id}`)} />
          ))}
        </>
      )}

      {/* Recent open jobs */}
      <h6 className="fw-semibold mb-3 mt-2">Recent Open Jobs Near You</h6>
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-success" style={{color:'var(--homzy-primary)'}}></div>
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-muted text-center py-4">No open jobs right now.</p>
      ) : (
        jobs.slice(0, 5).map(job => <JobCard key={job.id} job={job} />)
      )}
          </div>
  )
}
