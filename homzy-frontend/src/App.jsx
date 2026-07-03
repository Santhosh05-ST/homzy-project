  import React, { useState, useEffect, useRef } from 'react'
import {
  BrowserRouter, Routes, Route, Navigate,
  Link, useNavigate, useParams
} from 'react-router-dom'
import axios from 'axios'
import "./assets/css/homzy.css";
import workerImg from "./assets/images/worker.png";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'


// ═══════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════
const css = `
  :root{
    --g:#12b886;
    --gd:#087f5b;
    --gl:#e6fcf5;
    --dark:#0f172a;
    --text:#1f2937;
    --muted:#64748b;
    --line:#e5e7eb;
    --soft:#f8fafc;
    --white:#ffffff;
    --danger:#ef4444;
    --shadow:0 20px 45px rgba(15,23,42,.08);
    --shadow-sm:0 8px 24px rgba(15,23,42,.06);
  }
  *{box-sizing:border-box}
  body{
    background:linear-gradient(180deg,#f8fafc 0%,#eefcf7 100%);
    font-family:Inter,'Segoe UI',system-ui,sans-serif;
    margin:0;
    color:var(--text);
  }
  a{text-decoration:none}
  button,input,select,textarea{font-family:inherit}

  /* Navbar */
  .hnav{
    background:rgba(255,255,255,.88);
    backdrop-filter:blur(18px);
    padding:14px 7%;
    display:flex;
    align-items:center;
    justify-content:space-between;
    flex-wrap:wrap;
    gap:14px;
    position:sticky;
    top:0;
    z-index:1000;
    border-bottom:1px solid rgba(226,232,240,.8);
    box-shadow:0 8px 24px rgba(15,23,42,.04);
  }
  .hnav .brand{
    color:var(--dark);
    font-size:25px;
    font-weight:900;
    text-decoration:none;
    display:flex;
    align-items:center;
    gap:8px;
    letter-spacing:-.04em;
  }
  .hnav .brand::first-letter{color:var(--g)}
  .hnav .links{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .hnav a.nl{
    color:#475569;
    text-decoration:none;
    padding:9px 14px;
    border-radius:999px;
    font-size:14px;
    font-weight:700;
    transition:.25s;
  }
  .hnav a.nl:hover{background:var(--gl);color:var(--gd)}
  .hnav .nbtn{
    background:linear-gradient(135deg,var(--g),var(--gd));
    color:#fff;
    border:none;
    padding:10px 18px;
    border-radius:999px;
    font-size:13px;
    font-weight:800;
    cursor:pointer;
    box-shadow:0 10px 22px rgba(18,184,134,.25);
    transition:.25s;
  }
  .hnav .nbtn:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(18,184,134,.32)}
  .hnav .uname{color:#64748b;font-size:13px;font-weight:800;background:#f1f5f9;padding:9px 12px;border-radius:999px}

  /* Landing page */
  .landing{overflow:hidden;background:#fff}
  .hero-wrap{position:relative;padding:85px 7% 70px;background:radial-gradient(circle at top left,#d3f9d8 0,#fff 38%,#f8fafc 100%)}
  .hero-grid{max-width:1200px;margin:auto;display:grid;grid-template-columns:1.05fr .95fr;gap:55px;align-items:center}
  .pill{display:inline-flex;align-items:center;gap:8px;background:var(--gl);color:var(--gd);padding:9px 15px;border-radius:999px;font-size:13px;font-weight:900;margin-bottom:20px}
  .hero-title{font-size:64px;line-height:1.03;margin:0;color:var(--dark);letter-spacing:-.06em;font-weight:950}
  .hero-title span{color:var(--g)}
  .hero-text{font-size:18px;line-height:1.8;color:var(--muted);max-width:620px;margin:24px 0 32px}
  .hero-actions{display:flex;gap:14px;flex-wrap:wrap}
  .hero-card{background:#fff;border-radius:34px;padding:22px;box-shadow:var(--shadow);border:1px solid #edf2f7;position:relative}
  .hero-img{height:420px;border-radius:26px;background:linear-gradient(135deg,#12b886,#087f5b);display:flex;align-items:center;justify-content:center;color:#fff;font-size:90px}
  .float-card{position:absolute;left:-24px;bottom:28px;background:#fff;padding:17px 20px;border-radius:22px;box-shadow:var(--shadow-sm);border:1px solid #edf2f7;font-weight:900;color:var(--dark)}
  .stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:34px;max-width:600px}
  .mini-stat{background:rgba(255,255,255,.72);border:1px solid #e2e8f0;border-radius:20px;padding:17px}.mini-stat b{font-size:25px;color:var(--dark)}.mini-stat p{margin:4px 0 0;color:var(--muted);font-size:13px}
  .lp-section{padding:80px 7%;max-width:1200px;margin:auto}.lp-head{text-align:center;margin-bottom:42px}.lp-head h2{font-size:42px;margin:0;color:var(--dark);letter-spacing:-.04em}.lp-head p{color:var(--muted);font-size:16px}
  .service-grid-pro{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}.service-pro{background:#fff;border:1px solid #edf2f7;border-radius:26px;padding:26px;box-shadow:var(--shadow-sm);transition:.25s}.service-pro:hover{transform:translateY(-8px);box-shadow:var(--shadow)}.service-pro .ico{font-size:44px}.service-pro h3{margin:16px 0 8px;color:var(--dark)}.service-pro p{color:var(--muted);font-size:14px;line-height:1.7}
  .cta-pro{margin:40px 7% 80px;background:linear-gradient(135deg,var(--g),var(--gd));border-radius:34px;padding:60px 30px;text-align:center;color:#fff;box-shadow:0 25px 55px rgba(18,184,134,.25)}.cta-pro h2{font-size:42px;margin:0 0 12px}.cta-pro p{opacity:.86;margin-bottom:25px}

  /* Buttons */
  .btn-g,.btn-out,.btn-red,.btn-gray,.primary-btn,.secondary-btn{transition:.25s}
  .btn-g,.primary-btn{
    background:linear-gradient(135deg,var(--g),var(--gd));
    color:#fff;border:none;padding:12px 22px;border-radius:14px;font-weight:800;cursor:pointer;font-size:14px;box-shadow:0 10px 24px rgba(18,184,134,.23);
  }
  .btn-g:hover,.primary-btn:hover{transform:translateY(-2px);box-shadow:0 16px 35px rgba(18,184,134,.32)}
  .btn-g:disabled{opacity:.6;cursor:not-allowed;transform:none}
  .btn-out,.secondary-btn{background:#fff;color:var(--gd);border:1.7px solid #b7eadb;padding:11px 20px;border-radius:14px;font-weight:800;cursor:pointer;font-size:14px}
  .btn-out:hover,.secondary-btn:hover{background:var(--gl);transform:translateY(-2px)}
  .btn-sm{padding:8px 14px;font-size:13px;border-radius:12px}
  .btn-red{background:#ef4444;color:#fff;border:none;padding:9px 16px;border-radius:12px;font-size:13px;font-weight:800;cursor:pointer}.btn-red:hover{background:#dc2626}
  .btn-gray{background:#334155;color:#fff;border:none;padding:10px 18px;border-radius:12px;cursor:pointer;font-weight:800;font-size:14px}.btn-gray:hover{background:#0f172a}

  /* Cards */
  .card{background:rgba(255,255,255,.92);border-radius:24px;border:1px solid #edf2f7;padding:24px;box-shadow:var(--shadow-sm)}
  .card-job{background:#fff;border-radius:22px;border:1px solid #edf2f7;padding:20px;margin-bottom:15px;cursor:pointer;transition:.25s;box-shadow:0 8px 24px rgba(15,23,42,.04)}
  .card-job:hover{box-shadow:var(--shadow);border-color:#a7f3d0;transform:translateY(-4px)}

  /* Badges */
  .badge{display:inline-block;padding:6px 12px;border-radius:999px;font-size:11px;font-weight:900;letter-spacing:.02em}
  .badge-OPEN{background:#dcfce7;color:#166534}.badge-ACCEPTED{background:#dbeafe;color:#1d4ed8}.badge-IN_PROGRESS{background:#fef3c7;color:#92400e}.badge-COMPLETED{background:#d1fae5;color:#065f46}.badge-CANCELLED{background:#fee2e2;color:#991b1b}

  /* Form */
  .form-group{margin-bottom:17px}.form-group label{display:block;font-size:13px;font-weight:900;color:#475569;margin-bottom:7px}
  .form-group input,.form-group select,.form-group textarea{width:100%;padding:13px 15px;border:1.5px solid #e2e8f0;border-radius:14px;font-size:14px;box-sizing:border-box;outline:none;transition:.25s;background:#fff;color:var(--dark)}
  .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--g);box-shadow:0 0 0 5px rgba(18,184,134,.12)}

  /* Page wrapper */
  .page{max-width:1040px;margin:0 auto;padding:34px 18px}.page-sm{max-width:460px;margin:0 auto;padding:45px 16px}.page-md{max-width:720px;margin:0 auto;padding:34px 18px}

  /* Alert */
  .alert{padding:14px 16px;border-radius:16px;font-size:13px;margin-bottom:16px;display:flex;align-items:center;gap:8px;font-weight:700}.alert-err{background:#fff1f2;border:1px solid #fecdd3;color:#9f1239}.alert-ok{background:#ecfdf5;border:1px solid #bbf7d0;color:#047857}.alert-info{background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8}

  /* Stats */
  .stat-box{background:#fff;border:1px solid #edf2f7;border-radius:24px;padding:22px;text-align:center;box-shadow:var(--shadow-sm)}.stat-box .val{font-size:31px;font-weight:950;color:var(--g)}.stat-box .lbl{font-size:12px;color:var(--muted);margin-top:4px;font-weight:800}

  /* Category grid */
  .cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}.cat-item{background:#fff;border:1px solid #edf2f7;border-radius:20px;padding:18px 10px;text-align:center;cursor:pointer;transition:.25s;box-shadow:0 6px 18px rgba(15,23,42,.04)}.cat-item:hover{border-color:#a7f3d0;background:var(--gl);transform:translateY(-5px)}.cat-item .ci{font-size:30px}.cat-item .cn{font-size:12px;color:#475569;margin-top:7px;font-weight:900}

  /* Banner */
  .banner{background:linear-gradient(135deg,#12b886,#087f5b);border-radius:28px;padding:32px;color:#fff;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;box-shadow:0 22px 50px rgba(18,184,134,.24);position:relative;overflow:hidden}.banner::after{content:'';position:absolute;right:-60px;top:-70px;width:190px;height:190px;background:rgba(255,255,255,.14);border-radius:50%}.banner h4{margin:0 0 6px;font-weight:950;font-size:26px;letter-spacing:-.03em}.banner p{margin:0;opacity:.88;font-size:15px}.banner .wbtn{background:#fff;color:var(--gd);border:none;padding:13px 22px;border-radius:16px;font-weight:950;cursor:pointer;position:relative;z-index:1}

  /* Stepper */
  .stepper{list-style:none;padding:0;margin:0}.stepper li{display:flex;gap:15px}.step-left{display:flex;flex-direction:column;align-items:center}.step-dot{width:34px;height:34px;border-radius:50%;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;background:#fff}.step-dot.done{background:var(--g);border-color:var(--g);color:#fff}.step-dot.active{background:var(--gl);border-color:var(--g);color:var(--gd)}.step-dot.pending{background:#f8fafc;color:#94a3b8}.step-line{width:2px;flex:1;min-height:28px;background:#e2e8f0;margin:4px 0}.step-line.done{background:var(--g)}.step-right{padding-bottom:22px;padding-top:4px}.step-title{font-size:15px;font-weight:900}.step-sub{font-size:12px;color:var(--muted);margin-top:3px}

  /* Chat */
  .chat-area{height:420px;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:linear-gradient(180deg,#fff,#f8fafc)}.bubble{max-width:72%;padding:12px 15px;border-radius:18px;font-size:14px;line-height:1.55;box-shadow:0 4px 15px rgba(15,23,42,.05)}.bubble-me{background:linear-gradient(135deg,var(--g),var(--gd));color:#fff;border-radius:18px 18px 4px 18px;align-self:flex-end}.bubble-other{background:#fff;color:#1e293b;border-radius:18px 18px 18px 4px;align-self:flex-start;border:1px solid #edf2f7}.bubble-name{font-size:11px;color:#64748b;margin-bottom:4px;font-weight:800}.bubble-time{font-size:10px;opacity:.65;margin-top:4px}

  /* Auth page */
 .auth-wrap {
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:linear-gradient(135deg,#0f766e,#10b981,#ecfeff);
  background-size:300% 300%;
  animation:bgMove 8s ease infinite;
  position:relative;
  overflow:hidden;
}

.auth-wrap::before,
.auth-wrap::after {
  content:"";
  position:absolute;
  width:260px;
  height:260px;
  border-radius:50%;
  background:rgba(255,255,255,0.18);
  filter:blur(2px);
  animation:floatShape 6s ease-in-out infinite;
}

.auth-wrap::before {
  top:80px;
  left:120px;
}

.auth-wrap::after {
  bottom:80px;
  right:120px;
  animation-delay:2s;
}

@keyframes bgMove {
  0% { background-position:0% 50%; }
  50% { background-position:100% 50%; }
  100% { background-position:0% 50%; }
}

@keyframes floatShape {
  0%,100% { transform:translateY(0); }
  50% { transform:translateY(-25px); }
}
  .auth-card {
  position:relative;
  z-index:2;
  width:100%;
  max-width:460px;
  background:rgba(255,255,255,0.92);
  backdrop-filter:blur(16px);
  border-radius:28px;
  padding:32px;
  box-shadow:0 30px 80px rgba(0,0,0,0.18);
  border:1px solid rgba(255,255,255,0.45);
  animation:cardUp 0.7s ease;
}

@keyframes cardUp {
  from {
    opacity:0;
    transform:translateY(40px) scale(0.96);
  }
  to {
    opacity:1;
    transform:translateY(0) scale(1);
  }
}

.auth-logo {
  text-align:center;
  margin-bottom:24px;
}

.auth-logo .icon {
  font-size:56px;
  animation:bounceIcon 2s infinite;
}

@keyframes bounceIcon {
  0%,100% { transform:translateY(0); }
  50% { transform:translateY(-8px); }
}

.auth-logo h2 {
  color:#047857;
  margin:8px 0 4px;
  font-size:34px;
  font-weight:800;
}

.auth-logo p {
  color:#6b7280;
  margin:0;
  font-size:14px;
}

.auth-card h5 {
  text-align:center;
  font-size:22px;
  margin-bottom:22px;
  color:#111827;
}

.auth-card .form-group input,
.auth-card .form-group select {
  border-radius:16px;
  padding:14px 16px;
  background:#f9fafb;
}

.auth-card .form-group input:focus,
.auth-card .form-group select:focus {
  background:white;
  border-color:#10b981;
  box-shadow:0 0 0 4px rgba(16,185,129,0.12);
}

.auth-card .btn-g {
  width:100%;
  border-radius:16px;
  padding:14px;
  font-size:15px;
  box-shadow:0 12px 25px rgba(16,185,129,0.28);
}

.role-card {
  border:2px solid #e5e7eb;
  background:white;
  border-radius:18px;
  padding:18px 12px;
  text-align:center;
  cursor:pointer;
  transition:0.3s ease;
}

.role-card:hover {
  transform:translateY(-4px);
  box-shadow:0 15px 30px rgba(0,0,0,0.08);
}

.role-card.active {
  border-color:#10b981;
  background:#ecfdf5;
}

.role-card .role-icon {
  font-size:30px;
}

.role-card .role-title {
  font-weight:700;
  font-size:14px;
  margin-top:6px;
}

.role-card .role-sub {
  font-size:11px;
  color:#6b7280;
}
  /* Helpers */
  .row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}.flex-between{display:flex;justify-content:space-between;align-items:center}.flex-center{display:flex;align-items:center;gap:10px}.avatar{width:46px;height:46px;border-radius:16px;background:var(--gl);display:flex;align-items:center;justify-content:center;font-weight:950;color:var(--gd);font-size:16px;flex-shrink:0}.text-green{color:var(--g)}.text-muted{color:var(--muted);font-size:13px}.fw-bold{font-weight:900}.fw-600{font-weight:800}.mb-0{margin-bottom:0}.mb-4{margin-bottom:16px}.mb-8{margin-bottom:8px}.mt-8{margin-top:8px}.spinner{display:inline-block;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:6px}@keyframes spin{to{transform:rotate(360deg)}}hr{border:none;border-top:1px solid #edf2f7;margin:18px 0}.sec-title{font-size:12px;font-weight:950;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px}

  @media(max-width:900px){.hero-grid{grid-template-columns:1fr}.hero-title{font-size:46px}.service-grid-pro{grid-template-columns:repeat(2,1fr)}.hero-img{height:300px}.float-card{left:18px}.stats-row{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:600px){.hnav{padding:12px 16px}.hero-wrap{padding:55px 18px}.hero-title{font-size:38px}.stats-row,.row3{grid-template-columns:1fr}.service-grid-pro{grid-template-columns:1fr}.cat-grid{grid-template-columns:repeat(2,1fr)}.row2{grid-template-columns:1fr}.banner{flex-direction:column;align-items:flex-start}.page,.page-md{padding:22px 14px}.cta-pro{margin:30px 16px;padding:38px 18px}.cta-pro h2,.lp-head h2{font-size:31px}.hero-card{padding:14px;border-radius:24px}}
`

