# CodeCollab

A real-time collaborative code editor where multiple users can write, edit, run and discuss code together in one shared editor.

Web Programming project, FAST-NUCES Lahore, by **Abdul Moiz (23L-2632)** and **Saad Nasir (23L-2625)**.

## Features
- Register, log in and log out (JWT authentication)
- Rooms with Owner and Member roles; create, join, delete, invite and remove members
- Real-time collaborative editing in Monaco Editor
- Syntax highlighting for C++, Java, Python and JavaScript
- Create, rename, edit and delete files in a project
- Dashboard of owned and joined projects
- Real-time chat and active users list in each room
- Code execution with output display

## Tech stack
| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Redux Toolkit, Tailwind CSS, Monaco Editor |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Real time | Socket.IO, Yjs |
| Code execution | Judge0 |

## Project status
- [ ] Phase 1: React frontend with mock data
- [ ] Phase 2: Express + MongoDB backend and auth
- [ ] Phase 3: Real-time collaboration, chat and code execution

## Getting started
Requires Node.js 20+.
```bash
git clone https://github.com/sdnr1418/CodeCollab.git
cd CodeCollab/client
npm install
npm run dev
```
Then open http://localhost:5173.

## Team workflow
- `main`: stable code only, merged from `dev`
- `dev`: integration branch, features are merged here first
- `feature/<name>`: one branch per task, merged into `dev` by pull request with one review