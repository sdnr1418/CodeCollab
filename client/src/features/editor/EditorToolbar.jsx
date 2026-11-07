import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowLeft, Code2, Play, Save, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import AvatarGroup from '../../components/ui/AvatarGroup'
import { LANGUAGES } from '../../utils/languages'
import {
  allFilesSaved,
  fileLanguageChanged,
  selectActiveFile,
  selectActiveLanguage,
} from '../files/filesSlice'
import { runActiveFile } from './outputSlice'

function EditorToolbar({ room }) {
  const dispatch = useDispatch()
  const activeFile = useSelector(selectActiveFile)
  const language = useSelector(selectActiveLanguage)
  const unsavedCount = useSelector((state) => state.files.unsavedIds.length)
  const running = useSelector((state) => state.output.status === 'running')
  const onlineMembers = room.members.filter((m) => m.online)

  const handleShare = async () => {
    await navigator.clipboard?.writeText(room.id)
    toast.success(`Room ID ${room.id} copied. Send it to a teammate.`)
  }

  const handleSave = () => {
    dispatch(allFilesSaved())
    toast.success('All files saved')
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-800 bg-gray-950 px-4">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          to="/dashboard"
          className="flex h-8 items-center gap-1.5 rounded-md border border-gray-700 bg-gray-800 px-3 text-xs font-medium hover:bg-gray-700"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <div className="flex min-w-0 items-baseline gap-2">
          <h1 className="truncate font-semibold">{room.name}</h1>
          <span className="hidden font-mono text-xs text-gray-500 md:inline">{room.id}</span>
        </div>
        <label className="relative hidden items-center md:flex">
          <Code2 size={14} className="pointer-events-none absolute left-2.5 text-gray-400" />
          <select
            value={language ?? ''}
            disabled={!activeFile}
            onChange={(e) =>
              dispatch(fileLanguageChanged({ id: activeFile.id, language: e.target.value }))
            }
            className="h-8 rounded-md border border-gray-700 bg-gray-800 pr-3 pl-8 text-xs font-medium focus:border-indigo-500 focus:outline-none"
          >
            {!LANGUAGES.some((l) => l.value === language) && (
              <option value={language ?? ''}>Plain text</option>
            )}
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-2 hidden lg:block">
          <AvatarGroup users={onlineMembers} max={4} size="md" />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          className="hidden sm:inline-flex"
        >
          <UserPlus size={14} /> Share / Invite
        </Button>
        <Button variant="secondary" size="sm" onClick={handleSave} disabled={unsavedCount === 0}>
          <Save size={14} /> Save
        </Button>
        <Button
          size="sm"
          onClick={() => dispatch(runActiveFile())}
          loading={running}
          disabled={!activeFile}
        >
          {!running && <Play size={14} />} {running ? 'Running…' : 'Run'}
        </Button>
      </div>
    </header>
  )
}

export default EditorToolbar