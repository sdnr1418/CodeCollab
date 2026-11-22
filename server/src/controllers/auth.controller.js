// Register, log in, log out and "who am I". Express 5 passes thrown errors to errorHandler.
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { setAuthCookie, clearAuthCookie } from "../services/token.service.js";

// POST /api/auth/register  { name, email, password }
export async function register(req, res) {
  const { name, email, password } = req.body;

  if (await User.exists({ email })) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  setAuthCookie(res, user.id, true);
  res.status(201).json({ user });
}

// POST /api/auth/login  { email, password, remember }
export async function login(req, res) {
  const { email, password, remember = true } = req.body;

  const user = await User.findOne({ email }).select("+passwordHash");
  // Same message whether the email or the password is wrong, so attackers can't
  // find out which emails have accounts
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }

  setAuthCookie(res, user.id, remember);
  res.json({ user });
}

// POST /api/auth/logout
export function logout(req, res) {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
}

// GET /api/auth/me  (requireAuth has already loaded req.user)
export function me(req, res) {
  res.json({ user: req.user });
}
