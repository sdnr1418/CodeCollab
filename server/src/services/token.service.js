// Creates and checks the login token (JWT) and the cookie that carries it.
import jwt from "jsonwebtoken";
import { env, isProduction } from "../config/env.js";

export const COOKIE_NAME = "token";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function signToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

// Returns the user id, or throws if the token is fake or expired
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret).sub;
}

// httpOnly: JavaScript in the page can't read it, so an XSS bug can't steal it.
// sameSite strict: the browser won't send it from other sites, which blocks CSRF.
// secure: HTTPS only, once deployed (Lecture 23).
const baseCookie = {
  httpOnly: true,
  sameSite: "strict",
  secure: isProduction,
  path: "/",
};

// remember = "Keep me logged in". Without it the cookie is deleted when the browser closes.
export function setAuthCookie(res, userId, remember = true) {
  res.cookie(
    COOKIE_NAME,
    signToken(userId),
    remember ? { ...baseCookie, maxAge: SEVEN_DAYS } : baseCookie,
  );
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, baseCookie);
}