// ═══════════════════════════════════════════════════════
//  API
// ═══════════════════════════════════════════════════════
const API = axios.create({ baseURL: '/api' })
API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('htoken')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})
API.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.clear(); window.location.href = '/login'
  }
  return Promise.reject(err)
})

const auth  = { login: d => API.post('/auth/login', d), register: d => API.post('/auth/register', d) }
const jobs = {
  all: () => API.get('/jobs'),
  mine: () => API.get('/jobs/my-jobs'),
  workerJobs: () => API.get('/jobs/worker-jobs'),
  filter: category => API.get(`/jobs/filter?category=${category}`),
  byId: id => API.get(`/jobs/${id}`),
  create: d => API.post('/jobs/create', d),
  status: (id, s) => API.put(`/jobs/${id}/status?status=${s}`),
  cancel: id => API.delete(`/jobs/${id}/cancel`)
}
const chat  = { get: jid => API.get(`/chat/${jid}/messages`), send: d => API.post('/chat/send', d) }

// ═══════════════════════════════════════════════════════
//  AUTH HELPERS
// ═══════════════════════════════════════════════════════
const getUser  = () => { try { return JSON.parse(localStorage.getItem('huser') || 'null') } catch { return null } }
const saveAuth = (token, user) => { localStorage.setItem('htoken', token); localStorage.setItem('huser', JSON.stringify(user)) }
const clearAuth= () => localStorage.clear()
const loggedIn = () => !!localStorage.getItem('htoken')
const isPaymentDone = id => localStorage.getItem(`payment_${id}`) === 'DONE'

