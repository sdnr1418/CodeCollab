// Adds the demo accounts, sample rooms, and their files and chat to MongoDB. Safe to run again: existing ones are skipped.
// Run from the server folder:  npm run seed
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { User } from '../models/User.js'
import { Room } from '../models/Room.js'
import { demoUsers, DEMO_PASSWORD } from './demoUsers.js'
import { demoRooms } from './demoRooms.js'
import { File } from '../models/File.js'
import { Message } from '../models/Message.js'
import { demoFiles, demoMessages } from './demoContent.js'

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
}
let roomsAdded = 0
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

// 3. Files and chat, only for sample rooms that don't have any yet
let filesAdded = 0
let messagesAdded = 0
for (const demo of demoRooms) {
  const room = await Room.findOne({ code: demo.code })
  if (!(await File.exists({ room: room._id }))) {
    for (const f of demoFiles.filter((x) => x.room === demo.code)) {
      await File.create({ room: room._id, name: f.name, content: f.content })
      filesAdded++
    }
  }
  if (!(await Message.exists({ room: room._id }))) {
    for (const m of demoMessages.filter((x) => x.room === demo.code)) {
      await Message.create({
        room: room._id,
        type: m.type ?? 'message',
        sender: m.from ? idByEmail[m.from] : undefined,
        text: m.text,
      })
      messagesAdded++
    }
  }
}

console.log(
  `Demo users: ${usersAdded} added. Sample rooms: ${roomsAdded} added. Files: ${filesAdded}, messages: ${messagesAdded} added.`,
)
await mongoose.disconnect()