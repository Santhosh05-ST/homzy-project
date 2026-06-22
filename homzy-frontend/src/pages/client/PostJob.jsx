import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobService } from '../../services/services'

const CATEGORIES = ['PLUMBING','PAINTING','CLEANING','ELECTRICAL','CARPENTRY','AC_SERVICE','GARDENING','TILING','OTHER']

export default function PostJob() {
  const [form, setForm] = useState({
    title:'', category:'PLUMBING', description:'',
    budget:'', location:'', jobDate:''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const payload = { ...form, budget: form.budget ? parseFloat(form.budget) : null }
      await jobService.createJob(payload)
      navigate('/client/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post job')
    } finally { setLoading(false) }
  }

  const set = (field, val) => setForm(f => ({...f, [field]: val}))

  return (
    <div className="container py-4" style={{maxWidth:'640px'}}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h5 className="mb-0 fw-bold">Post a New Job</h5>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm p-4" style={{borderRadius:'16px'}}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Job Title *</label>
            <input className="form-control" placeholder="e.g. Fix bathroom leaking pipe"
              value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Category *</label>
            <select className="form-select" value={form.category}
              onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.replace('_',' ')}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Description</label>
            <textarea className="form-control" rows={4}
              placeholder="Describe the work in detail..."
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Budget (₹)</label>
              <input type="number" className="form-control" placeholder="e.g. 1500"
                value={form.budget} onChange={e => set('budget', e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Preferred Date</label>
              <input type="date" className="form-control"
                value={form.jobDate} onChange={e => set('jobDate', e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">Location / Address</label>
            <input className="form-control" placeholder="e.g. Anna Nagar, Chennai"
              value={form.location} onChange={e => set('location', e.target.value)} />
          </div>

          <button type="submit" className="btn btn-homzy w-100 py-2 fw-semibold" disabled={loading}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2"/>Posting...</>
              : <><i className="bi bi-send me-2"/>Post Job</>
            }
          </button>
        </form>
      </div>
    </div>
  )
}
