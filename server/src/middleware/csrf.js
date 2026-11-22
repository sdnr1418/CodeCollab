// CSRF protection (Lecture 24/25: cross-site request forgery), "double submit" style.
// GET /api/csrf-token gives the client a token and sets a matching httpOnly cookie.
// Every POST/PATCH/DELETE must send that token back in the "x-csrf-token" header.
// Another website can make the browser send our cookies, but it can't read the token,
// so it can't make a valid request. (Our login cookie is also SameSite=strict: two layers.)
import { doubleCsrf } from "csrf-csrf";
import { env, isProduction } from "../config/env.js";

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => env.csrfSecret,
  // Ties the token to the login cookie, so a token from before you logged in stops working
  getSessionIdentifier: (req) => req.cookies.token ?? "",
  cookieName: isProduction ? "__Host-csrf" : "csrf",
  cookieOptions: {
    sameSite: "strict",
    secure: isProduction,
    httpOnly: true,
    path: "/",
  },
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
  errorConfig: { message: "Invalid security token (CSRF). Please try again." },
});

export const csrfProtection = doubleCsrfProtection; // GET, HEAD and OPTIONS are let through

// GET /api/csrf-token
export function sendCsrfToken(req, res) {
  res.json({ csrfToken: generateCsrfToken(req, res) });
}
