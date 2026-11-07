import Avatar from '../../components/ui/Avatar'
import { clockTime } from '../../utils/formatTime'

function ChatMessage({ message, isOwn }) {
  if (message.type === 'system') {
    return <li className="py-1 text-center text-xs text-gray-500">{message.text}</li>
  }

  if (isOwn) {
    return (
      <li className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-500">
          {clockTime(message.sentAt)} <span className="ml-1 font-semibold text-gray-200">You</span>
        </span>
        <p className="max-w-[85%] rounded-lg rounded-tr-sm bg-indigo-600 px-3 py-2 text-sm text-white">
          {message.text}
        </p>
      </li>
    )
  }

  return (
    <li className="flex gap-3">
      <Avatar user={message.user} size="md" />
      <div className="min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{message.user.name}</span>
          <span className="ml-2 text-xs text-gray-500">{clockTime(message.sentAt)}</span>
        </p>
        <p className="text-sm break-words text-gray-300">{message.text}</p>
      </div>
    </li>
  )
}

export default ChatMessage