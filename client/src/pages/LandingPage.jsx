import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { MessageSquare, Play, Users, Zap } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import usePageTitle from '../hooks/usePageTitle'

const FEATURES = [
  {
    icon: Zap,
    title: 'Live editing',
    text: 'Everyone in the room edits the same files in a full code editor.',
  },
  {
    icon: MessageSquare,
    title: 'Built-in chat',
    text: 'Discuss bugs and ideas next to the code, without switching apps.',
  },
  {
    icon: Play,
    title: 'Run code',
    text: 'Run C++, Java, Python or JavaScript and see the output right away.',
  },
  {
    icon: Users,
    title: 'Rooms and roles',
    text: 'Owners invite and manage members. Share a room with just its ID.',
  },
]

// A small, static picture of the editor for the hero section
function EditorPreview() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-gray-800 bg-gray-900 text-left shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-gray-800 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
        <span className="ml-3 font-mono text-xs text-gray-500">
          main.cpp · Graph Algorithms Lab
        </span>
      </div>
      <pre className="overflow-x-auto bg-gray-950 p-4 font-mono text-xs leading-6 text-gray-300 sm:text-sm">
        <span className="text-purple-400">int</span> main() {'{\n'}
        {'  '}
        <span className="text-gray-500">{'// Saad: try a priority queue here\n'}</span>
        {'  '}
        <span className="text-purple-400">auto</span> dist = dijkstra(0, graph);{'\n'}
        {'  '}cout {'<<'} <span className="text-green-300">"Done!"</span> {'<<'} endl;
        <span className="ml-1 rounded-sm bg-pink-600 px-1 py-0.5 font-sans text-[10px] text-white">
          Leo
        </span>
        {'\n}'}
      </pre>
    </div>
  )
}

function LandingPage() {
  usePageTitle()
  const user = useSelector((state) => state.auth.user)

  return (
    <MainLayout>
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 pt-20 pb-16 text-center">
        <span className="rounded-full border border-gray-800 bg-gray-900 px-3 py-1 text-xs text-gray-400">
          For group assignments, labs and mock interviews
        </span>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Write code together, in real time.
        </h1>
        <p className="max-w-xl text-lg text-gray-400">
          Create a room, invite your team, and edit, run and discuss code in one shared editor.
        </p>
        <div className="flex gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="rounded-md bg-indigo-600 px-5 py-2 font-medium hover:bg-indigo-500"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-5 py-2 font-medium hover:bg-indigo-500"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-gray-700 bg-gray-800 px-5 py-2 font-medium hover:bg-gray-700"
              >
                Log in
              </Link>
            </>
          )}
        </div>
        <div className="mt-6 flex w-full justify-center">
          <EditorPreview />
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 pb-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400">
              <Icon size={18} />
            </span>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{text}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-600">
        CodeCollab · Web Programming project, FAST-NUCES Lahore
      </footer>
    </MainLayout>
  )
}

export default LandingPage