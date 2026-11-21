// Connects to MongoDB with Mongoose.
import mongoose from "mongoose";
import { env } from "./env.js";

// Strict queries, and strip operators like { $gt: '' } out of query filters,
// which blocks NoSQL injection (Lecture 24/25: never trust user input).
mongoose.set("strictQuery", true);
mongoose.set("sanitizeFilter", true);

export async function connectDB() {
  // Give up after 10 seconds instead of 30, so a wrong URI fails fast
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log(
    `MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`,
  );
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
