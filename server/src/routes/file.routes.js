// /api/rooms/:roomId/files/...  (nested under rooms, Lecture 22)
// mergeParams lets this router read :roomId from the parent route.
import { Router } from 'express'
import { listFiles, createFile, updateFile, saveFiles, deleteFile } from '../controllers/file.controller.js'
import { createFileRules, updateFileRules, saveFilesRules, fileIdRules } from '../validators/file.validators.js'
import { validate } from '../middleware/validate.js'
import { requireRoomRole } from '../middleware/requireRoomRole.js'

const router = Router({ mergeParams: true })

router.use(requireRoomRole('member')) // every file route: members of this room only

router.get('/', listFiles)
router.post('/', createFileRules, validate, createFile)
router.patch('/', saveFilesRules, validate, saveFiles)
router.patch('/:fileId', updateFileRules, validate, updateFile)
router.delete('/:fileId', fileIdRules, validate, deleteFile)

export default router