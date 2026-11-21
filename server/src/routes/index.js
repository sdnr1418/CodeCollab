// Every API route is mounted here under /api (see app.js).
// Later steps add: router.use('/auth', authRoutes), router.use('/rooms', roomRoutes), ...
import { Router } from "express";
import { isDbConnected } from "../config/db.js";

const router = Router();

// GET /api/health: quick check that the server and the database are up
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: isDbConnected() ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});

export default router;
