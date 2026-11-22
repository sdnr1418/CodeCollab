// A CodeCollab account. The password is only ever stored as a bcrypt hash.
import mongoose from "mongoose";

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-pink-600",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-amber-600",
  "bg-violet-600",
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // select: false = never loaded unless a query asks for it with .select('+passwordHash')
    passwordHash: { type: String, required: true, select: false },
    // Tailwind class for the avatar, same as the Phase 1 mock users
    color: {
      type: String,
      default: () =>
        AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    },
  },
  { timestamps: true },
);

// What the API sends to the browser: { id, name, email, color }, never the hash
userSchema.set("toJSON", {
  transform: (doc, ret) => ({
    id: ret._id.toString(),
    name: ret.name,
    email: ret.email,
    color: ret.color,
  }),
});

export const User = mongoose.model("User", userSchema);
