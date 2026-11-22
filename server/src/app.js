// The Express app: middleware in order, then routes, then the error handler.
// server.js starts it and attaches Socket.IO.
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import { corsOptions } from "./config/corsOptions.js";
import { isProduction } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiters.js";
import { csrfProtection } from "./middleware/csrf.js";

const app = express();

// In production the app sits behind the host's proxy (Step 25): trust it, so rate limits
// see each visitor's real IP instead of the proxy's
if (isProduction) app.set("trust proxy", 1);

app.use(helmet()); // security headers (XSS, clickjacking, sniffing)
app.use(cors(corsOptions)); // only our client origin, with cookies
app.use(compression()); // gzip responses (Lecture 27)
app.use(express.json({ limit: "1mb" })); // read JSON bodies, refuse huge ones
app.use(cookieParser()); // read the login cookie (used from Step 19)
if (!isProduction) app.use(morgan("dev")); // log each request in the terminal

app.use("/api", apiLimiter, csrfProtection, apiRoutes); // rate limit, CSRF check, then routes

app.use(notFound);
app.use(errorHandler);

export default app;
