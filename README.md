# TechFest 2026 - College Festival Management Portal

A full-stack web application for TechFest 2026, featuring event discovery, participant registration, student portal, and organizer/admin management dashboard.

---

## 📁 Repository Structure

```text
techfest2026/
├── frontend/                 # React 19 + Vite frontend
│   ├── public/               # Static assets & icons
│   ├── src/                  # React components, pages, context, and styles
│   │   ├── assets/           # Images and SVG assets
│   │   ├── components/       # Reusable components (Navbar, EventCard, EventList)
│   │   ├── context/          # ThemeContext (Dark/Light mode)
│   │   ├── data/             # Static reference data
│   │   ├── pages/            # Application pages (Home, Events, Dashboard, etc.)
│   │   ├── api.js            # Centralized API base URL
│   │   ├── App.jsx           # Routes and main layout
│   │   └── index.css         # Neo-brutalist styling system
│   ├── index.html            # Main HTML entry
│   ├── package.json          # Frontend dependencies & scripts
│   └── vite.config.js        # Vite bundler configuration
│
└── techfest-backend/         # Express + Node.js + MongoDB API
    ├── middleware/           # Auth (JWT), error handlers, request logger
    ├── models/               # Mongoose schemas (User, Event, Registration)
    ├── routes/               # API routes (/api/auth, /api/events, /api/registrations)
    ├── .env.example          # Environment variables template
    ├── package.json          # Backend dependencies & scripts
    ├── seed.js               # Database seeder (admin user & default events)
    └── server.js             # Express application entry point
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

---

### 2. Backend Setup (`techfest-backend`)

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd techfest-backend
   ```
2. Ensure dependencies are installed:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` (copy from `.env.example` if needed):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/techfest
   JWT_SECRET=mysecretkey
   ```
4. Seed default events and admin user:
   ```bash
   npm run seed
   ```
   *Default Admin:* `admin@techfest.com` / `admin123`
5. Start the backend server:
   ```bash
   npm run dev
   # or npm start
   ```
   Server will run on `http://localhost:5000`.

---

### 3. Frontend Setup (`frontend`)

1. Open a separate terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Ensure dependencies are installed:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`.
