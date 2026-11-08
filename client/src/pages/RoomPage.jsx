import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { Loader2 } from 'lucide-react'
import EditorToolbar from '../features/editor/EditorToolbar'
import FileExplorer from '../features/files/FileExplorer'
import FileTabs from '../features/files/FileTabs'
import CodeEditor from '../features/editor/CodeEditor'
import EditorSettings from '../features/editor/EditorSettings'
import OutputPanel from '../features/editor/OutputPanel'
import RoomSidebar from '../features/rooms/RoomSidebar'
import Drawer from '../components/ui/Drawer'
import useMediaQuery from '../hooks/useMediaQuery'
import useRoomShortcuts from '../hooks/useRoomShortcuts'
import usePageTitle from '../hooks/usePageTitle'
import { fetchRoom } from '../features/rooms/roomsSlice'
import { fetchFiles } from '../features/files/filesSlice'
import { fetchMessages } from '../features/chat/chatSlice'
import { outputCleared } from '../features/editor/outputSlice'

// Thin drag handles between panels
const vHandle = 'w-px bg-gray-800 hover:bg-indigo-500'
const hHandle = 'h-px bg-gray-800 hover:bg-indigo-500'

function RoomPage() {
  const { roomId } = useParams()
  const dispatch = useDispatch()
  const { current: room, currentStatus } = useSelector((state) => state.rooms)
  const isMobile = useMediaQuery('(max-width: 767px)') // below Tailwind's md breakpoint
  const [drawer, setDrawer] = useState(null) // 'files' | 'chat' | null
  const [chatOpen, setChatOpen] = useState(true) // desktop only: show or hide the right panel
  const closeDrawer = () => setDrawer(null)
  const hasUnsaved = useSelector((state) => state.files.unsavedIds.length > 0)

  // Warn before closing or refreshing the tab with unsaved edits
  useEffect(() => {
    if (!hasUnsaved) return
    const warn = (e) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [hasUnsaved])

  useRoomShortcuts(roomId)
  usePageTitle(room?.name)

  useEffect(() => {
    dispatch(fetchRoom(roomId))
    dispatch(fetchFiles(roomId))
    dispatch(fetchMessages(roomId))
    dispatch(outputCleared())
  }, [dispatch, roomId])

  if (currentStatus === 'error') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <h1 className="text-xl font-semibold">Room not found</h1>
        <Link to="/dashboard" className="text-indigo-400">
          Back to dashboard
        </Link>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  const editor = (
    <div className="flex h-full flex-col">
      <div className="flex">
        <div className="min-w-0 flex-1">
          <FileTabs />
        </div>
        <EditorSettings />
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor />
      </div>
    </div>
  )

  // Phones: editor on top, output below, files and chat in slide-in drawers
  if (isMobile) {
    return (
      <div className="flex h-full flex-col bg-gray-950">
        <EditorToolbar
          room={room}
          onOpenFiles={() => setDrawer('files')}
          onOpenChat={() => setDrawer('chat')}
        />
        <Group orientation="vertical" className="min-h-0 flex-1">
          <Panel defaultSize="65%" minSize="25%">
            {editor}
          </Panel>
          <Separator className={hHandle} />
          <Panel defaultSize="35%" minSize="15%">
            <OutputPanel />
          </Panel>
        </Group>
        <Drawer open={drawer === 'files'} side="left" title={room.name} onClose={closeDrawer}>
          <FileExplorer roomId={room.id} onSelect={closeDrawer} />
        </Drawer>
        <Drawer open={drawer === 'chat'} side="right" title={room.name} onClose={closeDrawer}>
          <RoomSidebar room={room} />
        </Drawer>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-gray-950">
      <EditorToolbar
        room={room}
        chatOpen={chatOpen}
        onOpenChat={() => setChatOpen((open) => !open)}
      />
      {/* The ids let the panel library keep the sizes right when the chat panel is added or removed */}
      <Group orientation="horizontal" className="min-h-0 flex-1">
        <Panel id="files" defaultSize="16%" minSize="10%">
          <FileExplorer roomId={room.id} />
        </Panel>
        <Separator className={vHandle} />
        <Panel id="editor" defaultSize="58%" minSize="30%">
          <Group orientation="vertical">
            <Panel defaultSize="68%" minSize="20%">
              {editor}
            </Panel>
            <Separator className={hHandle} />
            <Panel defaultSize="32%" minSize="10%">
              <OutputPanel />
            </Panel>
          </Group>
        </Panel>
        {chatOpen && (
          <>
            <Separator className={vHandle} />
            <Panel id="chat" defaultSize="26%" minSize="18%">
              <RoomSidebar room={room} onClose={() => setChatOpen(false)} />
            </Panel>
          </>
        )}
      </Group>
    </div>
  )
}

export default RoomPage