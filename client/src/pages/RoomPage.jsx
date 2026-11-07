import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { Loader2 } from 'lucide-react'
import EditorToolbar from '../features/editor/EditorToolbar'
import FileExplorer from '../features/files/FileExplorer'
import FileTabs from '../features/files/FileTabs'
import CodeEditor from '../features/editor/CodeEditor'
import OutputPanel from '../features/editor/OutputPanel'
import RoomSidebar from '../features/rooms/RoomSidebar'
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

  return (
    <div className="flex h-full flex-col bg-gray-950">
      <EditorToolbar room={room} />
      <Group orientation="horizontal" className="min-h-0 flex-1">
        <Panel defaultSize="16%" minSize="10%">
          <FileExplorer roomId={room.id} />
        </Panel>
        <Separator className={vHandle} />
        <Panel defaultSize="58%" minSize="30%">
          <Group orientation="vertical">
            <Panel defaultSize="68%" minSize="20%">
              <div className="flex h-full flex-col">
                <FileTabs />
                <div className="min-h-0 flex-1">
                  <CodeEditor />
                </div>
              </div>
            </Panel>
            <Separator className={hHandle} />
            <Panel defaultSize="32%" minSize="10%">
              <OutputPanel />
            </Panel>
          </Group>
        </Panel>
        <Separator className={vHandle} />
        <Panel defaultSize="26%" minSize="18%">
          <RoomSidebar room={room} />
        </Panel>
      </Group>
    </div>
  )
}

export default RoomPage