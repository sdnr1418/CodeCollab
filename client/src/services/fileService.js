// Phase 2: files live in MongoDB (see server/src/routes/file.routes.js).
// Every URL starts with the room, because the server checks you're a member of that room.
import { api } from '../lib/api'

const filesUrl = (roomId) => `/rooms/${roomId}/files`

export async function getFilesForRoom(roomId) {
  const { data } = await api.get(filesUrl(roomId))
  return data.files
}

export async function createFile(roomId, name) {
  const { data } = await api.post(filesUrl(roomId), { name })
  return data.file // a duplicate name comes back as a 409 error with the message
}

export async function renameFile(roomId, id, name) {
  const { data } = await api.patch(`${filesUrl(roomId)}/${id}`, { name })
  return data.file
}

// Used by the language dropdown: renames a file and, if given, replaces its content
export async function changeFileLanguage(roomId, id, { name, content }) {
  const { data } = await api.patch(`${filesUrl(roomId)}/${id}`, { name, content })
  return data.file
}

export async function deleteFile(roomId, id) {
  await api.delete(`${filesUrl(roomId)}/${id}`)
  return id
}

// changes = [{ id, content }] for every file with unsaved edits. Returns the saved ids.
export async function saveFiles(roomId, changes) {
  if (changes.length === 0) return []
  const { data } = await api.patch(filesUrl(roomId), { changes })
  return data.saved
}