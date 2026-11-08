import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowLeft, Code2, FolderTree, MessageSquare, Play, Save, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import AvatarGroup from '../../components/ui/AvatarGroup'
import { LANGUAGES } from '../../utils/languages'
import {
  changeFileLanguage,
  saveFiles,
  selectActiveFile,
  selectActiveLanguage,
} from '../files/filesSlice'
import RoomActions from '../rooms/RoomActions'
import { runActiveFile } from './outputSlice'

// onOpenFiles is only passed on phones, where the file list is a drawer.
// onOpenChat opens the chat drawer on phones, and shows or hides the chat panel on desktop.
function EditorToolbar({ room, onOpenFiles, onOpenChat, chatOpen = false }) {
  const dispatch = useDispatch()
  const activeFile = useSelector(selectActiveFile)
  const language = useSelector(selectActiveLanguage)
  const unsavedCount = useSelector((state) => state.files.unsavedIds.length)
  const running = useSelector((state) => state.output.status === 'running')
  const userId = useSelector((state) => state.auth.user.id)
  const onlineMembers = room.members.filter((m) => m.online)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(room.id)
      toast.success(`Room ID ${room.id} copied. Send it to a teammate.`)
    } catch {
      // Some browsers block the clipboard, so just show the ID instead
      toast(`Room ID: ${room.id}. Send it to a teammate.`, { duration: 6000 })
    }
  }

  const handleLanguage = async (value) => {
    try {
      await dispatch(changeFileLanguage({ id: activeFile.id, language: value })).unwrap()
    } catch (err) {
      toast.error(err.message) // e.g. "A file named main.py already exists"
    }
  }

  const handleSave = async () => {
    await dispatch(saveFiles(room.id)).unwrap()
    toast.success('All files saved')
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-gray-800 bg-gray-950 px-3 sm:gap-4 sm:px-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Link
          to="/dashboard"
          className="flex h-8 items-center gap-1.5 rounded-md border border-gray-700 bg-gray-800 px-3 text-xs font-medium hover:bg-gray-700"
        >
          <ArrowLeft size={14} /> <span className="hidden sm:inline">Dashboard</span>
        </Link>
        {onOpenFiles && (
          <button
            onClick={onOpenFiles}
            className="text-gray-300 hover:text-white"
            aria-label="Open files"
          >
            <FolderTree size={18} />
          </button>
        )}
        <div className="flex min-w-0 items-center gap-1">
          <div className="flex min-w-0 items-baseline gap-2">
            <h1 className="truncate font-semibold">{room.name}</h1>
            <span className="hidden font-mono text-xs text-gray-500 md:inline">{room.id}</span>
          </div>
          <RoomActions room={room} isOwner={room.ownerId === userId} afterRemove="/dashboard" />
        </div>
        <label className="relative hidden items-center md:flex">
          <Code2 size={14} className="pointer-events-none absolute left-2.5 text-gray-400" />
          <select
            value={language ?? ''}
            disabled={!activeFile}
            onChange={(e) => handleLanguage(e.target.value)}
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
        <div className="hidden sm:block">
          <Button variant="secondary" size="sm" onClick={handleShare}>
            <UserPlus size={14} /> Share / Invite
          </Button>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSave}
          disabled={unsavedCount === 0}
          title="Save all files (Ctrl+S)"
        >
          <Save size={14} /> <span className="hidden sm:inline">Save</span>
        </Button>
        <Button
          size="sm"
          onClick={() => dispatch(runActiveFile())}
          title="Run (Ctrl+Enter)"
          loading={running}
          disabled={!activeFile}
        >
          {!running && <Play size={14} />} {running ? 'Running…' : 'Run'}
        </Button>
        {onOpenChat && (
          <button
            onClick={onOpenChat}
            className={`ml-1 rounded-md p-1.5 hover:text-white ${
              chatOpen ? 'bg-gray-800 text-white' : 'text-gray-300'
            }`}
            aria-label={chatOpen ? 'Hide chat' : 'Show chat'}
            title={chatOpen ? 'Hide chat' : 'Show chat'}
          >
            <MessageSquare size={18} />
          </button>
        )}
      </div>
    </header>
  )
}

export default EditorToolbar