// Live editing: connects the open file in Monaco to a shared Yjs document on the server.
// Everyone with the same file open sees each other's typing and coloured cursors.
// The server saves the document to MongoDB by itself (server/src/sockets/collab.js).
import { useEffect } from 'react'
import * as Y from 'yjs'
import { SocketIOProvider } from 'y-socket.io'
import { MonacoBinding } from 'y-monaco'
import { colorHex } from '../utils/colors'

// y-monaco marks other people's cursors with the classes yRemoteSelection-<id> and
// yRemoteSelectionHead-<id>. This writes a <style> tag that colours them and adds a name label.
function showRemoteCursors(awareness) {
  const style = document.createElement('style')
  document.head.appendChild(style)

  const update = () => {
    let css = ''
    awareness.getStates().forEach((state, clientId) => {
      if (clientId === awareness.clientID || !state.user) return
      const { name, color } = state.user
      css += `
        .yRemoteSelection-${clientId} { background-color: ${color}40; }
        .yRemoteSelectionHead-${clientId} {
          position: absolute; height: 100%; box-sizing: border-box;
          border-left: 2px solid ${color};
        }
        .yRemoteSelectionHead-${clientId}::after {
          content: ${JSON.stringify(name)};
          position: absolute; top: -1.2em; left: -2px; padding: 0 4px;
          font-size: 10px; line-height: 1.2em; white-space: nowrap;
          color: #fff; background: ${color}; border-radius: 3px 3px 3px 0;
        }`
    })
    style.textContent = css
  }

  awareness.on('change', update)
  update()
  return () => {
    awareness.off('change', update)
    style.remove()
  }
}

function useCollabEditor(editor, fileId, user) {
  useEffect(() => {
    const model = editor?.getModel()
    if (!model || !fileId) return

    const doc = new Y.Doc()
    // Connects to the "/yjs|<fileId>" namespace on our server. The login cookie goes with it.
    const provider = new SocketIOProvider(window.location.origin, fileId, doc, {
      autoConnect: true,
      disableBc: true, // always sync through the server, even between tabs
    })
    provider.awareness.setLocalStateField('user', { name: user.name, color: colorHex(user.color) })

    const binding = new MonacoBinding(
      doc.getText('monaco'),
      model,
      new Set([editor]),
      provider.awareness,
    )
    const hideRemoteCursors = showRemoteCursors(provider.awareness)

    return () => {
      hideRemoteCursors()
      binding.destroy()
      provider.destroy()
      doc.destroy()
    }
  }, [editor, fileId, user.name, user.color])
}

export default useCollabEditor