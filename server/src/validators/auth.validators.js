// Server-side checks for the login and register forms. The client checks too,
// but anyone can skip the client and call the API directly, so the server must check again.
import { body } from "express-validator";

const email = body("email")
  .trim()
  .isEmail()
  .withMessage("Enter a valid email address")
  .normalizeEmail({ gmail_remove_dots: false });

export const registerRules = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Enter your full name"),
  email,
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Use at least 8 characters"),
];

export const loginRules = [
  email,
  body("password").notEmpty().withMessage("Enter your password"),
  body("remember").optional().isBoolean().toBoolean(),
];
