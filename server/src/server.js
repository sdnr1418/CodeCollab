// Entry point: connect to MongoDB first, then start listening.
import http from "node:http";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const server = http.createServer(app);

try {
  await connectDB();
  server.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}/api`);
  });
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  process.exit(1);
}
