import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Navbar from '../components/Navbar'
import { Login, Register } from '../pages/Auth'
import ClientHome from '../pages/client/Home'
import PostJob from '../pages/client/PostJob'
import JobTracking from '../pages/client/JobTracking'
import { WorkerJobBoard, WorkerDashboard } from '../pages/worker/WorkerPages'
import Chat from '../pages/Chat'

// Route guard
function PrivateRoute({ children, role }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function AppRouter() {
  const { user } = useAuthStore()

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client routes */}
        <Route path="/client/home" element={
          <PrivateRoute role="CLIENT"><ClientHome /></PrivateRoute>
        }/>
        <Route path="/client/post-job" element={
          <PrivateRoute role="CLIENT"><PostJob /></PrivateRoute>
        }/>
        <Route path="/client/tracking/:id" element={
          <PrivateRoute role="CLIENT"><JobTracking /></PrivateRoute>
        }/>

        {/* Worker routes */}
        <Route path="/worker/dashboard" element={
          <PrivateRoute role="WORKER"><WorkerDashboard /></PrivateRoute>
        }/>
        <Route path="/worker/board" element={
          <PrivateRoute role="WORKER"><WorkerJobBoard /></PrivateRoute>
        }/>

        {/* Shared */}
        <Route path="/chat/:jobId" element={
          <PrivateRoute><Chat /></PrivateRoute>
        }/>

        {/* Default redirect */}
        <Route path="/" element={
          user
            ? <Navigate to={user.role === 'WORKER' ? '/worker/dashboard' : '/client/home'} />
            : <Navigate to="/login" />
        }/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
