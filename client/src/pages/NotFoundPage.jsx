import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <Link to="/" className="text-indigo-400">
        Go home
      </Link>
    </div>
  )
}

export default NotFoundPage