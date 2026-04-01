# How to Run — FAANG/MAANG Interview Prep Coach

## Prerequisites

| Tool | Version | Check Command |
|------|---------|---------------|
| Python | 3.12+ | `python --version` |
| Node.js | 18+ | `node --version` |
| Docker Desktop | Latest | `docker --version` |
| Git | Any | `git --version` |

---

## Quick Start (Manual — Recommended for Development)

### Step 1 — Clone & Navigate

```powershell
cd D:\full_end_to_end_project_implementation\FAANG_MAANG_PREPARATION_HELPER_PROJECT\FAANG_Lead_Interview_Prep_Project
```

### Step 2 — Start PostgreSQL via Docker

Docker Desktop must be running first.

```powershell
# Start Docker Desktop (if not already running)
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Wait ~30 seconds for Docker to initialize, then:
docker-compose up -d postgres
```

Verify it's ready:

```powershell
docker exec faang_prep_db pg_isready -U faang_user -d faang_prep
# Expected: /var/run/postgresql:5432 - accepting connections
```

### Step 3 — Configure Backend Environment

```powershell
cd backend

# Copy the example env file (skip if backend\.env already exists)
copy .env.example .env
```

Edit `backend\.env` and add **at least one** LLM API key:

```env
# Choose your provider: openai | anthropic | google
LLM_PROVIDER=openai

# Add your actual API key (replace the placeholder)
OPENAI_API_KEY=sk-your-actual-openai-key
# OR
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key
# OR
GOOGLE_API_KEY=your-actual-google-key

# Database (no change needed if using the Docker postgres above)
DATABASE_URL=postgresql+asyncpg://faang_user:faang_pass_2024@localhost:5432/faang_prep
```

> **Important:** Set `LLM_PROVIDER` to match whichever key you provide.

### Step 4 — Install Backend Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### Step 5 — Install Playwright Browser (for LeetCode Login)

```powershell
pip install playwright
python -m playwright install chromium
```

### Step 6 — Run Database Migrations

```powershell
cd backend
python -m alembic upgrade head
```

### Step 7 — Start the Backend Server

```powershell
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Verify:

```powershell
# In a new terminal
Invoke-WebRequest -Uri http://localhost:8000/api/health -UseBasicParsing | Select-Object -ExpandProperty Content
# Expected: {"status":"ok","provider":"openai"}
```

### Step 8 — Configure Frontend Environment

```powershell
cd frontend

# Copy the example env file (skip if frontend\.env already exists)
copy .env.example .env
```

The default `frontend\.env` contents:

```env
VITE_API_URL=http://localhost:8000
```

### Step 9 — Install Frontend Dependencies & Start

```powershell
cd frontend
npm install
npm run dev
```

### Step 10 — Open the App

Open your browser and go to:

```
http://localhost:5173
```

---

## Quick Start (Docker Compose — All Services)

This starts PostgreSQL, Backend, and Frontend together in Docker.

### Step 1 — Configure Environment Files

```powershell
# Backend env
copy backend\.env.example backend\.env
# Edit backend\.env and add your LLM API key (see Step 3 above)

# Frontend env
copy frontend\.env.example frontend\.env
```

### Step 2 — Start Everything

```powershell
docker-compose up --build
```

### Step 3 — Open the App

```
http://localhost:5173
```

To stop:

```powershell
docker-compose down
```

---

## Services Summary

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React (Vite) UI |
| Backend | http://localhost:8000 | FastAPI server |
| API Docs | http://localhost:8000/docs | Swagger UI |
| PostgreSQL | localhost:5432 | Database |

---

## Troubleshooting

### "ERR_EMPTY_RESPONSE" or "Network Error" from frontend

**Cause:** Backend is not running or crashed on startup.

```powershell
# Check if backend is listening
netstat -ano | findstr ":8000.*LISTENING"

# Restart backend
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### "The api_key client option must be set"

**Cause:** The `.env` file is not found or API key is missing/placeholder.

- Ensure `backend\.env` exists with a real API key.
- The app resolves `.env` relative to `backend/app/config.py`, so it works from any working directory.

### "ModuleNotFoundError: No module named 'app'"

**Cause:** Uvicorn started from the wrong directory.

```powershell
# Fix: either cd into backend/ first
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# OR use --app-dir from project root
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --app-dir backend
```

### "Browser process produced no output" (LeetCode Login)

**Cause:** Playwright Chromium browser not installed.

```powershell
python -m playwright install chromium
```

### PostgreSQL connection refused

**Cause:** Docker PostgreSQL container is not running.

```powershell
# Start Docker Desktop first, then:
docker-compose up -d postgres

# Verify
docker exec faang_prep_db pg_isready -U faang_user -d faang_prep
```

### Port already in use

```powershell
# Find the process using the port (e.g., 8000)
netstat -ano | findstr ":8000.*LISTENING"

# Kill it by PID
taskkill /PID <PID_NUMBER> /F
```

---

## Stopping the Application

### Manual setup

- Press `Ctrl+C` in the backend terminal
- Press `Ctrl+C` in the frontend terminal
- Stop PostgreSQL: `docker-compose down`

### Docker Compose setup

```powershell
docker-compose down
# To also remove the database volume:
docker-compose down -v
```

---

## Daily Startup (Returning to the Project)

No need to reinstall dependencies or run migrations again. Just run these 4 steps:

**Step 1 — Start Docker Desktop**

```powershell
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
# Wait ~30 seconds for Docker to initialize
```

**Step 2 — Start PostgreSQL**

```powershell
cd D:\full_end_to_end_project_implementation\FAANG_MAANG_PREPARATION_HELPER_PROJECT\FAANG_Lead_Interview_Prep_Project
docker-compose up -d postgres
```

**Step 3 — Start Backend** *(open a new terminal)*

```powershell
cd D:\full_end_to_end_project_implementation\FAANG_MAANG_PREPARATION_HELPER_PROJECT\FAANG_Lead_Interview_Prep_Project\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Step 4 — Start Frontend** *(open another new terminal)*

```powershell
cd D:\full_end_to_end_project_implementation\FAANG_MAANG_PREPARATION_HELPER_PROJECT\FAANG_Lead_Interview_Prep_Project\frontend
npm run dev
```

**Step 5 — Open the App**

```
http://localhost:5173
```
