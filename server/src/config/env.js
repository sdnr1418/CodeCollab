// Reads settings from server/.env once, so the rest of the code imports `env`
// instead of touching process.env everywhere.
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const required = ["MONGODB_URI"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `Missing in server/.env: ${missing.join(", ")}. Copy .env.example to .env and fill it in.`,
  );
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export const isProduction = env.nodeEnv === "production";
