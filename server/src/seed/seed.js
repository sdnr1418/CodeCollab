// Adds the demo accounts to MongoDB. Safe to run again: existing accounts are skipped.
// Run from the server folder:  npm run seed
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { demoUsers, DEMO_PASSWORD } from "./demoUsers.js";

await connectDB();

const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
let added = 0;
for (const demo of demoUsers) {
  if (await User.exists({ email: demo.email })) continue;
  await User.create({ ...demo, passwordHash });
  added++;
}

console.log(
  `Demo users: ${added} added, ${demoUsers.length - added} already there.`,
);
await mongoose.disconnect();
