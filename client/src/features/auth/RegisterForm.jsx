import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { registerUser } from './authSlice'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Returns an object of error messages; empty object = form is valid
function validate({ name, email, password, confirm }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Enter your full name'
  if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address'
  if (password.length < 6) errors.password = 'Use at least 6 characters'
  if (confirm !== password) errors.confirm = "Passwords don't match"
  return errors
}

function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [touched, setTouched] = useState({}) // fields the user has left, so errors don't show too early
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const errors = validate(form)
  const showError = (field) => (touched[field] ? errors[field] : undefined)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setServerError('')
  }

  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirm: true })
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    try {
      const { user } = await dispatch(
        registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password }),
      ).unwrap()
      toast.success(`Welcome to CodeCollab, ${user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm text-gray-400">
        Full name
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Abdul Moiz"
          autoComplete="name"
          error={showError('name')}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-gray-400">
        Email
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="you@university.edu"
          autoComplete="email"
          error={showError('email')}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-gray-400">
        Password
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          error={showError('password')}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-gray-400">
        Confirm password
        <Input
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          error={showError('confirm')}
        />
      </label>
      {serverError && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={loading} className="mt-2">
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}

export default RegisterForm