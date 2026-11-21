// Adds the demo accounts and sample rooms to MongoDB. Safe to run again: existing ones are skipped.
// Run from the server folder:  npm run seed
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { User } from '../models/User.js'
import { Room } from '../models/Room.js'
import { demoUsers, DEMO_PASSWORD } from './demoUsers.js'
import { demoRooms } from './demoRooms.js'

await connectDB()

// 1. Users
const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)
let usersAdded = 0
for (const demo of demoUsers) {
  if (await User.exists({ email: demo.email })) continue
  await User.create({ ...demo, passwordHash })
  usersAdded++
}

// 2. Rooms (members looked up by email)
// (one query per email: sanitizeFilter in config/db.js blocks operators like $in on purpose)
const idByEmail = {}
for (const { email } of demoUsers) {
  idByEmail[email] = (await User.findOne({ email }))._id
}let roomsAdded = 0
for (const demo of demoRooms) {
  if (await Room.exists({ code: demo.code })) continue
  const [ownerEmail] = demo.members
  await Room.create({
    code: demo.code,
    name: demo.name,
    language: demo.language,
    owner: idByEmail[ownerEmail],
    members: demo.members.map((email) => ({
      user: idByEmail[email],
      role: email === ownerEmail ? 'owner' : 'member',
    })),
  })
  roomsAdded++
}

console.log(`Demo users: ${usersAdded} added. Sample rooms: ${roomsAdded} added.`)
await mongoose.disconnect()