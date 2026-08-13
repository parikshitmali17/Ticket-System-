# Support Ticket System

A full-stack support ticket application where customers submit questions and receive AI-generated responses. Tickets are categorized automatically and stored in PostgreSQL.

**Stack:** React (Vite) · Express · PostgreSQL · Google Gemini AI · Tailwind CSS

---

## Features

- Create a support ticket (customer name, email, question)
- AI-generated reply using Google Gemini
- Automatic category detection: Technical, Billing, Account, General
- View all tickets with filter and sort
- Ticket detail panel with the AI response
- Form validation on the frontend

---

## Prerequisites

Install these before running the project:

| Requirement | Notes |
|-------------|--------|
| **Node.js** 18+ | [nodejs.org](https://nodejs.org/) |
| **PostgreSQL** | Local install, running and accessible |
| **Gemini API key** | From [Google AI Studio](https://aistudio.google.com/apikey) |

---

## Project structure

```
Ticket System/
├── Backend/     # Express API + PostgreSQL + Gemini
└── Frontend/    # React (Vite) UI
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Set up the database

Open PostgreSQL (psql, pgAdmin, or another client) and create the database:

```sql
CREATE DATABASE support_ticket_db;
```

The app creates the `support_tickets` table automatically when the backend starts.

### 3. Backend setup

```bash
cd Backend
npm install
```

Copy the example env file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Edit `Backend/.env` with your values:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/support_ticket_db
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace:
- `YOUR_PASSWORD` with your PostgreSQL password
- `your_gemini_api_key_here` with your Gemini API key

Start the backend:

```bash
npm run dev
```

You should see something like:

```
PostgreSQL connected and support_tickets table is ready
Server started on port 5000
```

API base URL: `http://localhost:5000`

Optional (manual DB init):

```bash
npm run db:init
```

### 4. Frontend setup

Open a **second** terminal:

```bash
cd Frontend
npm install
```

Optional — create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

If you skip this file, Vite’s dev proxy still forwards `/api` requests to `http://localhost:5000`.

Start the frontend:

```bash
npm run dev
```

App URL: `http://localhost:5173`

---

## Running the app

1. Start **PostgreSQL**
2. Start the **backend** (`Backend` → `npm run dev`)
3. Start the **frontend** (`Frontend` → `npm run dev`)
4. Open [http://localhost:5173](http://localhost:5173)

### Typical flow

1. Fill in name, email, and question on **Create Ticket**
2. Submit — you get a success screen with the ticket ID
3. Open **Support Tickets** to see the list, filter/sort, and AI replies

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/api/tickets` | Create a ticket (triggers AI response) |
| `GET` | `/api/tickets` | List all tickets |

### Create ticket body

```json
{
  "customerName": "Jane Doe",
  "email": "jane@example.com",
  "question": "I was charged twice for my subscription."
}
```

---

## Environment variables

### Backend (`Backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default `5000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |

### Frontend (`Frontend/.env`) — optional in local dev

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend URL (default uses Vite proxy to port `5000`) |

> **Never commit real `.env` files.** Use `.env.example` as the template.

---

## Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API (production) |
| `npm run db:init` | Initialize database schema |
| `npm test` | Run tests |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Oxlint |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Backend won’t start / DB error | Check PostgreSQL is running and `DATABASE_URL` password/database name are correct |
| `DATABASE_URL` placeholder error | Replace `YOUR_PASSWORD` in `.env` with your real password |
| Frontend can’t reach API | Ensure backend is on port `5000`, or set `VITE_API_URL=http://localhost:5000` |
| AI replies fail | Verify `GEMINI_API_KEY` is valid and not expired |
| Port already in use | Change `PORT` in `Backend/.env`, or stop the process using that port |

---

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Hook Form, Zod
- **Backend:** Node.js, Express 5, `pg`, dotenv
- **AI:** Google Gemini (`@google/genai`)
- **Database:** PostgreSQL

---

## License

ISC
