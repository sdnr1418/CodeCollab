import { useDispatch, useSelector } from 'react-redux'
import { FileText, X } from 'lucide-react'
import { fileSelected, tabClosed } from './filesSlice'

function FileTabs() {
  const { items, openTabIds, activeFileId, unsavedIds } = useSelector((state) => state.files)
  const dispatch = useDispatch()
  const tabs = openTabIds.map((id) => items.find((f) => f.id === id)).filter(Boolean)

  return (
    <div className="flex h-10 shrink-0 overflow-x-auto border-b border-gray-800 bg-gray-900">
      {tabs.map((file) => {
        const active = file.id === activeFileId
        const unsaved = unsavedIds.includes(file.id)
        return (
          <div
            key={file.id}
            onClick={() => dispatch(fileSelected(file.id))}
            className={`group flex cursor-pointer items-center gap-2 border-r border-gray-800 px-4 text-sm ${
              active
                ? 'border-t-2 border-t-indigo-500 bg-gray-950 text-white'
                : 'border-t-2 border-t-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText size={14} />
            {file.name}
            <button
              onClick={(e) => {
                e.stopPropagation() // don't also select the tab
                dispatch(tabClosed(file.id))
              }}
              className="flex h-4 w-4 items-center justify-center rounded hover:bg-gray-700"
              aria-label={`Close ${file.name}`}
            >
              {unsaved && <span className="h-2 w-2 rounded-full bg-amber-400 group-hover:hidden" />}
              <X size={12} className={unsaved ? 'hidden group-hover:block' : ''} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default FileTabs