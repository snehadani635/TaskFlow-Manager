# TaskFlow — Smart Task & Project Manager (MERN + AI)

A lightweight Trello/Asana-style task manager. Users register, create boards,
add tasks across To Do / In Progress / Done columns, set priorities & due dates,
and use an AI helper to suggest effort estimates and due dates.

## Tech Stack
- **Frontend:** React 18 (Vite), React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express, JWT, bcryptjs, express-validator
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini (`gemini-2.0-flash`) free tier — chosen for its
  generous free tier and simple REST API. Includes a deterministic mock
  fallback so the feature works even without a key.

## Features
- JWT auth (register/login/logout), persisted sessions, protected routes
- Boards: create, rename, delete (with confirm), empty state
- Tasks: full CRUD, move between columns, priority badges, overdue cues,
  filter by priority, sort by due date/priority
- AI "Suggest estimate" — secure server-side LLM call returning
  effort + due date + reasoning, with accept/override
- Dark/light mode (persisted), responsive design, 404 page, loading spinners

## Run Locally

### Backend
```bash
cd server
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY (optional)
npm install
npm run dev