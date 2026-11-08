import { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import toast from 'react-hot-toast'
import { saveFiles, selectActiveFile } from '../features/files/filesSlice'
import { runActiveFile } from '../features/editor/outputSlice'

// Ctrl+S saves all files and Ctrl+Enter runs the open file (Cmd on a Mac).
// The listener uses the capture phase (the `true` below) so it runs before Monaco,
// which would otherwise use Ctrl+Enter to insert a new line.
function useRoomShortcuts(roomId) {
  const dispatch = useDispatch()
  const store = useStore() // read the latest state inside the handler without re-subscribing

  useEffect(() => {
    const onKeyDown = async (e) => {
      if (!(e.ctrlKey || e.metaKey)) return
      const state = store.getState()

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault() // stop the browser's "Save page as" dialog
        if (state.files.unsavedIds.length === 0) return toast('Nothing to save')
        await dispatch(saveFiles(roomId)).unwrap()
        toast.success('All files saved')
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        if (selectActiveFile(state) && state.output.status !== 'running') {
          dispatch(runActiveFile())
        }
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [dispatch, store, roomId])
}

export default useRoomShortcuts