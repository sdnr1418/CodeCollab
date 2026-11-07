// color = Tailwind background class used for the user's avatar and cursor
export const mockUsers = [
  {
    id: 'u1',
    name: 'Abdul Moiz',
    email: 'moiz@example.com',
    password: 'password123',
    color: 'bg-indigo-500',
  },
  {
    id: 'u2',
    name: 'Saad Nasir',
    email: 'saad@example.com',
    password: 'password123',
    color: 'bg-pink-600',
  },
  {
    id: 'u3',
    name: 'Leo Kim',
    email: 'leo@example.com',
    password: 'password123',
    color: 'bg-emerald-600',
  },
  {
    id: 'u4',
    name: 'Sara Okafor',
    email: 'sara@example.com',
    password: 'password123',
    color: 'bg-sky-600',
  },
  {
    id: 'u5',
    name: 'Jamal Reyes',
    email: 'jamal@example.com',
    password: 'password123',
    color: 'bg-amber-600',
  },
]

// What an API would send back about a user (never the password)
export const publicUser = (id) => {
  const { password: _omit, email: _email, ...user } = mockUsers.find((u) => u.id === id)
  return user
}