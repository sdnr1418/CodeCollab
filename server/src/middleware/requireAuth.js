// Protects a route: only logged-in users get through, and req.user is set for the controller.
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { COOKIE_NAME, verifyToken } from "../services/token.service.js";

export async function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) throw new ApiError(401, "Please log in");

  let userId;
  try {
    userId = verifyToken(token);
  } catch {
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(401, "Please log in");

  req.user = user;
  next();
}
