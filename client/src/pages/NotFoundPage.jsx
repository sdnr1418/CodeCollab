import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'

function NotFoundPage() {
  const user = useSelector((state) => state.auth.user)
  const { pathname } = useLocation()

  return (
    <MainLayout>
      <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <FileQuestion size={40} className="text-gray-700" />
        <p className="font-mono text-6xl font-bold text-indigo-400">404</p>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="max-w-sm text-sm text-gray-400">
          There's nothing at <code className="font-mono text-gray-300">{pathname}</code>. Check the
          link, or head back.
        </p>
        <Link
          to={user ? '/dashboard' : '/'}
          className="mt-2 flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
        >
          <ArrowLeft size={14} /> {user ? 'Back to dashboard' : 'Go home'}
        </Link>
      </div>
    </MainLayout>
  )
}

export default NotFoundPage