// ============================================================
//  pages/Login.jsx
// ============================================================
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/services'
import useAuthStore from '../store/authStore'

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await authService.login(form)
      login(data.token, { name: data.name, email: data.email, role: data.role })
      navigate(data.role === 'WORKER' ? '/worker/dashboard' : '/client/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card border-0 shadow-sm p-4" style={{width: '100%', maxWidth: '420px', borderRadius: '16px'}}>
        <div className="text-center mb-4">
          <span style={{fontSize:'2.5rem'}}>🏠</span>
          <h4 className="fw-bold mt-2" style={{color:'var(--homzy-primary)'}}>Welcome to Homzy</h4>
          <p className="text-muted small">Sign in to your account</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium">Email</label>
            <input type="email" className="form-control" placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-medium">Password</label>
            <input type="password" className="form-control" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-homzy w-100 py-2" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"/> : null}
            Sign In
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Don't have an account? <Link to="/register" className="text-homzy fw-medium">Register</Link>
        </p>
      </div>
    </div>
  )
}

// ============================================================
//  pages/Register.jsx
// ============================================================
export function Register() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', role:'CLIENT' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await authService.register(form)
      login(data.token, { name: data.name, email: data.email, role: data.role })
      navigate(data.role === 'WORKER' ? '/worker/dashboard' : '/client/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div className="card border-0 shadow-sm p-4" style={{width:'100%', maxWidth:'460px', borderRadius:'16px'}}>
        <div className="text-center mb-4">
          <span style={{fontSize:'2.5rem'}}>🏠</span>
          <h4 className="fw-bold mt-2" style={{color:'var(--homzy-primary)'}}>Join Homzy</h4>
          <p className="text-muted small">Create your account</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium">Full Name</label>
            <input className="form-control" placeholder="Arjun Kumar"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium">Email</label>
            <input type="email" className="form-control" placeholder="you@email.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium">Phone</label>
            <input className="form-control" placeholder="9876543210"
              value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-medium">Password</label>
            <input type="password" className="form-control" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-medium">I am a</label>
            <div className="d-flex gap-3">
              {['CLIENT','WORKER'].map(r => (
                <label key={r} className={`flex-fill text-center p-2 border rounded-3 cursor-pointer ${form.role===r ? 'border-success bg-light' : ''}`}
                  style={{cursor:'pointer'}}>
                  <input type="radio" className="visually-hidden" value={r}
                    checked={form.role===r} onChange={() => setForm({...form, role:r})}/>
                  <span>{r === 'CLIENT' ? '🏠 Client' : '👷 Worker'}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-homzy w-100 py-2" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"/> : null}
            Create Account
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Already have an account? <Link to="/login" className="text-homzy fw-medium">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
