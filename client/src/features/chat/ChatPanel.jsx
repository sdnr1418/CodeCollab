import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageSquare, SendHorizontal } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { messageSent } from './chatSlice'

function ChatPanel({ roomId }) {
  const messages = useSelector((state) => state.chat.messages)
  const user = useSelector((state) => state.auth.user)
  const [text, setText] = useState('')
  const dispatch = useDispatch()
  const bottomRef = useRef(null)

  // Scroll to the newest message whenever the list changes (useRef + useEffect)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    dispatch(messageSent({ roomId, user, text: text.trim() }))
    setText('')
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 space-y-4 overflow-auto p-4">
        {messages.length === 0 && (
          <li className="flex flex-col items-center gap-2 pt-10 text-center text-sm text-gray-500">
            <MessageSquare size={24} className="text-gray-700" />
            No messages yet. Say hi to your team.
          </li>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} isOwn={m.user?.id === user.id} />
        ))}
        <li ref={bottomRef} />
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-800 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message the room"
          className="h-9 flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 text-sm placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
          aria-label="Send message"
        >
          <SendHorizontal size={16} />
        </button>
      </form>
    </div>
  )
}

export default ChatPanel