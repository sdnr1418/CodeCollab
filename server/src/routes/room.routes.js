// /api/rooms/...  Every route needs a logged-in user.
// Nested route for members (/rooms/:roomId/members/:userId), as in Lecture 22.
import { Router } from 'express'
import {
  listMyRooms,
  createRoom,
  joinRoom,
  getRoom,
  renameRoom,
  deleteRoom,
  removeMember,
} from '../controllers/room.controller.js'
import {
  createRoomRules,
  renameRoomRules,
  joinRoomRules,
  memberParamRules,
} from '../validators/room.validators.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireRoomRole } from '../middleware/requireRoomRole.js'
import { runLimiter } from '../middleware/rateLimiters.js'
import { runRules } from '../validators/run.validators.js'
import { runCode } from '../controllers/run.controller.js'
import fileRoutes from './file.routes.js'
import messageRoutes from './message.routes.js'

const router = Router()

router.use(requireAuth)

router.get('/', listMyRooms)
router.post('/', createRoomRules, validate, createRoom)
router.post('/join', joinRoomRules, validate, joinRoom)

router.get('/:roomId', requireRoomRole('member'), getRoom)
router.patch('/:roomId', requireRoomRole('owner'), renameRoomRules, validate, renameRoom)
router.delete('/:roomId', requireRoomRole('owner'), deleteRoom)
router.delete(
  '/:roomId/members/:userId',
  requireRoomRole('member'),
  memberParamRules,
  validate,
  removeMember,
)

// Run code with Judge0 (Step 23)
router.post('/:roomId/run', requireRoomRole('member'), runLimiter, runRules, validate, runCode)

// Nested resources: /api/rooms/:roomId/files and /api/rooms/:roomId/messages
router.use('/:roomId/files', fileRoutes)
router.use('/:roomId/messages', messageRoutes)

export default router