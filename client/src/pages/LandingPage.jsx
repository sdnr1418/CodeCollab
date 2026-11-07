import { Link } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'

function LandingPage() {
  return (
    <MainLayout>
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Write code together, in real time.</h1>
        <p className="text-lg text-gray-400">
          Create a room, invite your team, and edit, run and discuss code in one shared editor.
        </p>
        <div className="flex gap-3">
          <Link
            to="/register"
            className="rounded-md bg-indigo-600 px-5 py-2 font-medium hover:bg-indigo-500"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="rounded-md bg-gray-800 px-5 py-2 font-medium hover:bg-gray-700"
          >
            Log in
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}

export default LandingPage