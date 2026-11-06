import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Code2 } from 'lucide-react'
import { logout } from '../../features/auth/authSlice'

function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="flex h-12 items-center justify-between border-b border-gray-800 bg-gray-900 px-4">
      <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-semibold">
        <Code2 size={20} className="text-indigo-400" /> CodeCollab
      </Link>
      {user ? (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">{user.name}</span>
          <button onClick={handleLogout} className="text-gray-300 hover:text-white">
            Log out
          </button>
        </div>
      ) : (
        <Link to="/login" className="text-sm text-gray-300 hover:text-white">
          Log in
        </Link>
      )}
    </nav>
  )
}

export default Navbar