import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createFile, deleteFile, fileSelected, renameFile } from './filesSlice'

// Small inline text box used for both "new file" and "rename"
function FileNameInput({ initial = '', onDone }) {
  const [value, setValue] = useState(initial)
  const finish = () => onDone(value.trim())

  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={finish}
      onKeyDown={(e) => {
        if (e.key === 'Enter') finish()
        if (e.key === 'Escape') onDone('')
      }}
      placeholder="filename.cpp"
      className="h-7 w-full rounded border border-indigo-500 bg-gray-800 px-2 text-sm focus:outline-none"
    />
  )
}

// onSelect (optional) runs after a file is opened, e.g. to close the mobile drawer
function FileExplorer({ roomId, onSelect }) {
  const { items, activeFileId, unsavedIds } = useSelector((state) => state.files)
  const dispatch = useDispatch()
  const [creating, setCreating] = useState(false)
  const [renamingId, setRenamingId] = useState(null)

  // .unwrap() turns a failed thunk into a thrown error, e.g. "A file named x already exists"
  const run = (thunk) =>
    dispatch(thunk)
      .unwrap()
      .catch((err) => toast.error(err.message))

  const handleCreate = (name) => {
    setCreating(false)
    if (name) run(createFile({ roomId, name }))
  }

  const handleRename = (id, name) => {
    setRenamingId(null)
    if (name) run(renameFile({ id, name }))
  }

  const handleDelete = (file) => {
    if (window.confirm(`Delete ${file.name}? This can't be undone.`)) run(deleteFile(file.id))
  }

  return (
    <div className="flex h-full flex-col bg-gray-900">
      <div className="flex h-10 items-center justify-between px-4">
        <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">Files</span>
        <button
          onClick={() => setCreating(true)}
          className="text-gray-400 hover:text-white"
          aria-label="New file"
        >
          <Plus size={16} />
        </button>
      </div>

      <ul className="flex-1 space-y-0.5 overflow-auto px-2">
        {items.map((file) =>
          renamingId === file.id ? (
            <li key={file.id}>
              <FileNameInput initial={file.name} onDone={(name) => handleRename(file.id, name)} />
            </li>
          ) : (
            <li key={file.id} className="group relative">
              <button
                onClick={() => {
                  dispatch(fileSelected(file.id))
                  onSelect?.()
                }}
                className={`flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm ${
                  file.id === activeFileId
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                }`}
              >
                <FileText size={14} className="shrink-0" />
                <span className="truncate">{file.name}</span>
                {unsavedIds.includes(file.id) && (
                  <span className="ml-auto hidden h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400 md:block md:group-hover:hidden" />
                )}
              </button>
              <span className="absolute top-1/2 right-2 flex -translate-y-1/2 gap-3 text-gray-400 md:hidden md:gap-2 md:group-hover:flex">
                <button
                  onClick={() => setRenamingId(file.id)}
                  className="hover:text-white"
                  aria-label="Rename"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </span>
            </li>
          ),
        )}
        {creating && (
          <li>
            <FileNameInput onDone={handleCreate} />
          </li>
        )}
        {items.length === 0 && !creating && (
          <li className="px-2 py-4 text-sm text-gray-500">No files yet. Click + to add one.</li>
        )}
      </ul>
    </div>
  )
}

export default FileExplorer