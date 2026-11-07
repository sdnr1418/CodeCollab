import { useDispatch, useSelector } from 'react-redux'
import { Eraser, Loader2, Play, Terminal } from 'lucide-react'
import Button from '../../components/ui/Button'
import { outputCleared, runActiveFile } from './outputSlice'

function RunStatus({ output }) {
  if (output.status === 'running') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-gray-400">
        <Loader2 size={12} className="animate-spin" /> Running…
      </span>
    )
  }
  if (output.status !== 'done') return null
  const ok = output.exitCode === 0
  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-400">
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
      Exit {output.exitCode}
      {output.timeMs != null && ` · ${(output.timeMs / 1000).toFixed(2)}s`}
    </span>
  )
}

function OutputPanel() {
  const output = useSelector((state) => state.output)
  const hasFile = useSelector((state) => state.files.activeFileId !== null)
  const dispatch = useDispatch()

  return (
    <div className="flex h-full flex-col bg-gray-950">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-gray-800 px-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Terminal size={14} className="text-gray-400" /> Output
          </span>
          <RunStatus output={output} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(outputCleared())}
            className="text-gray-500 hover:text-white"
            aria-label="Clear output"
          >
            <Eraser size={14} />
          </button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(runActiveFile())}
            disabled={!hasFile || output.status === 'running'}
          >
            <Play size={12} /> Run
          </Button>
        </div>
      </div>
      <pre className="flex-1 overflow-auto p-4 font-mono text-sm leading-6 whitespace-pre-wrap">
        {output.status === 'idle' && (
          <span className="text-gray-600">Press Run to see your program&apos;s output here.</span>
        )}
        {output.command && <div className="mb-3 text-gray-500">$ {output.command}</div>}
        {output.stdout && <div className="text-gray-200">{output.stdout}</div>}
        {output.stderr && <div className="text-red-400">{output.stderr}</div>}
      </pre>
    </div>
  )
}

export default OutputPanel