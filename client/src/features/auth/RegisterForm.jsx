import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, CheckCircle2, Circle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import { registerUser } from './authSlice'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The four password checks shown under the field. Only the first one is required;
// the others make the password stronger and fill more of the strength bar.
const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
  { label: 'Upper and lower case', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: 'A symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
]

// Colour of the strength bar for 1, 2, 3 or 4 rules met
const STRENGTH_COLORS = ['bg-red-500', 'bg-amber-400', 'bg-lime-400', 'bg-green-500']

// Returns an object of error messages; an empty object means the form is valid
function validate({ name, email, password }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Enter your full name'
  if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address'
  if (!PASSWORD_RULES[0].test(password)) errors.password = 'Use at least 8 characters'
  return errors
}

const inputClass = (error) =>
  `h-10 w-full rounded-md border bg-gray-800 px-3 text-sm text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:outline-none ${
    error
      ? 'border-red-500/60 focus:ring-red-500/30'
      : 'border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/30'
  }`

function PasswordStrength({ password }) {
  const results = PASSWORD_RULES.map((rule) => rule.test(password))
  const score = results.filter(Boolean).length
  return (
    <div className="mt-2">
      <div className="grid grid-cols-4 gap-1.5">
        {PASSWORD_RULES.map((rule, i) => (
          <span
            key={rule.label}
            className={`h-1 rounded-full ${i < score ? STRENGTH_COLORS[score - 1] : 'bg-gray-800'}`}
          />
        ))}
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {PASSWORD_RULES.map((rule, i) => (
          <li
            key={rule.label}
            className={`flex items-center gap-1.5 ${results[i] ? 'text-green-400' : 'text-gray-500'}`}
          >
            {results[i] ? <Check size={12} /> : <Circle size={10} />} {rule.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [touched, setTouched] = useState({}) // fields the user has left, so errors don't show too early
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const errors = validate(form)
  const showError = (field) => (touched[field] ? errors[field] : undefined)
  const emailValid = EMAIL_PATTERN.test(form.email)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setServerError('')
  }

  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true })
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
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Abdul Moiz"
          autoComplete="name"
          className={inputClass(showError('name'))}
        />
        {showError('name') && <span className="text-xs text-red-400">{errors.name}</span>}
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-gray-400">
        Email
        <span className="relative flex items-center">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@university.edu"
            autoComplete="email"
            className={`${inputClass(showError('email'))} pr-10`}
          />
          {emailValid && (
            <CheckCircle2
              size={16}
              className="absolute right-3 text-green-500"
              aria-label="Valid email"
            />
          )}
        </span>
        {showError('email') && <span className="text-xs text-red-400">{errors.email}</span>}
      </label>

      <div className="flex flex-col gap-1.5 text-sm text-gray-400">
        <label htmlFor="password">Password</label>
        <span className="relative flex items-center">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            className={`${inputClass(showError('password'))} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 rounded p-1 text-gray-500 hover:text-gray-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </span>
        {showError('password') && <span className="text-xs text-red-400">{errors.password}</span>}
        <PasswordStrength password={form.password} />
      </div>

      {serverError && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {serverError}
        </p>
      )}

      <Button type="submit" loading={loading} className="mt-2">
        {loading ? 'Creating account…' : 'Create account'} {!loading && <ArrowRight size={16} />}
      </Button>

      <p className="text-xs text-gray-500">
        By creating an account you agree to the{' '}
        <span className="font-medium text-indigo-400">Terms</span> and{' '}
        <span className="font-medium text-indigo-400">Privacy Policy</span>.
      </p>
    </form>
  )
}

export default RegisterForm