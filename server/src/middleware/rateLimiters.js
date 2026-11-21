// Slows down password guessing (Lecture 24/25: authentication attacks).
import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // 20 failed login/register attempts per IP in that time
  skipSuccessfulRequests: true, // successful logins don't count
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
});
