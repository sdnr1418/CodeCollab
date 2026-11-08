import { useState } from 'react'
import { useSelector } from 'react-redux'
import { X } from 'lucide-react'
import ChatPanel from '../chat/ChatPanel'
import MembersPanel from './MembersPanel'

// Right-hand panel with "Chat" and "Members" tabs.
// onClose is only passed on desktop, where the panel can be hidden.
function RoomSidebar({ room, onClose }) {
  const [tab, setTab] = useState('chat')
  const messageCount = useSelector(
    (state) => state.chat.messages.filter((m) => m.type === 'message').length,
  )

  const tabClass = (name) =>
    `flex h-full items-center gap-2 border-b-2 text-sm font-medium ${
      tab === name
        ? 'border-indigo-500 text-white'
        : 'border-transparent text-gray-400 hover:text-gray-200'
    }`

  return (
    <div className="flex h-full flex-col bg-gray-900">
      <div className="flex h-10 shrink-0 gap-5 border-b border-gray-800 px-4">
        <button className={tabClass('chat')} onClick={() => setTab('chat')}>
          Chat
          {messageCount > 0 && (
            <span className="rounded-full bg-indigo-600 px-1.5 text-xs text-white">
              {messageCount}
            </span>
          )}
        </button>
        <button className={tabClass('members')} onClick={() => setTab('members')}>
          Members <span className="text-xs text-gray-500">{room.members.length}</span>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto self-center rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
            aria-label="Hide chat panel"
            title="Hide chat panel"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1">
        {tab === 'chat' ? <ChatPanel roomId={room.id} /> : <MembersPanel room={room} />}
      </div>
    </div>
  )
}

export default RoomSidebar