const savePaymentDone = id => {
  localStorage.setItem(`payment_${id}`, 'DONE')
}

// ═══════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════
const ICONS = { PLUMBING:'🔧', PAINTING:'🎨', CLEANING:'🧹', ELECTRICAL:'⚡', CARPENTRY:'🪵', AC_SERVICE:'❄️', GARDENING:'🌿', TILING:'🪟', OTHER:'🛠️' }

function JobCard({ job, onAction, actionLabel }) {
  const nav = useNavigate()
  return (
    <div className="card-job" onClick={() => nav(`/jobs/${job.id}`)}>
      <div className="flex-between mb-4">
        <div style={{fontWeight:600, fontSize:15}}>{job.title}</div>
        <span className={`badge badge-${job.status}`}>{job.status?.replace('_',' ')}</span>
      </div>
      <div style={{display:'flex', gap:16, flexWrap:'wrap', fontSize:13, color:'#6c757d', marginBottom:10}}>
        <span>{ICONS[job.category] || '🛠️'} {job.category?.replace('_',' ')}</span>
        {job.location && <span>📍 {job.location}</span>}
        {job.jobDate  && <span>📅 {job.jobDate}</span>}
        {job.clientName && <span>👤 {job.clientName}</span>}
      </div>
      {job.description && (
        <p style={{fontSize:13, color:'#6c757d', margin:'0 0 10px', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'}}>
          {job.description}
        </p>
      )}
      <div className="flex-between">
        <span style={{fontSize:18, fontWeight:700, color:'#1D9E75'}}>
          {job.budget ? `₹${Number(job.budget).toLocaleString()}` : 'Open to bids'}
        </span>
        {actionLabel && onAction && (
          <button className="btn-g btn-sm" onClick={e => { e.stopPropagation(); onAction(job.id) }}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

function Spinner() { return <span className="spinner"></span> }
function Alert({ type, msg }) {
  if (!msg) return null
  return <div className={`alert alert-${type}`}>{msg}</div>
}

// ═══════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════
function Navbar() {
  const nav  = useNavigate()
  const user = getUser()
  const logout = () => { clearAuth(); nav('/login') }

  return (
    <div className="hnav">
      <a className="brand" href="/">🏠 Homzy</a>
      <div className="links">
        {user ? (
          <>
            <span className="uname">👤 {user.name}</span>
            {user.role === 'CLIENT' && <>
              <Link className="nl" to="/client/home">Home</Link>
              <Link className="nl" to="/client/post-job">Post Job</Link>
              <Link className="nl" to="/client/my-jobs">My Jobs</Link>
            </>}
            {user.role === 'WORKER' && <>
              <Link className="nl" to="/worker/dashboard">Dashboard</Link>
              <Link className="nl" to="/worker/completed">Completed Tasks</Link>
              <Link className="nl" to="/worker/jobs">Job Board</Link>
            </>}
            <button className="nbtn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="nl" to="/login">Login</Link>
            <button className="nbtn" onClick={() => nav('/register')}>Register</button>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════════════════
function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [err,  setErr]  = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [load, setLoad] = useState(false)
  const nav = useNavigate()

  if (loggedIn()) {
    const u = getUser()
    return <Navigate to={u?.role === 'WORKER' ? '/worker/dashboard' : '/client/home'} />
  }

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoad(true)
    try {
      const { data } = await auth.login(form)
      saveAuth(data.token, { name:data.name, email:data.email, role:data.role })
      nav(data.role === 'WORKER' ? '/worker/dashboard' : '/client/home')
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Login failed. Check email and password.')
    } finally { setLoad(false) }
  }

  return (
    <div className="auth-wrap">
      <div style={{width:'100%', maxWidth:420}}>
       <div className="auth-logo">

  <div className="icon">🏠</div>

  <h2>Homzy</h2>

  <p>Book trusted home service workers</p>

</div>

        <div className="auth-card">
          <h5 style={{textAlign:'center', marginBottom:20, fontWeight:700}}>Sign In</h5>
          <Alert type="err" msg={err} />
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@email.com" value={form.email}
                onChange={e => setForm({...form, email:e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{position:'relative'}}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={form.password}
    onChange={e => setForm({...form, password:e.target.value})}
    required
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position:'absolute',
      right:'15px',
      top:'50%',
      transform:'translateY(-50%)',
      cursor:'pointer',
      fontSize:'18px'
    }}
  >
    {showPassword ? '🙈' : '👁️'}
  </span>
</div>
            </div>
            <button type="submit" className="btn-g" style={{width:'100%', marginTop:4}} disabled={load}>
              {load && <Spinner />}{load ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <hr />
          <p style={{textAlign:'center', fontSize:13, color:'#6c757d', margin:0}}>
            No account? <Link to="/register" style={{color:'#1D9E75', fontWeight:600}}>Register here</Link>
          </p>
        </div>

        <p style={{textAlign:'center', fontSize:11, color:'#adb5bd', marginTop:16}}>
          Backend must be running at localhost:8080
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  REGISTER
// ═══════════════════════════════════════════════════════
function Register() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', role:'CLIENT' })
  const [showPassword, setShowPassword] = useState(false)
  const [err,  setErr]  = useState('')
  const [load, setLoad] = useState(false)
  const nav = useNavigate()

  if (loggedIn()) {
    const u = getUser()
    return <Navigate to={u?.role === 'WORKER' ? '/worker/dashboard' : '/client/home'} />
  }

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoad(true)
    try {
      const { data } = await auth.register(form)
      saveAuth(data.token, { name:data.name, email:data.email, role:data.role })
      nav(data.role === 'WORKER' ? '/worker/dashboard' : '/client/home')
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Registration failed.')
    } finally { setLoad(false) }
  }

  return (
    <div className="auth-wrap">
      <div style={{width:'100%', maxWidth:460}}>
        <div className="auth-logo">

  <div className="icon">🏠</div>

  <h2>Homzy</h2>

  <p>Book trusted home service workers</p>

</div>

        <div className="auth-card">
          <h5 style={{textAlign:'center', marginBottom:20, fontWeight:700}}>Create Account</h5>
          <Alert type="err" msg={err} />
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Enter Your Name" value={form.name}
                onChange={e => setForm({...form, name:e.target.value})} required />
            </div>
            <div className="row2">
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="you@email.com" value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input  value={form.phone}
                  onChange={e => setForm({...form, phone:e.target.value})}  maxLength={10} required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
             <div style={{position:'relative'}}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Minimum 6 characters"
    value={form.password}
    onChange={e => setForm({...form, password:e.target.value})}
    required
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position:'absolute',
      right:'15px',
      top:'50%',
      transform:'translateY(-50%)',
      cursor:'pointer'
    }}
  >
    {showPassword ? '🙈' : '👁️'}
  </span>
</div>
            </div>
            <div className="form-group">
              <label>I am a</label>
              <div className="row2">
                {[{v:'CLIENT',icon:'🏠',t:'Client',s:'I need home services'},
                  {v:'WORKER',icon:'👷',t:'Worker',s:'I provide services'}].map(r => (
                  <div key={r.v} onClick={() => setForm({...form, role:r.v})}
                    style={{border:`2px solid ${form.role===r.v?'#1D9E75':'#dee2e6'}`, background:form.role===r.v?'#E1F5EE':'#fff', borderRadius:10, padding:'12px', textAlign:'center', cursor:'pointer', transition:'all 0.2s'}}>
                    <div style={{fontSize:24}}>{r.icon}</div>
                    <div style={{fontWeight:600, fontSize:14, color:form.role===r.v?'#0F6E56':'#212529'}}>{r.t}</div>
                    <div style={{fontSize:11, color:'#6c757d'}}>{r.s}</div>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-g" style={{width:'100%'}} disabled={load}>
              {load && <Spinner />}{load ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <hr />
          <p style={{textAlign:'center', fontSize:13, color:'#6c757d', margin:0}}>
            Already have an account? <Link to="/login" style={{color:'#1D9E75', fontWeight:600}}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  CLIENT HOME
// ═══════════════════════════════════════════════════════
const CATS = [
  {icon:'🔧',label:'Plumbing'},{icon:'🎨',label:'Painting'},
  {icon:'🧹',label:'Cleaning'},{icon:'⚡',label:'Electrical'},
  {icon:'🪵',label:'Carpentry'},{icon:'❄️',label:'AC Service'},
  {icon:'🌿',label:'Gardening'},{icon:'🪟',label:'Tiling'},
]

function ClientHome() {
  const [openJobs, setOpenJobs] = useState([])
  const [myJobs,   setMyJobs]   = useState([])
  const [load,     setLoad]     = useState(true)
  const [err,      setErr]      = useState('')
  const nav  = useNavigate()
  const user = getUser()

  useEffect(() => {
    Promise.all([jobs.all(), jobs.mine()])
      .then(([a, m]) => { setOpenJobs(a.data); setMyJobs(m.data) })
      .catch(() => setErr('Cannot connect to backend. Make sure Spring Boot is running on port 8080.'))
      .finally(() => setLoad(false))
  }, [])

  return (
    <div className="page">
      <div className="banner">
        <div>
          <h4>Hello, {user?.name?.split(' ')[0]} 👋</h4>
          <p>What home service do you need today?</p>
        </div>
        <button className="wbtn" onClick={() => nav('/client/post-job')}>+ Post a Job</button>
      </div>

      <div className="sec-title">Browse Categories</div>
      <div className="cat-grid">
        {CATS.map(c => (
          <div key={c.label} className="cat-item">
            <div className="ci">{c.icon}</div>
            <div className="cn">{c.label}</div>
          </div>
        ))}
      </div>

      <Alert type="err" msg={err} />

      {myJobs.length > 0 && (
        <>
          <div className="flex-between mb-4" style={{marginBottom:12}}>
            <div className="sec-title" style={{margin:0}}>My Active Jobs</div>
            <Link to="/client/my-jobs" style={{color:'#1D9E75', fontSize:13, fontWeight:600}}>View all →</Link>
          </div>
          {myJobs.slice(0,2).map(j => (
            <JobCard key={j.id} job={j} actionLabel="Track" onAction={id => nav(`/client/tracking/${id}`)} />
          ))}
          <div style={{marginBottom:20}}></div>
        </>
      )}

      <div className="flex-between" style={{marginBottom:12}}>
        <div className="sec-title" style={{margin:0}}>Open Jobs Near You</div>
        <span style={{background:'#E1F5EE', color:'#085041', padding:'3px 10px', borderRadius:12, fontSize:12, fontWeight:600}}>
          {openJobs.length} jobs
        </span>
      </div>

      {load ? (
        <div style={{textAlign:'center', padding:'40px 0', color:'#6c757d'}}>
          <div style={{fontSize:32, marginBottom:12}}>⏳</div>
          Loading jobs...
        </div>
      ) : openJobs.length === 0 && !err ? (
        <div style={{textAlign:'center', padding:'40px 0', color:'#6c757d'}}>
          <div style={{fontSize:40, marginBottom:12}}>📋</div>
          No open jobs right now.
          <br />
          <button className="btn-g" style={{marginTop:14}} onClick={() => nav('/client/post-job')}>Post the First Job</button>
        </div>
      ) : (
        openJobs.map(j => <JobCard key={j.id} job={j} />)
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  POST JOB
// ═══════════════════════════════════════════════════════
const CAT_LIST = ['PLUMBING','PAINTING','CLEANING','ELECTRICAL','CARPENTRY','AC_SERVICE','GARDENING','TILING','OTHER']

function PostJob() {
  const [form, setForm] = useState({ title:'', category:'PLUMBING', description:'', budget:'', location:'', jobDate:'' })
  const [err,  setErr]  = useState('')
  const [ok,   setOk]   = useState(false)
  const [load, setLoad] = useState(false)
  const [image, setImage] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
const [showMap, setShowMap] = useState(false)
const [position, setPosition] = useState([13.0827, 80.2707])
  const nav = useNavigate()
  const s = (k,v) => setForm(f => ({...f,[k]:v}))

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoad(true)
    try {
     const data = new FormData()

data.append("title", form.title)
data.append("category", form.category)
data.append("description", form.description)
data.append("budget", form.budget)
data.append("location", form.location)
data.append("jobDate", form.jobDate)

if (image) {
  data.append("image", image)
}

await API.post("/jobs/create-with-image", data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
})
      setOk(true)
      setTimeout(() => nav('/client/my-jobs'), 1500)
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Failed to post job.')
    } finally { setLoad(false) }
  }
const generateDescription = async () => {
  if (!form.title.trim()) {
    alert("Please enter job title first")
    return
  }

  try {
    setAiLoading(true)

    const response = await API.get(
      `/ai/chat?message=${encodeURIComponent(form.title)}`
    )

    s("description", response.data)

  } catch (err) {
    console.log(err.response)
    alert("AI generation failed")
  } finally {
    setAiLoading(false)
  }
}  
const openMapFromAddress = async () => {
  setShowMap(true)

  if (!form.location.trim()) return

  try {
    const searchText = form.location + ", Chennai, Tamil Nadu, India"

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchText)}`
    )

    const data = await res.json()

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat)
      const lon = parseFloat(data[0].lon)

      setPosition([lat, lon])

      s("location", data[0].display_name)
    } else {
      alert("Location not found. Try adding city name.")
    }
  } catch (err) {
    console.error(err)
    alert("Unable to find location")
  }
}
function LocationPicker({ setLocation, setPosition }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng

      setPosition([lat, lng])

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )

        const data = await res.json()

        setLocation(
          data.display_name ||
          `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`
        )
      } catch {
        setLocation(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`)
      }
    }
  })

  return null
}
function MapMoveFix({ position }) {
  const map = useMap()

  useEffect(() => {
    map.setView(position, 16)
    setTimeout(() => {
      map.invalidateSize()
    }, 300)
  }, [position, map])

  return null
}
  return (
    <div className="page-md">
      <div className="flex-center" style={{marginBottom:20}}>
        <button className="btn-gray btn-sm" onClick={() => nav(-1)}>← Back</button>
        <div>
          <h5 style={{margin:0, fontWeight:700}}>Post a New Job</h5>
          <p style={{margin:0, fontSize:13, color:'#6c757d'}}>Workers will see and accept your job</p>
        </div>
      </div>

      {ok  && <Alert type="ok"  msg="✅ Job posted! Redirecting..." />}
      {err && <Alert type="err" msg={err} />}

      <div className="card">
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input placeholder="e.g. Fix bathroom leaking pipe" value={form.title}
              onChange={e => s('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select value={form.category} onChange={e => s('category', e.target.value)}>
              {CAT_LIST.map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
            </select>
          </div>
         <div className="form-group">

    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
        }}
    >
        <label>Description</label>

        <button
            type="button"
            className="btn-out"
            onClick={generateDescription}
            disabled={aiLoading}
        >
            {aiLoading
                ? "Generating..."
                : "✨ Generate with AI"}
        </button>
    </div>

    <textarea
        rows={4}
        placeholder="Describe the problem clearly..."
        value={form.description}
        onChange={e => s('description', e.target.value)}
    />

</div>
                   <div className="form-group">
  <label>Job Photo</label>
  <input
    type="file"
    accept="image/*"
    onChange={e => setImage(e.target.files[0])}
  />
</div>
          <div className="row2">
            <div className="form-group">
              <label>Budget (₹)</label>
              <input type="number" placeholder="e.g. 1500" value={form.budget}
                onChange={e => s('budget', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Preferred Date</label>
              <input type="date" value={form.jobDate}
                onChange={e => s('jobDate', e.target.value)} />
            </div>
          </div>
<div className="form-group">
  <label>Location / Area</label>

  <div className="location-input-box">
    <input
      placeholder="e.g. Pammal, Chennai"
      value={form.location}
      onChange={e => s('location', e.target.value)}
    />

    <button type="button" onClick={openMapFromAddress}>
      📍
    </button>
  </div>
</div>

{showMap && (
  <div className="map-modal">
    <div className="map-box">
      <div className="map-head">
        <h3>Select Exact Location</h3>
        <button type="button" onClick={() => setShowMap(false)}>✕</button>
      </div>

     <MapContainer
  center={position}
  zoom={15}
  scrollWheelZoom={true}
  dragging={true}
  touchZoom={true}
  doubleClickZoom={true}
  style={{
    height: '320px',
    width: '100%',
    borderRadius: '16px',
    cursor: 'grab'
  }}
>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position} />
         <MapMoveFix position={position} />
        <LocationPicker
          setPosition={setPosition}
          setLocation={loc => {
            s('location', loc)
            setShowMap(false)
          }}
        />
      </MapContainer>

      <p style={{fontSize:12, color:'#64748b'}}>
        Click on map to select exact address
      </p>
    </div>
  </div>
)}
          <div style={{display:'flex', gap:10, marginTop:8}}>
            <button type="button" className="btn-gray" style={{flex:1}} onClick={() => nav(-1)}>Cancel</button>
            <button type="submit" className="btn-g" style={{flex:2}} disabled={load}>
              {load && <Spinner />}{load ? 'Posting...' : '📤 Post Job'}
            </button>
          </div>
 
        </form>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  MY JOBS
// ═══════════════════════════════════════════════════════
function MyJobs() {
  const [list, setList] = useState([])
  const [load, setLoad] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    jobs.mine().then(r => setList(r.data)).finally(() => setLoad(false))
  }, [])

  return (
    <div className="page">
      <div className="flex-between" style={{marginBottom:20}}>
        <div>
          <h5 style={{margin:0, fontWeight:700}}>My Jobs</h5>
          <p style={{margin:0, fontSize:13, color:'#6c757d'}}>All jobs you have posted</p>
        </div>
        <button className="btn-g btn-sm" onClick={() => nav('/client/post-job')}>+ Post New Job</button>
      </div>

      {load ? (
        <div style={{textAlign:'center', padding:40, color:'#6c757d'}}>⏳ Loading...</div>
      ) : list.length === 0 ? (
        <div style={{textAlign:'center', padding:40}}>
          <div style={{fontSize:40, marginBottom:12}}>📭</div>
          <p style={{color:'#6c757d'}}>No jobs posted yet.</p>
          <button className="btn-g" onClick={() => nav('/client/post-job')}>Post Your First Job</button>
        </div>
      ) : (
       list.map(j => (
  <div key={j.id}>
    <JobCard
      job={j}
      actionLabel={j.status !== 'COMPLETED' && j.status !== 'CANCELLED' ? 'Track' : null}
      onAction={id => nav(`/client/tracking/${id}`)}
    />

    {j.status === 'OPEN' && (
      <button
        className="btn-red"
        style={{marginBottom:16}}
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this job?")) {
            jobs.cancel(j.id).then(() => {
              setList(list.filter(item => item.id !== j.id))
            })
          }
        }}
      >
        Delete Job
      </button>
    )}
  </div>
))
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  JOB DETAIL
// ═══════════════════════════════════════════════════════
function JobDetail() {
  const { id } = useParams()
  const [job,  setJob]  = useState(null)
  const [load, setLoad] = useState(true)
  const nav  = useNavigate()
  const user = getUser()

  useEffect(() => {
    jobs.byId(id).then(r => setJob(r.data)).finally(() => setLoad(false))
  }, [id])

  if (load) return <div style={{textAlign:'center',padding:60}}>⏳ Loading...</div>
  if (!job)  return <div style={{textAlign:'center',padding:60}}>Job not found.</div>

  return (
    <div className="page-md">
      <div className="flex-center" style={{marginBottom:20}}>
        <button className="btn-gray btn-sm" onClick={() => nav(-1)}>← Back</button>
        <h5 style={{margin:0, fontWeight:700}}>Job Details</h5>
      </div>
      <div className="card">
        <div className="flex-between mb-4">
          <h5 style={{margin:0, fontWeight:700}}>{job.title}</h5>
          <span className={`badge badge-${job.status}`}>{job.status?.replace('_',' ')}</span>
        </div>
        <div style={{display:'flex', gap:16, flexWrap:'wrap', fontSize:13, color:'#6c757d', marginBottom:16}}>
          <span>{ICONS[job.category] || '🛠️'} {job.category?.replace('_',' ')}</span>
          {job.location   && <span>📍 {job.location}</span>}
          {job.jobDate    && <span>📅 {job.jobDate}</span>}
          {job.imageUrl && (
  <img
    src={`http://localhost:8080${job.imageUrl}`}
    alt="Job"
    style={{
      width:'100%',
      maxHeight:'300px',
      objectFit:'cover',
      borderRadius:'18px',
      margin:'18px 0'
    }}
  />
)}
          {job.clientName && <span>👤 Client: {job.clientName}</span>}
          {job.workerName && <span>👷 Worker: {job.workerName}</span>}
        </div>
        {job.description && <p style={{fontSize:14, color:'#495057', lineHeight:1.6}}>{job.description}</p>}
        <hr />
        <div className="flex-between">
          <div>
            <div style={{fontSize:12, color:'#6c757d'}}>Budget</div>
            <div style={{fontSize:22, fontWeight:700, color:'#1D9E75'}}>₹{Number(job.budget||0).toLocaleString()}</div>
          </div>
          {user?.role === 'CLIENT' && job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
            <button className="btn-g btn-sm" onClick={() => nav(`/client/tracking/${job.id}`)}>Track Job</button>
          )}
          {user?.role === 'WORKER' && job.status === 'OPEN' && (
            <button className="btn-g btn-sm" onClick={async () => {
              await jobs.status(job.id, 'ACCEPTED')
              nav('/worker/jobs')
            }}
            >Accept Job</button>
          )}
        </div>
        {job.workerName && (
          <div style={{marginTop:12}}>
            <button className="btn-out btn-sm" onClick={() => nav(`/chat/${job.id}`)}>💬 Open Chat</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  JOB TRACKING
// ═══════════════════════════════════════════════════════
const STEPS = [
  {key:'OPEN',        icon:'📤', label:'Job Posted',      sub:'Your job is live'},
  {key:'ACCEPTED',    icon:'✅', label:'Worker Accepted',  sub:'A worker took your job'},
  {key:'IN_PROGRESS', icon:'🔨', label:'Work In Progress', sub:'Worker is working'},
  {key:'COMPLETED',   icon:'🎉', label:'Job Completed',    sub:'Payment released'},
]
const STEP_ORDER = ['OPEN','ACCEPTED','IN_PROGRESS','COMPLETED']

function JobTracking() {
  const { id } = useParams()
  const [job,  setJob]  = useState(null)
  const [load, setLoad] = useState(true)
  const nav = useNavigate()
  const [paymentDone, setPaymentDone] = useState(false)

  const reload = () => jobs.byId(id).then(r => {
  setJob(r.data)
  setPaymentDone(isPaymentDone(id))
})

  useEffect(() => {
    reload().finally(() => setLoad(false))
    const t = setInterval(reload, 8000)
    return () => clearInterval(t)
  }, [id])

  if (load) return <div style={{textAlign:'center',padding:60}}>⏳ Loading...</div>
  if (!job)  return <div style={{textAlign:'center',padding:60}}>Job not found.</div>

  const curIdx = STEP_ORDER.indexOf(job.status)
  const confirmPayment = () => {
  savePaymentDone(id)
  setPaymentDone(true)
}

  return (
    <div className="page-md">
      <div className="flex-center" style={{marginBottom:20}}>
        <button className="btn-gray btn-sm" onClick={() => nav(-1)}>← Back</button>
        <h5 style={{margin:0, fontWeight:700}}>Job Tracking</h5>
      </div>

      <div className="card" style={{marginBottom:12}}>
        <div className="flex-between mb-4">
          <div>
            <div style={{fontWeight:700, fontSize:16}}>{job.title}</div>
            {job.location && <div style={{fontSize:13, color:'#6c757d', marginTop:3}}>📍 {job.location}</div>}
          </div>
          <span className={`badge badge-${job.status}`}>{job.status?.replace('_',' ')}</span>
        </div>

        {job.workerName && (
          <div style={{display:'flex', alignItems:'center', gap:12, background:'#E1F5EE', borderRadius:10, padding:'12px 14px', marginBottom:16}}>
            <div className="avatar">{job.workerName.charAt(0)}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600}}>{job.workerName}</div>
              <div style={{fontSize:12, color:'#6c757d'}}>⭐ Assigned Worker</div>
            </div>
            <button className="btn-g btn-sm" onClick={() => nav(`/chat/${job.id}`)}>💬 Chat</button>
          </div>
        )}

        <ul className="stepper">
          {STEPS.map((step, idx) => {
            const done   = idx < curIdx
            const active = idx === curIdx
            const last   = idx === STEPS.length - 1
            return (
              <li key={step.key}>
                <div className="step-left">
                  <div className={`step-dot ${done?'done':active?'active':'pending'}`}>
                    {done ? '✓' : step.icon}
                  </div>
                  {!last && <div className={`step-line ${done?'done':''}`}></div>}
                </div>
                <div className="step-right">
                  <div className="step-title" style={{color: active?'#1D9E75': done?'#212529':'#adb5bd'}}>
                    {step.label}
                  </div>
                  <div className="step-sub">
                    {done ? '✓ Done' : active ? '⏳ ' + step.sub : step.sub}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

   <div className="payment-card">

  <div>
    <p>Service Amount</p>
    <h2>₹{Number(job.budget || 0).toLocaleString()}</h2>
  </div>

  {job.status === 'COMPLETED' ? (
    paymentDone ? (
      <div className="payment-success">
        ✅ Payment Confirmed
      </div>
    ) : (
      <button className="btn-g" onClick={confirmPayment}>
        Confirm Payment
      </button>
    )
  ) : (
    <span className="payment-pending">
      Payment available after job completed
    </span>
  )}

</div>

      <p style={{textAlign:'center', fontSize:11, color:'#adb5bd', marginTop:10}}>Auto-refreshes every 8 seconds</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  WORKER DASHBOARD
// ═══════════════════════════════════════════════════════
function WorkerDashboard() {
  const [list, setList] = useState([])
  const [load, setLoad] = useState(true)
  const [msg, setMsg] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const nav = useNavigate()
  const user = getUser()

  const reload = () => {
    jobs.workerJobs()
      .then(r => setList(r.data))
      .finally(() => setLoad(false))
  }

  useEffect(() => {
    reload()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await jobs.status(id, status)
      setMsg(`✅ Job marked as ${status.replace('_', ' ')}`)
      reload()
      setTimeout(() => setMsg(''), 2500)
    } catch {
      setMsg('❌ Failed to update job status')
    }
  }

  const filteredJobs = list.filter(job => {
    const statusOk = statusFilter === 'ALL' || job.status === statusFilter
    const dateOk = !dateFilter || job.jobDate === dateFilter
    return statusOk && dateOk
  })

  const accepted = list.filter(j => j.status === 'ACCEPTED').length
  const progress = list.filter(j => j.status === 'IN_PROGRESS').length
  const completed = list.filter(j => j.status === 'COMPLETED').length
  const activeJobs = filteredJobs.filter(j => j.status !== 'COMPLETED')
  return (
    <div className="page worker-page">

      <div className="worker-hero">
        <div>
          <h2>Welcome, {user?.name?.split(' ')[0]} 👷</h2>
          <p>Manage assigned jobs, chat with clients, and complete your tasks.</p>
        </div>

        <button className="btn-g" onClick={() => nav('/worker/jobs')}>
          Browse Jobs
        </button>
      </div>

      <div className="worker-stats-grid">
        <div className="worker-stat-card">
          <h3>{list.length}</h3>
          <p>Total Jobs</p>
        </div>

        <div className="worker-stat-card">
          <h3>{accepted}</h3>
          <p>Accepted</p>
        </div>

        <div className="worker-stat-card">
          <h3>{progress}</h3>
          <p>In Progress</p>
        </div>

        <div className="worker-stat-card">
          <h3>{completed}</h3>
          <p>Completed</p>
        </div>
      </div>

      {msg && <Alert type="ok" msg={msg} />}

      <div className="worker-filter-box">
        <div>
          <label>Status Filter</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label>Date Filter</label>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>

        <button
          className="btn-gray"
          onClick={() => {
            setStatusFilter('ALL')
            setDateFilter('')
          }}
        >
          Clear
        </button>
      </div>

      <div className="dash-head">
        <h3>My Assigned Jobs</h3>
        <p>Track jobs date wise and status wise</p>
      </div>

      {load ? (
        <div className="empty-box">⏳ Loading jobs...</div>
      ) : activeJobs.length === 0 ? (
        <div className="empty-box">
          <div style={{fontSize:40}}>📭</div>
          <p>No assigned jobs found.</p>
          <button className="btn-g" onClick={() => nav('/worker/jobs')}>
            Find Jobs
          </button>
        </div>
      ) : (
       activeJobs.map(job => (
          <div className="worker-job-card" key={job.id}>

            <div className="worker-job-top">
              <div>
                <h4>{job.title}</h4>
                <p>
                  {ICONS[job.category] || '🛠️'} {job.category?.replace('_', ' ')}
                  {' '} • 📍 {job.location || 'No location'}
                  {' '} • 📅 {job.jobDate || 'No date'}
                </p>
              </div>

              <span className={`badge badge-${job.status}`}>
                {job.status?.replace('_', ' ')}
              </span>
            </div>

            <p className="worker-job-desc">
              {job.description || 'No description added'}
            </p>

            <div className="worker-job-bottom">
              <h4>₹{Number(job.budget || 0).toLocaleString()}</h4>

              <div className="worker-actions">
                {job.status === 'ACCEPTED' && (
                  <button
                    className="btn-out btn-sm"
                    onClick={() => updateStatus(job.id, 'IN_PROGRESS')}
                  >
                    Start Work
                  </button>
                )}

                {job.status === 'IN_PROGRESS' && (
                  <button
                    className="btn-g btn-sm"
                    onClick={() => updateStatus(job.id, 'COMPLETED')}
                  >
                    Complete Task
                  </button>
                )}

                <button className="btn-out btn-sm" onClick={() => nav(`/chat/${job.id}`)}>
                  Message
                </button>

                <button className="btn-gray btn-sm" onClick={() => nav(`/jobs/${job.id}`)}>
                  Details
                </button>
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  )
}
// ═══════════════════════════════════════════════════════
//  WORKER JOB BOARD
// ═══════════════════════════════════════════════════════
function WorkerJobBoard() {
  const [list, setList] = useState([])
  const [load, setLoad] = useState(true)
  const [msg,  setMsg]  = useState('')
  const [category, setCategory] = useState('ALL')
    const displayJobs = category === 'ALL'
    ? list
    : list.filter(j => j.category === category)

const reload = () => {
  if (category === 'ALL') {
    return jobs.all().then(r => setList(r.data))
  }

  return jobs.filter(category).then(r => setList(r.data))
}

useEffect(() => {
  setLoad(true)

  if (category === 'ALL') {
    jobs.all()
      .then(r => setList(r.data))
      .finally(() => setLoad(false))
  } else {
    jobs.filter(category)
      .then(r => setList(r.data))
      .finally(() => setLoad(false))
  }
}, [category])
  const accept = async id => {
    try {
      await jobs.status(id, 'ACCEPTED')
      setMsg('✅ Job accepted successfully!')
      await reload()
      setTimeout(() => setMsg(''), 3000)
    } catch (ex) {
      setMsg('❌ ' + (ex.response?.data?.error || 'Failed to accept job.'))
    }
  }

  return (
    <div className="page">
      <div style={{marginBottom:20}}>
        <h5 style={{margin:0, fontWeight:700}}>Job Board</h5>
        <p style={{margin:'4px 0 0', fontSize:13, color:'#6c757d'}}>All open jobs — click Accept to start working</p>
      </div>
      <div className="form-group" style={{maxWidth:260}}>
  <label>Filter Jobs</label>

  <select value={category} onChange={e => setCategory(e.target.value)}>
    <option value="ALL">All Jobs</option>
    <option value="PLUMBING">Plumbing</option>
    <option value="PAINTING">Painting</option>
    <option value="CLEANING">Cleaning</option>
    <option value="ELECTRICAL">Electrical</option>
    <option value="CARPENTRY">Carpentry</option>
    <option value="AC_SERVICE">AC Service</option>
    <option value="GARDENING">Gardening</option>
    <option value="TILING">Tiling</option>
    <option value="OTHER">Other</option>
  </select>
</div>

      {msg && <Alert type="ok" msg={msg} />}

      {load ? (
        <div style={{textAlign:'center', padding:40, color:'#6c757d'}}>⏳ Loading jobs...</div>
      ) : list.length === 0 ? (
        <div style={{textAlign:'center', padding:40}}>
          <div style={{fontSize:40, marginBottom:12}}>📋</div>
          <p style={{color:'#6c757d'}}>No open jobs right now. Check back soon!</p>
        </div>
      ) : (
        displayJobs.map(j => <JobCard key={j.id} job={j} actionLabel="Accept Job" onAction={accept} />)
      )}
    </div>
  )
}
// ═══════════════════════════════════════════════════════
//  completed task
// ═══════════════════════════════════════════════════════

function CompletedTasks() {
  const [list, setList] = useState([])
  const [load, setLoad] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    jobs.workerJobs()
      .then(r => setList(r.data))
      .finally(() => setLoad(false))
  }, [])

  const completedJobs = list.filter(j => j.status === 'COMPLETED')

  return (
    <div className="page worker-page">

      <div className="job-board-head">
        <div>
          <h2>Completed Tasks</h2>
          <p>All jobs successfully completed by you.</p>
        </div>

        <button className="btn-out" onClick={() => nav('/worker/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {load ? (
        <div className="empty-box">⏳ Loading completed tasks...</div>
      ) : completedJobs.length === 0 ? (
        <div className="empty-box">
          <div style={{fontSize:42}}>📭</div>
          <h3>No completed tasks yet</h3>
          <p>Completed jobs will appear here.</p>
        </div>
      ) : (
        completedJobs.map(job => (
          <div className="worker-job-card" key={job.id}>

            <div className="worker-job-top">
              <div>
                <h3>{job.title}</h3>
                <p>
                  {ICONS[job.category] || '🛠️'} {job.category?.replace('_', ' ')}
                  {' '} • 📍 {job.location || 'No location'}
                  {' '} • 📅 {job.jobDate || 'No date'}
                  {' '} • 👤 {job.clientName || 'Client'}
                </p>
              </div>

              <span className="badge badge-COMPLETED">
                COMPLETED
              </span>
            </div>

            {job.imageUrl && (
              <img
                src={`http://localhost:8080${job.imageUrl}`}
                alt="Job"
                style={{
                  width:'100%',
                  maxHeight:'260px',
                  objectFit:'cover',
                  borderRadius:'18px',
                  margin:'18px 0'
                }}
              />
            )}

            <p className="worker-job-desc">
              {job.description || 'No description added'}
            </p>

            <div className="worker-job-bottom">
              <h4>₹{Number(job.budget || 0).toLocaleString()}</h4>

              <div className="worker-actions">
                <button
                  className="btn-out btn-sm"
                  onClick={() => nav(`/chat/${job.id}`)}
                >
                  Message
                </button>

                <button
                  className="btn-gray btn-sm"
                  onClick={() => nav(`/jobs/${job.id}`)}
                >
                  Details
                </button>
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  CHAT
// ═══════════════════════════════════════════════════════
function Chat() {
  const { jobId } = useParams()
  const [job,   setJob]   = useState(null)
  const [msgs,  setMsgs]  = useState([])
  const [input, setInput] = useState('')
  const [newMsg, setNewMsg] = useState(false)
  const [send,  setSend]  = useState(false)
  const user   = getUser()
  const nav    = useNavigate()
  const bottom = useRef(null)

  const loadMsgs = () => {
  chat.get(jobId).then(r => {
    if (msgs.length > 0 && r.data.length > msgs.length) {
      setNewMsg(true)
    }

    setMsgs(r.data)
  }).catch(() => {})
}

  useEffect(() => {
    jobs.byId(jobId).then(r => setJob(r.data))
    loadMsgs()
    const t = setInterval(loadMsgs, 5000)
    return () => clearInterval(t)
  }, [jobId])

  useEffect(() => { bottom.current?.scrollIntoView({behavior:'smooth'}) }, [msgs])

  const sendMsg = async () => {
    if (!input.trim()) return
    setSend(true)
    try {
      await chat.send({ jobId: Number(jobId), content: input.trim() })
      setInput(''); await loadMsgs()
    } catch { alert('Failed to send message.') }
    finally { setSend(false) }
  }

  return (
    <div className="page-md">
      <div className="flex-center" style={{marginBottom:16}}>
        <button className="btn-gray btn-sm" onClick={() => nav(-1)}>← Back</button>
        <div>
          <div style={{fontWeight:600}}>{job?.workerName || job?.clientName || 'Chat'}</div>
          <div style={{fontSize:12, color:'#6c757d'}}>{job?.title}</div>
        </div>
        <div style={{marginLeft:'auto', background:'#E1F5EE', color:'#085041', padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:600}}>
          🔄 Live
        </div>
      </div>
      {newMsg && (
  <div className="alert alert-info" onClick={() => setNewMsg(false)}>
    💬 New message received
  </div>
)}

      <div className="card" style={{padding:0, marginBottom:12, overflow:'hidden'}}>
        <div className="chat-area">
          {msgs.length === 0 ? (
            <div style={{textAlign:'center', color:'#adb5bd', padding:'40px 0'}}>
              <div style={{fontSize:32, marginBottom:8}}>💬</div>
              No messages yet. Start the conversation!
            </div>
          ) : msgs.map((m, i) => {
            const isMe = m.sender === user?.name
            return (
              <div key={i} style={{display:'flex', flexDirection:'column', alignItems: isMe?'flex-end':'flex-start'}}>
                {!isMe && <div className="bubble-name">{m.sender}</div>}
                <div className={`bubble ${isMe?'bubble-me':'bubble-other'}`}>{m.content}</div>
                <div className="bubble-time" style={{textAlign:isMe?'right':'left'}}>
                  {m.sentAt ? new Date(m.sentAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : ''}
                </div>
              </div>
            )
          })}
          <div ref={bottom}></div>
        </div>
      </div>

      <div style={{display:'flex', gap:8}}>
        <input
          style={{flex:1, padding:'10px 14px', border:'1.5px solid #dee2e6', borderRadius:8, fontSize:14, outline:'none'}}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendMsg()}
        />
        <button className="btn-g" onClick={sendMsg} disabled={send || !input.trim()}>
          {send ? <Spinner /> : '📤'}
        </button>
      </div>
      <p style={{fontSize:11, color:'#adb5bd', marginTop:8, textAlign:'center'}}>Refreshes every 5 seconds</p>
    </div>
  )
}


// ═══════════════════════════════════════════════════════
//  PUBLIC LANDING PAGE
// ═══════════════════════════════════════════════════════
function LandingHome() {
  const nav = useNavigate()
  const services = [
    { icon:'🔧', title:'Plumbing', text:'Leak repair, pipe fitting and bathroom service.' },
    { icon:'⚡', title:'Electrical', text:'Switch, wiring, fan and full electrical support.' },
    { icon:'🧹', title:'Cleaning', text:'Deep cleaning for home, kitchen and bathroom.' },
    { icon:'🎨', title:'Painting', text:'Interior and exterior painting by skilled workers.' },
  ]

  return (
    <div className="landing">
      <section className="hero-wrap">
        <div className="hero-grid">
          <div>
            <div className="pill">✨ Trusted Home Service Platform</div>
            <h1 className="hero-title">
              Book Skilled <span>Home Workers</span> Near You
            </h1>
            <p className="hero-text">
              Homzy helps customers post service jobs and lets verified workers accept them instantly. Fast booking, live tracking and simple communication in one place.
            </p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => nav('/register')}>Get Started</button>
              <button className="secondary-btn" onClick={() => nav('/login')}>Login</button>
            </div>
            <div className="stats-row">
              <div className="mini-stat"><b>24/7</b><p>Service support</p></div>
              <div className="mini-stat"><b>8+</b><p>Categories</p></div>
              <div className="mini-stat"><b>Live</b><p>Job tracking</p></div>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-img">
               <img src={workerImg} alt="worker" />
            </div>
            <div className="float-card">✅ Verified Workers</div>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-head">
          <h2>Popular Services</h2>
          <p>Clean professional services for every home need.</p>
        </div>
        <div className="service-grid-pro">
          {services.map(s => (
            <div className="service-pro" key={s.title}>
              <div className="ico">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-pro">
        <h2>Ready to use Homzy?</h2>
        <p>Create an account as a customer or worker and start using the platform.</p>
        <button className="secondary-btn" onClick={() => nav('/register')}>Create Account</button>
      </section>
      <footer className="footer">

  <div className="footer-container">

    <div className="footer-box">
      <h2>🏠 Homzy</h2>

      <p>
        Trusted home service platform for plumbing,
        cleaning, electrical and more.
      </p>
    </div>


    <div className="footer-box">
      <h3>Quick Links</h3>

      <a href="/">Home</a>
      <a href="/">Services</a>
      <a href="/">Workers</a>
      <a href="/">About</a>
    </div>


    <div className="footer-box">
      <h3>Services</h3>

      <a href="/">Plumbing</a>
      <a href="/">Cleaning</a>
      <a href="/">Painting</a>
      <a href="/">Electrical</a>
    </div>


    <div className="footer-box">
      <h3>Contact</h3>

      <p>📍 Chennai, India</p>
      <p>📞 +91 9876543210</p>
      <p>📧 support@homzy.com</p>
    </div>

  </div>


  <div className="footer-bottom">
    © 2026 Homzy. All Rights Reserved.
  </div>

</footer>

    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  GUARDS & ROUTER
// ═══════════════════════════════════════════════════════
function Guard({ children, role }) {
  if (!loggedIn()) return <Navigate to="/login" replace />
  const u = getUser()
  if (role && u?.role !== role) {
    return <Navigate to={u?.role==='WORKER'?'/worker/dashboard':'/client/home'} replace />
  }
  return children
}

function Root() {
  if (!loggedIn()) return <LandingHome />
  const u = getUser()
  return <Navigate to={u?.role==='WORKER'?'/worker/dashboard':'/client/home'} replace />
}

// ═══════════════════════════════════════════════════════
//  APP
// ═══════════════════════════════════════════════════════
export default function App() {
  return (
    <>
      <style>{css}</style>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                    element={<Root />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/register"            element={<Register />} />

          <Route path="/client/home"         element={<Guard role="CLIENT"><ClientHome /></Guard>} />
          <Route path="/client/post-job"     element={<Guard role="CLIENT"><PostJob /></Guard>} />
          <Route path="/client/my-jobs"      element={<Guard role="CLIENT"><MyJobs /></Guard>} />
          <Route path="/client/tracking/:id" element={<Guard role="CLIENT"><JobTracking /></Guard>} />

          <Route path="/worker/dashboard"    element={<Guard role="WORKER"><WorkerDashboard /></Guard>} />
          <Route path="/worker/jobs"         element={<Guard role="WORKER"><WorkerJobBoard /></Guard>} />
          <Route
  path="/worker/completed"
  element={
    <Guard role="WORKER">
      <CompletedTasks />
    </Guard>
  }
/>

          <Route path="/jobs/:id"            element={<Guard><JobDetail /></Guard>} />
          <Route path="/chat/:jobId"         element={<Guard><Chat /></Guard>} />

          <Route path="*"                    element={<Root />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
