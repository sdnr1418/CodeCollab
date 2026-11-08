import { useDispatch, useSelector } from 'react-redux'
import { Minus, Moon, Plus, Sun } from 'lucide-react'
import { fontSizeChanged, themeToggled } from './editorSettingsSlice'

// Small controls at the right end of the file tabs: font size and light/dark editor theme
function EditorSettings() {
  const { theme, fontSize } = useSelector((state) => state.editorSettings)
  const dispatch = useDispatch()
  const iconButton =
    'flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-800 hover:text-white'

  return (
    <div className="flex h-10 shrink-0 items-center gap-1 border-b border-l border-gray-800 bg-gray-900 px-2">
      <button
        onClick={() => dispatch(fontSizeChanged(-1))}
        className={iconButton}
        aria-label="Smaller font"
        title="Smaller font"
      >
        <Minus size={12} />
      </button>
      <span className="w-6 text-center font-mono text-xs text-gray-400" title="Font size">
        {fontSize}
      </span>
      <button
        onClick={() => dispatch(fontSizeChanged(1))}
        className={iconButton}
        aria-label="Bigger font"
        title="Bigger font"
      >
        <Plus size={12} />
      </button>
      <button
        onClick={() => dispatch(themeToggled())}
        className={`${iconButton} ml-1`}
        aria-label={theme === 'dark' ? 'Light editor theme' : 'Dark editor theme'}
        title={theme === 'dark' ? 'Light editor theme' : 'Dark editor theme'}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  )
}

export default EditorSettings