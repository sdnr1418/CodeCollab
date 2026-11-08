import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import { loginUser } from './authSlice'

// An input with an icon on the left (and optionally something on the right, like the eye button)
function IconField({ icon: Icon, right, ...props }) {
  return (
    <div className="relative flex items-center">
      <Icon size={16} className="pointer-events-none absolute left-3 text-gray-500" />
      <input
        className="h-10 w-full rounded-md border border-gray-700 bg-gray-800 pr-10 pl-9 text-sm text-gray-100 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
        {...props}
      />
      {right && <div className="absolute right-2 flex">{right}</div>}
    </div>
  )
}

function LoginForm() {
  // Pre-filled with a demo account so the examiner can log in with one click
  const [form, setForm] = useState({ email: 'moiz@example.com', password: 'password123' })
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [joinAfter, setJoinAfter] = useState(false) // which button was pressed
  const { status, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = status === 'loading'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const logIn = async (thenJoin) => {
    setJoinAfter(thenJoin)
    const result = await dispatch(loginUser({ ...form, remember }))
    if (loginUser.fulfilled.match(result)) {
      // The dashboard opens the Join room pop-up when it receives openJoin
      navigate('/dashboard', { state: { openJoin: thenJoin } })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    logIn(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm text-gray-400">
        Email
        <IconField
          icon={Mail}
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@university.edu"
          required
        />
      </label>

      <div className="flex flex-col gap-1.5 text-sm text-gray-400">
        <div className="flex items-center justify-between">
          <label htmlFor="password">Password</label>
          <button
            type="button"
            onClick={() => toast('Password reset comes with the backend in Phase 2')}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            Forgot password?
          </button>
        </div>
        <IconField
          icon={Lock}
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
          right={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="rounded p-1 text-gray-500 hover:text-gray-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 accent-indigo-600"
        />
        Keep me logged in
      </label>

      {error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading && !joinAfter} disabled={loading}>
        Log in {!(loading && !joinAfter) && <ArrowRight size={16} />}
      </Button>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="h-px flex-1 bg-gray-800" />
        Have an invite code?
        <span className="h-px flex-1 bg-gray-800" />
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={() => logIn(true)}
        loading={loading && joinAfter}
        disabled={loading}
      >
        {!(loading && joinAfter) && <LogIn size={16} />} Log in and join a room
      </Button>

      <p className="mt-2 text-sm text-gray-400">
        No account?{' '}
        <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
          Create one
        </Link>
      </p>
    </form>
  )
}

export default LoginForm