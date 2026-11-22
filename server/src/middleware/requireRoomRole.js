// Loads the room in the URL (/rooms/:roomId) and checks the logged-in user may use it.
//   requireRoomRole('member') -> any member (owners count as members)
//   requireRoomRole('owner')  -> only the owner
// Sets req.room for the controller. Use after requireAuth.
import { Room } from '../models/Room.js'
import { ApiError } from '../utils/ApiError.js'

export function requireRoomRole(role = 'member') {
  return async (req, res, next) => {
    const room = await Room.findOne({ code: req.params.roomId })
    if (!room) throw new ApiError(404, 'Room not found')

    const membership = room.members.find((m) => m.user.equals(req.user._id))
    // Not a member: answer 404, not 403, so outsiders can't tell which room codes exist
    if (!membership) throw new ApiError(404, 'Room not found')
    if (role === 'owner' && membership.role !== 'owner') {
      throw new ApiError(403, 'Only the room owner can do that')
    }

    req.room = room
    next()
  }
}