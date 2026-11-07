import { publicUser } from './users'

// Builds a member list like the API will: user info + role + online status
const members = (ownerId, memberIds, onlineIds = []) =>
  [ownerId, ...memberIds].map((id) => ({
    ...publicUser(id),
    role: id === ownerId ? 'owner' : 'member',
    online: onlineIds.includes(id),
  }))

const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000).toISOString()

export const mockRooms = [
  {
    id: 'k3x-92q',
    name: 'Graph Algorithms Lab',
    language: 'cpp',
    ownerId: 'u1',
    members: members('u1', ['u2', 'u3', 'u4'], ['u1', 'u2', 'u3', 'u4']),
    updatedAt: minutesAgo(12),
  },
  {
    id: 'p7d-41m',
    name: 'DSA Assignment 3',
    language: 'cpp',
    ownerId: 'u1',
    members: members('u1', ['u3', 'u5'], ['u1']),
    updatedAt: minutesAgo(120),
  },
  {
    id: 'r2b-88z',
    name: 'ML Notebook Prep',
    language: 'python',
    ownerId: 'u1',
    members: members('u1', ['u4'], ['u1']),
    updatedAt: minutesAgo(60 * 26),
  },
  {
    id: 'j9w-15c',
    name: 'OOP Bank System',
    language: 'java',
    ownerId: 'u2',
    members: members('u2', ['u1'], ['u2']),
    updatedAt: minutesAgo(180),
  },
  {
    id: 'w4n-63h',
    name: 'Web Programming Lab',
    language: 'javascript',
    ownerId: 'u3',
    members: members('u3', ['u1', 'u2', 'u4', 'u5']),
    updatedAt: minutesAgo(60 * 50),
  },
  {
    id: 'm8t-27v',
    name: 'Interview Practice',
    language: 'python',
    ownerId: 'u5',
    members: members('u5', ['u1', 'u2']),
    updatedAt: minutesAgo(60 * 24 * 9),
  },
]