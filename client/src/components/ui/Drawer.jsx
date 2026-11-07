import { useEffect } from 'react'
import { X } from 'lucide-react'

// Slide-in panel for small screens. side = 'left' | 'right'
function Drawer({ open, side = 'left', title, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const hidden = side === 'left' ? '-translate-x-full' : 'translate-x-full'

  return (
    <>
      {/* Dark backdrop; tap it to close */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed top-0 bottom-0 z-50 flex w-[85%] max-w-sm flex-col border-gray-800 bg-gray-900 transition-transform duration-200 ${
          side === 'left' ? 'left-0 border-r' : 'right-0 border-l'
        } ${open ? 'translate-x-0' : hidden}`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-800 px-4">
          <span className="text-sm font-semibold">{title}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </aside>
    </>
  )
}

export default Drawer