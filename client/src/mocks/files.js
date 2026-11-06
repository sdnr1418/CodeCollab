export const mockFiles = [
  {
    id: 'f1',
    roomId: 'room-dsa',
    name: 'main.cpp',
    language: 'cpp',
    content:
      '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from CodeCollab!" << endl;\n    return 0;\n}\n',
  },
  {
    id: 'f2',
    roomId: 'room-dsa',
    name: 'notes.py',
    language: 'python',
    content: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("team"))\n',
  },
  {
    id: 'f3',
    roomId: 'room-web',
    name: 'app.js',
    language: 'javascript',
    content: "const greet = (name) => `Hello, ${name}!`\nconsole.log(greet('class'))\n",
  },
]