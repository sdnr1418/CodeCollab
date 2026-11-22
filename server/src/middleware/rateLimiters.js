// Rate limits (Lecture 24/25): slow down password guessing, scripts and Run spam.
import rateLimit from "express-rate-limit";

// Every /api request: generous for a person using the app, stops a script hammering the server
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // per IP
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message:
      "Too many requests. Please slow down and try again in a few minutes.",
  },
});

// Login and register only
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // 20 failed login/register attempts per IP in that time
  skipSuccessfulRequests: true, // successful logins don't count
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
});

// Stops Run spam: Judge0's free plan has a daily limit, and every run costs one.
// Counted per logged-in user (it runs after requireAuth), not per IP.
export const runLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 runs per user per minute
  keyGenerator: (req) => req.user.id,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "You're running code too fast. Wait a minute and try again.",
  },
});
