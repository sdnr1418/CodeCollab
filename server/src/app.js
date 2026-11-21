// The Express app: middleware in order, then routes, then the error handler.
// server.js starts it; Socket.IO is attached there in Phase 3.
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

const app = express();

app.use(helmet()); // security headers (XSS, clickjacking, sniffing)
app.use(cors(corsOptions)); // only our client origin, with cookies
app.use(compression()); // gzip responses (Lecture 27)
app.use(express.json({ limit: "1mb" })); // read JSON bodies, refuse huge ones
app.use(cookieParser()); // read the login cookie (used from Step 19)
if (!isProduction) app.use(morgan("dev")); // log each request in the terminal

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
