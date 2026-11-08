import { Link } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import LoginForm from '../features/auth/LoginForm'
import usePageTitle from '../hooks/usePageTitle'

function LoginPage() {
  usePageTitle('Log in')
  return (
    <MainLayout>
      <div className="mx-auto mt-20 w-full max-w-sm px-4">
        <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
        <LoginForm />
        <p className="mt-4 text-sm text-gray-400">
          No account?{' '}
          <Link to="/register" className="text-indigo-400">
            Register
          </Link>
        </p>
      </div>
    </MainLayout>
  )
}

export default LoginPage