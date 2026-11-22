import { body, param } from 'express-validator'
import { LANGUAGES } from '../models/Room.js'
import { ROOM_CODE_PATTERN } from '../utils/roomCode.js'

const roomName = body('name')
  .trim()
  .isLength({ min: 1, max: 60 })
  .withMessage('Room name must be 1 to 60 characters')

export const createRoomRules = [
  roomName,
  body('language').isIn(LANGUAGES).withMessage(`Language must be one of: ${LANGUAGES.join(', ')}`),
]

export const renameRoomRules = [roomName]

export const joinRoomRules = [
  body('code')
    .trim()
    .toLowerCase()
    .matches(ROOM_CODE_PATTERN)
    .withMessage('Room IDs look like k3x-92q'),
]

export const memberParamRules = [param('userId').isMongoId().withMessage('Invalid member')]