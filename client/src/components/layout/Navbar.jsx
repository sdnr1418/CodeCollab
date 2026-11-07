import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Code2, LogOut } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { logout } from '../../features/auth/authSlice'

export function Logo() {
  return (
    <span className="flex items-center gap-2 font-semibold">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
        <Code2 size={16} className="text-white" />
      </span>
      CodeCollab
    </span>
  )
}

function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="flex h-14 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-950 px-6">
      <Link to={user ? '/dashboard' : '/'}>
        <Logo />
      </Link>
      {user ? (
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2 font-medium">
            <Avatar user={user} size="md" />
            <span className="hidden sm:inline">{user.name}</span>
          </span>
          <span className="h-5 w-px bg-gray-800" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white"
          >
            <LogOut size={14} /> Log out
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