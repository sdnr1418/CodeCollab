import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { loginUser } from './authSlice'

function LoginForm() {
  const [form, setForm] = useState({ email: 'moiz@example.com', password: 'password123' })
  const { status, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="rounded-md bg-gray-800 px-3 py-2"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="rounded-md bg-gray-800 px-3 py-2"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Signing in…' : 'Log in'}
      </Button>
    </form>
  )
}

export default LoginForm