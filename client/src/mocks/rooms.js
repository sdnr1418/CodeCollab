// role: 'owner' | 'member'
export const mockRooms = [
  {
    id: 'room-dsa',
    name: 'DSA Assignment 3',
    ownerId: 'u1',
    members: [
      { userId: 'u1', role: 'owner' },
      { userId: 'u2', role: 'member' },
    ],
    updatedAt: '2026-11-05T14:20:00Z',
  },
  {
    id: 'room-web',
    name: 'Web Programming Lab',
    ownerId: 'u2',
    members: [
      { userId: 'u2', role: 'owner' },
      { userId: 'u1', role: 'member' },
      { userId: 'u3', role: 'member' },
    ],
    updatedAt: '2026-11-04T09:00:00Z',
  },
]