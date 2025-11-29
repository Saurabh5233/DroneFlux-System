# DroneFlux System

DroneFlux System is a full‑stack platform for managing drone delivery operations. It provides a web dashboard for operators, real‑time tracking on interactive maps, and a backend API for authentication, routing, and integration with external services.

## Monorepo Structure

```text
DroneFlux-System/
├─ client/       # React + Vite frontend (Leaflet map, basic UI)
├─ Frontend2/    # React + TypeScript + shadcn UI frontend (advanced dashboard)
├─ server/       # Node.js/Express backend API
├─ package.json  # Root dependencies (shared utilities, e.g. uuid)
└─ .gitignore
```

### client

- **Stack:** React 18, Vite, Tailwind CSS, React Router, React Leaflet, Socket.IO client.
- **Use cases (typical):**
  - Operator dashboard
  - Map view with drone locations
  - Basic management views for deliveries/routes.

### Frontend2

- **Stack:** React 18 + TypeScript, Vite, Tailwind CSS, shadcn/radix UI components, React Router, TanStack Query, Supabase client.
- **Use cases (typical):**
  - New/advanced dashboard UI
  - Rich forms, charts, and panels for operations and analytics
  - Authentication and data fetching via Supabase/REST.

### server

- **Stack:** Node.js (ES modules), Express, MongoDB (via Mongoose), Socket.IO, JWT auth, Google APIs, bcrypt, CORS, Helmet, Morgan.
- **Use cases (typical):**
  - REST API for drones, missions, users, and deliveries
  - Authentication & authorization (JWT, Google OAuth)
  - Real‑time updates via WebSockets
  - Integration with Google APIs (e.g. mapping, routing, or identity).

---

## Getting Started

### Prerequisites

- **Node.js** (recommended: latest LTS)
- **npm** (bundled with Node)
- A running **MongoDB** instance (local or cloud, e.g. MongoDB Atlas) for the backend.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd DroneFlux-System
```

### 2. Install dependencies

Install dependencies for each part of the monorepo:

```bash
# (Optional) root-level deps used by shared tooling
npm install

# Backend API
cd server
npm install

# Simple/legacy frontend
cd ../client
npm install

# New/advanced dashboard frontend
cd ../Frontend2
npm install
```

---

## Environment Configuration

The backend uses `dotenv`, `mongoose`, JWT, Google APIs, and other libraries, so you will need a `.env` file in `server/`.

Create `server/.env` and add the variables your backend code expects, for example:

```bash
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
CLIENT_ORIGIN=http://localhost:5173
FRONTEND2_ORIGIN=http://localhost:5174
PORT=5000
```

> Adjust the variable names and ports to match what is actually used in your server configuration files.

If you use Supabase from `Frontend2`, you will also need its environment variables (usually in a `.env` or `.env.local` inside `Frontend2/`), for example:

```bash
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## Running the Project

Open **three terminals** (or panes) in the project root and run the following commands.

### 1. Start the backend (server)

```bash
cd server
npm run dev
# or for production
# npm start
```

By default this usually runs on `http://localhost:5000` (check your `server.js` for the actual port).

### 2. Start the `client` frontend

```bash
cd client
npm run dev
```

Vite will show the local URL, typically `http://localhost:5173`.

### 3. Start the `Frontend2` frontend

```bash
cd Frontend2
npm run dev
```

This will run on another port (e.g. `http://localhost:5174`).

---

## Scripts Reference

### Root

- Dependencies: `uuid` (can be used by sub‑projects or scripts).

### client

- `npm run dev` – Start Vite dev server.
- `npm run build` – Build for production.
- `npm run preview` – Preview production build.
- `npm run lint` – Lint React code with ESLint.

### Frontend2

- `npm run dev` – Start Vite dev server (React + TS + shadcn UI).
- `npm run build` – Production build.
- `npm run build:dev` – Build in development mode.
- `npm run preview` – Preview production build.
- `npm run lint` – Lint code with ESLint and TypeScript support.

### server

- `npm run dev` – Run backend with Nodemon (auto‑restart on file changes).
- `npm start` – Run backend with Node for production.

---

## Technologies Used

**Frontend (client & Frontend2)**
- React, React Router
- Vite
- Tailwind CSS, tailwind-merge, tailwindcss-animate
- shadcn/radix UI components (in `Frontend2`)
- Leaflet / React Leaflet (mapping in `client`)
- TanStack Query, React Hook Form, Zod (forms & data, in `Frontend2`)
- Socket.IO client (real‑time updates)

**Backend (server)**
- Node.js (ESM)
- Express
- MongoDB + Mongoose
- JWT, bcryptjs
- Socket.IO
- Google APIs
- CORS, Helmet, Morgan

---

## Development Notes

- Keep frontend and backend ports consistent with your `.env` and CORS configuration.
- When adding new environment variables, document them in this README or in an `.env.example` file.
- Consider using one of the frontends as the **primary** UI (either `client` or `Frontend2`) and deprecating the other if it is no longer needed.

---

## License

This project is licensed under the **MIT License** (as specified in `server/package.json`).
