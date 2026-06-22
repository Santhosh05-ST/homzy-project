import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const dashboardLink = user?.role === 'WORKER' ? '/worker/dashboard' : '/client/home'

  return (
    <nav className="navbar navbar-expand-lg homzy-navbar px-3">
      <Link className="navbar-brand" to={dashboardLink}>
        <i className="bi bi-house-heart-fill me-2"></i>Homzy
      </Link>

      <button className="navbar-toggler" type="button"
        data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav ms-auto align-items-center gap-2">
          {user ? (
            <>
              <li className="nav-item">
                <span className="text-white-50 small me-2">
                  <i className="bi bi-person-circle me-1"></i>{user.name}
                  <span className="badge bg-light text-dark ms-2" style={{fontSize:'10px'}}>
                    {user.role}
                  </span>
                </span>
              </li>
              {user.role === 'WORKER' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/worker/board">
                    <i className="bi bi-clipboard-list me-1"></i>Job Board
                  </Link>
                </li>
              )}
              {user.role === 'CLIENT' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/client/post-job">
                    <i className="bi bi-plus-circle me-1"></i>Post Job
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-sm btn-light" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-sm btn-light" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
