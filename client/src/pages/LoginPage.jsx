import { Link } from 'react-router-dom'
import { Logo } from '../components/layout/Navbar'
import LoginForm from '../features/auth/LoginForm'
import AuthShowcase from '../features/auth/AuthShowcase'
import usePageTitle from '../hooks/usePageTitle'

// Split layout: the form on the left, a picture of a live room on the right.
// The right side is hidden below the lg breakpoint (1024px), so phones just get the form.
function LoginPage() {
  usePageTitle('Log in')
  return (
    <div className="grid min-h-full lg:grid-cols-[minmax(420px,5fr)_7fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/" className="w-fit">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-2xl font-semibold">Log in to CodeCollab</h1>
          <p className="mt-1 mb-8 text-sm text-gray-400">
            Welcome back. Your rooms are where you left them.
          </p>
          <LoginForm />
        </div>
        <p className="text-xs text-gray-600">
          For university coursework, labs and interview practice.
        </p>
      </div>
      <div className="hidden border-l border-gray-800 lg:block">
        <AuthShowcase />
      </div>
    </div>
  )
}

export default LoginPage