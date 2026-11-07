import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

// Sends signed-out users to /login. Wraps every page that needs an account.
function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user)
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute