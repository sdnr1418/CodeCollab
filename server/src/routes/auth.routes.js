// /api/auth/...
import { Router } from "express";
import { register, login, logout, me } from "../controllers/auth.controller.js";
import { registerRules, loginRules } from "../validators/auth.validators.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/register", authLimiter, registerRules, validate, register);
router.post("/login", authLimiter, loginRules, validate, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
