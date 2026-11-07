import { Link } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'

// TODO: build RegisterForm in features/auth/
function RegisterPage() {
  return (
    <MainLayout>
      <div className="mx-auto mt-20 w-full max-w-sm px-4">
        <h1 className="mb-6 text-2xl font-semibold">Create an account</h1>
        <p className="text-gray-400">Registration form coming soon.</p>
        <p className="mt-4 text-sm text-gray-400">
          Have an account?{' '}
          <Link to="/login" className="text-indigo-400">
            Log in
          </Link>
        </p>
      </div>
    </MainLayout>
  )
}

export default RegisterPage