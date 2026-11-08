import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'
import { Logo } from '../components/layout/Navbar'
import RegisterForm from '../features/auth/RegisterForm'
import usePageTitle from '../hooks/usePageTitle'

const STEPS = [
  {
    title: 'Create your account',
    text: 'Use your university email so classmates can find you.',
  },
  { title: 'Create or join a room', text: 'One room per assignment, lab or interview session.' },
  { title: 'Invite your group', text: 'Share the invite code and start editing together.' },
]

// Left side of the card: the three steps, with a line joining the numbered circles
function Steps() {
  return (
    <ol className="mt-8 flex flex-col">
      {STEPS.map((step, i) => {
        const first = i === 0
        const last = i === STEPS.length - 1
        return (
          <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0">
            {!last && <span className="absolute top-7 bottom-1 left-3.5 w-px bg-gray-700" />}
            <span
              className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                first
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/20'
                  : 'border border-gray-700 bg-gray-900 text-gray-400'
              }`}
            >
              {i + 1}
            </span>
            <div>
              <p className={`text-sm font-semibold ${first ? 'text-white' : 'text-gray-200'}`}>
                {step.title}
              </p>
              <p className="mt-0.5 text-sm text-gray-400">{step.text}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function RegisterPage() {
  usePageTitle('Create account')
  return (
    <div className="flex min-h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-800 px-6">
        <Link to="/">
          <Logo />
        </Link>
        <p className="text-sm text-gray-400">
          <span className="hidden sm:inline">Already have an account? </span>
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Log in
          </Link>
        </p>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-gray-800 bg-gray-900 md:grid-cols-[2fr_3fr]">
          {/* The steps are hidden on phones to keep the form short */}
          <aside className="hidden flex-col border-r border-gray-800 bg-gray-950/60 p-8 md:flex">
            <p className="font-mono text-xs text-indigo-400">Getting started</p>
            <h2 className="mt-2 text-xl leading-snug font-semibold">
              From sign-up to your first shared run in three steps.
            </h2>
            <Steps />
            <p className="mt-auto flex items-center gap-2 pt-10 font-mono text-xs text-gray-500">
              <Code2 size={14} /> C++ · Java · Python · JavaScript
            </p>
          </aside>

          <section className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="mt-1 mb-6 text-sm text-gray-400">Free for students.</p>
            <RegisterForm />
          </section>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage