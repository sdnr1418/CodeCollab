// Short, easy-to-type room codes like "k3x-92q" (same style as the Phase 1 mock rooms).
// The code is the room's public ID: it's in the URL (/room/k3x-92q) and it's what you share to invite people.
import { randomInt } from 'node:crypto'

const CHARS = 'abcdefghjkmnpqrstuvwxyz23456789' // no 0/o, 1/l/i, so it's easy to read out loud

const part = () => Array.from({ length: 3 }, () => CHARS[randomInt(CHARS.length)]).join('')

export const makeRoomCode = () => `${part()}-${part()}`

export const ROOM_CODE_PATTERN = /^[a-z0-9]{3}-[a-z0-9]{3}$/