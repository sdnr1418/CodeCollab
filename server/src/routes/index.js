// Every API route is mounted here under /api (see app.js).
// Later steps add: router.use('/rooms', roomRoutes), ...
import { Router } from 'express'
import { isDbConnected } from '../config/db.js'
import authRoutes from './auth.routes.js'
import roomRoutes from './room.routes.js'

const router = Router()

// GET /api/health: quick check that the server and the database are up
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDbConnected() ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  })
})

router.use('/auth', authRoutes) // /api/auth/register, /login, /logout, /me
router.use('/rooms', roomRoutes) // /api/rooms/...

export default router