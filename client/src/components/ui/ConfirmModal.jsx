import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'

// A reusable "Are you sure?" pop-up. onConfirm can be async; the button spins until it finishes.
function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', onConfirm, onClose }) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm text-gray-400">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal