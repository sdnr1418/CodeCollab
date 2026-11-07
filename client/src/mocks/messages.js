import { publicUser } from './users'

const at = (time) => `2026-11-07T${time}:00`

// type: 'message' | 'system'
export const mockMessages = [
  {
    id: 'm1',
    roomId: 'k3x-92q',
    type: 'message',
    user: publicUser('u2'),
    text: 'Pushed the adjacency list into graph.hpp. Can someone check the edge weights in input.txt?',
    sentAt: at('10:42'),
  },
  {
    id: 'm2',
    roomId: 'k3x-92q',
    type: 'message',
    user: publicUser('u3'),
    text: 'On it. Should dist be long long? Test 3 has big weights.',
    sentAt: at('10:43'),
  },
  {
    id: 'm3',
    roomId: 'k3x-92q',
    type: 'message',
    user: publicUser('u1'),
    text: "Good call. I'll switch INF to 1e18 after this run.",
    sentAt: at('10:44'),
  },
  {
    id: 'm4',
    roomId: 'k3x-92q',
    type: 'system',
    text: 'Sara Okafor joined the room',
    sentAt: at('10:45'),
  },
  {
    id: 'm5',
    roomId: 'k3x-92q',
    type: 'message',
    user: publicUser('u2'),
    text: 'Sample input passes. I think line 19 is where test 3 overflows.',
    sentAt: at('10:46'),
  },
]