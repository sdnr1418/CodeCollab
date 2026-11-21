// /api/rooms/:roomId/messages
import { Router } from 'express'
import { listMessages, sendMessage } from '../controllers/message.controller.js'
import { messageRules } from '../validators/file.validators.js'
import { validate } from '../middleware/validate.js'
import { requireRoomRole } from '../middleware/requireRoomRole.js'

const router = Router({ mergeParams: true })

router.use(requireRoomRole('member'))

router.get('/', listMessages)
router.post('/', messageRules, validate, sendMessage)

export default router