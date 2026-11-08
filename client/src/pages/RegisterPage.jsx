import { Link } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import RegisterForm from '../features/auth/RegisterForm'

function RegisterPage() {
  return (
    <MainLayout>
      <div className="mx-auto my-12 w-full max-w-sm px-4 sm:my-20">
        <h1 className="mb-1 text-2xl font-semibold">Create an account</h1>
        <p className="mb-6 text-sm text-gray-400">Start coding together with your team.</p>
        <RegisterForm />
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