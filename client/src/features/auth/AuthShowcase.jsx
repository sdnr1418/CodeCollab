import { FileText } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'

// The right half of the login page: a static picture of a room in use.
// It is only decoration, so it uses plain spans instead of the real Monaco editor.
const CODE = [
  ['k', '#include ', 's', '<iostream>'],
  ['k', '#include ', 's', '<vector>'],
  ['k', '#include ', 's', '<queue>'],
  ['k', 'using namespace ', 'p', 'std;'],
  [],
  ['k', 'const int ', 'p', 'INF = ', 'n', '1e9', 'p', ';'],
  [],
  ['c', '// Shortest paths from src, non-negative weights'],
  ['p', 'vector<', 'k', 'int', 'p', '> ', 'f', 'dijkstra', 'p', '(', 'k', 'int ', 'p', 'src,'],
  ['p', '    vector<vector<pair<', 'k', 'int', 'p', ',', 'k', 'int', 'p', '>>>& g) {'],
  ['p', '  priority_queue<pair<', 'k', 'int', 'p', ',', 'k', 'int', 'p', '>> pq;'],
  ['p', '  vector<', 'k', 'int', 'p', '> dist(g.size(), INF);'],
  ['p', '  dist[src] = ', 'n', '0', 'p', ';'],
  ['p', '  pq.push({', 'n', '0', 'p', ', src});'],
  ['k', '  while ', 'p', '(!pq.empty()) {'],
  ['k', '    auto ', 'p', '[d, u] = pq.top(); pq.pop();'],
  ['k', '    if ', 'p', '(-d > dist[u]) ', 'k', 'continue', 'p', ';'],
  ['k', '    for ', 'p', '(', 'k', 'auto ', 'p', '[v, w] : g[u]) {'],
  ['k', '      if ', 'p', '(dist[u] + w < dist[v]) {'],
]

const COLORS = {
  k: 'text-purple-400',
  s: 'text-green-300',
  n: 'text-orange-300',
  c: 'text-gray-500 italic',
  f: 'text-sky-300',
  p: 'text-gray-300',
}

// Where the two "other people" are, as [line number, label, colour]
const CURSORS = {
  10: ['Leo Kim', 'bg-emerald-600'],
  18: ['Saad Nasir', 'bg-pink-600'],
}

const leo = { name: 'Leo Kim', color: 'bg-emerald-600' }
const saad = { name: 'Saad Nasir', color: 'bg-pink-600' }

function CodeLine({ tokens, number }) {
  const cursor = CURSORS[number]
  const active = number === 17
  const parts = []
  for (let i = 0; i < tokens.length; i += 2) {
    parts.push(
      <span key={i} className={COLORS[tokens[i]]}>
        {tokens[i + 1]}
      </span>,
    )
  }
  return (
    <div className={`flex ${active ? 'bg-gray-900' : ''}`}>
      <span
        className={`w-10 shrink-0 pr-4 text-right ${active ? 'text-gray-200' : 'text-gray-600'}`}
      >
        {number}
      </span>
      <span className="relative whitespace-pre">
        {parts}
        {cursor && (
          <span className="relative ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-current align-baseline">
            <span
              className={`absolute -top-4 left-0 rounded-sm px-1 font-sans text-[10px] whitespace-nowrap text-white ${cursor[1]}`}
            >
              {cursor[0]}
            </span>
          </span>
        )}
        {active && <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-indigo-400" />}
      </span>
    </div>
  )
}

function AuthShowcase() {
  return (
    <div className="relative flex h-full flex-col justify-center bg-gray-900/60 px-10 xl:px-16">
      <p className="flex items-center gap-2 text-xs text-gray-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> 3 people editing main.cpp
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Same file, same output, same conversation.</h2>

      <div className="relative mt-8 overflow-hidden rounded-lg border border-gray-800 bg-gray-950 shadow-2xl">
        <div className="flex h-10 items-center justify-between border-b border-gray-800 bg-gray-900 pr-3">
          <div className="flex h-full text-xs">
            <span className="flex items-center gap-1.5 border-t-2 border-indigo-500 bg-gray-950 px-4 text-white">
              <FileText size={12} /> main.cpp
            </span>
            <span className="flex items-center gap-1.5 px-4 text-gray-500">
              <FileText size={12} /> graph.hpp
            </span>
          </div>
          <div className="flex -space-x-1.5">
            <Avatar user={leo} size="sm" className="ring-2 ring-gray-900" />
            <Avatar user={saad} size="sm" className="ring-2 ring-gray-900" />
          </div>
        </div>
        <pre className="overflow-hidden py-3 font-mono text-[12px] leading-6">
          {CODE.map((tokens, i) => (
            <CodeLine key={i} tokens={tokens} number={i + 1} />
          ))}
        </pre>
        <div className="flex items-center gap-3 border-t border-gray-800 bg-gray-900 px-4 py-2 font-mono text-xs text-gray-400">
          <span className="text-gray-500">&gt;_</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Exit 0 · 0.42s
          </span>
          <span className="text-gray-300">0 → 4 : 7</span>
        </div>
      </div>

      {/* A chat message "popping up" over the editor */}
      <div className="absolute right-10 bottom-16 flex max-w-xs items-start gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-xl xl:right-16">
        <Avatar user={saad} size="md" />
        <div className="text-sm">
          <p className="font-medium">
            Saad Nasir <span className="ml-1 text-xs font-normal text-gray-500">10:46</span>
          </p>
          <p className="text-gray-300">Sample input passes. Running test 3 now.</p>
        </div>
      </div>
    </div>
  )
}

export default AuthShowcase