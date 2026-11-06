import { useSelector } from 'react-redux'

function App() {
  const state = useSelector((s) => s)
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-indigo-400">CodeCollab</h1>
      <pre className="mt-4 text-sm text-gray-400">{JSON.stringify(state, null, 2)}</pre>
    </div>
  )
}

export default App