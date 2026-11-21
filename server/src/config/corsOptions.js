// CORS (Lecture 24/25): only our React app may call the API from a browser,
// and it may send cookies (credentials) because login uses an httpOnly cookie.
import { env } from "./env.js";

export const corsOptions = {
  origin: env.clientOrigin,
  credentials: true,
};
