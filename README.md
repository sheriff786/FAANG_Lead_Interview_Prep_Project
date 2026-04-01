# FAANG/MAANG Interview Prep Coach

A full-stack, multi-agent AI-powered LeetCode coaching and System Design preparation platform for cracking FAANG/MAANG interviews.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                 │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐ │
│  │  Left    │ │  Analysis │ │  System  │ │ Resources │ │
│  │  Panel   │ │  Chat     │ │  Design  │ │ + YouTube │ │
│  └──────────┘ └───────────┘ └──────────┘ └───────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │  REST API (Axios)
┌────────────────────▼────────────────────────────────────┐
│               FastAPI Backend (Python)                   │
│  ┌─────────────────────────────────────────────────┐    │
│  │            Multi-Agent Orchestrator              │    │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────┐         │    │
│  │  │ Problem  │ │ Strategy │ │  Code   │         │    │
│  │  │ Analyst  │ │  Coach   │ │ Mentor  │         │    │
│  │  └──────────┘ └──────────┘ └─────────┘         │    │
│  │  ┌──────────┐ ┌──────────────────────┐         │    │
│  │  │ Resource │ │ System Design Agent  │         │    │
│  │  │  Finder  │ └──────────────────────┘         │    │
│  │  └──────────┘                                   │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │                                  │
│  ┌─────────┐ ┌───────▼───────┐ ┌───────────────┐       │
│  │LeetCode │ │  LLM Service  │ │YouTube Service│       │
│  │ Service  │ │ (LangChain)  │ └───────────────┘       │
│  └─────────┘ │ OpenAI/Claude │                          │
│              │ /Gemini       │                          │
│              └───────────────┘                          │
└────────────────────┬────────────────────────────────────┘
                     │
              ┌──────▼──────┐
              │ PostgreSQL  │
              │  Database   │
              └─────────────┘
```

## Features

### LeetCode Problem Coaching (5 AI Agents)
- **Problem Analyst** — Decodes what the problem really asks, key observations, edge cases
- **Strategy Coach** — Identifies patterns (13+ types), step-by-step approach, mental models
- **Code Mentor** — Pseudocode, Python solution, complexity analysis, common mistakes
- **Resource Finder** — Drill plans, interview scripts, company targeting
- **System Design Agent** — Full FAANG-level system design breakdowns

### Core Capabilities
- **Live LeetCode Integration** — Fetch any problem by slug or number (cached in PostgreSQL)
- **YouTube References** — Auto-searches tutorial videos for each problem
- **Switchable LLM** — Use OpenAI GPT-4o, Anthropic Claude, or Google Gemini (one config change)
- **Pattern Detection** — Auto-detects 13+ algorithmic patterns with related problems
- **System Design Prep** — 15+ pre-loaded topics + custom topic support
- **Follow-up Chat** — Ask deeper questions after analysis
- **PostgreSQL Persistence** — All problems, analyses, and chat history stored

## Project Structure

```
├── docker-compose.yml              # PostgreSQL + Backend + Frontend
├── leetcode-coach.html             # Original reference UI
│
├── backend/                        # Python FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   ├── alembic.ini                 # DB migrations
│   ├── alembic/
│   │   └── env.py
│   └── app/
│       ├── main.py                 # FastAPI app entry
│       ├── config.py               # Settings (LLM keys, DB URL)
│       ├── database.py             # SQLAlchemy async engine
│       ├── models/                 # DB models
│       │   ├── problem.py          # LeetCode problems
│       │   ├── analysis.py         # Agent analysis results
│       │   ├── session.py          # Chat messages
│       │   └── system_design.py    # System design topics
│       ├── schemas/                # Pydantic schemas
│       │   ├── problem.py
│       │   └── system_design.py
│       ├── routers/                # API endpoints
│       │   ├── leetcode.py         # POST /api/leetcode/fetch
│       │   ├── agents.py           # POST /api/agents/analyze, /followup
│       │   ├── system_design.py    # System design topics + analyze
│       │   └── youtube.py          # GET /api/youtube/search
│       ├── services/               # Business logic
│       │   ├── llm_service.py      # LangChain LLM abstraction
│       │   ├── leetcode_service.py # LeetCode API + DB caching
│       │   └── youtube_service.py  # YouTube search
│       ├── agents/                 # Multi-agent system
│       │   ├── base_agent.py       # Abstract base agent
│       │   ├── problem_analyst.py
│       │   ├── strategy_coach.py
│       │   ├── code_mentor.py
│       │   ├── resource_finder.py
│       │   └── system_design_agent.py
│       └── utils/
│           └── pattern_detection.py
│
├── frontend/                       # React + TypeScript + Vite
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── api/                    # API client
│       │   ├── index.ts
│       │   ├── leetcode.ts
│       │   ├── agents.ts
│       │   └── systemDesign.ts
│       ├── store/                  # Zustand state management
│       │   ├── types.ts
│       │   └── useAppStore.ts
│       ├── hooks/
│       │   ├── useAgents.ts
│       │   └── useFollowUp.ts
│       ├── utils/
│       │   └── formatMessage.ts
│       └── components/
│           ├── Header.tsx
│           ├── LeftPanel/
│           │   ├── LeftPanel.tsx
│           │   ├── FetchSection.tsx
│           │   ├── ConfigSection.tsx
│           │   ├── AgentStatusPanel.tsx
│           │   └── SessionProgress.tsx
│           ├── ChatArea/
│           │   ├── ChatArea.tsx
│           │   ├── TabBar.tsx
│           │   ├── AnalysisTab.tsx
│           │   ├── StrategyTab.tsx
│           │   ├── SimilarProblemsTab.tsx
│           │   ├── ResourcesTab.tsx
│           │   ├── SystemDesignTab.tsx
│           │   ├── MessageBubble.tsx
│           │   ├── QuickChips.tsx
│           │   └── ChatInput.tsx
│           └── common/
│               └── Loader.tsx
```

## Quick Start

### 1. Configure

```bash
cd FAANG_Lead_Interview_Prep_Project
cp backend/.env.example backend/.env
# Edit backend/.env — add your LLM API key(s)
```

### 2. Start with Docker Compose (recommended)

```bash
docker-compose up --build
```

This starts:
- **PostgreSQL** on port 5432
- **FastAPI backend** on http://localhost:8000
- **React frontend** on http://localhost:5173

### 3. Or Run Manually

**Database:**
```bash
docker run -d --name pg -e POSTGRES_USER=faang_user -e POSTGRES_PASSWORD=faang_pass_2024 -e POSTGRES_DB=faang_prep -p 5432:5432 postgres:16-alpine
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Open http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leetcode/fetch` | Fetch problem from LeetCode |
| POST | `/api/agents/analyze` | Run all 4 agents on a problem |
| POST | `/api/agents/followup` | Follow-up chat |
| GET | `/api/system-design/topics` | List system design topics |
| POST | `/api/system-design/analyze` | Analyze a system design topic |
| GET | `/api/youtube/search?q=...` | Search YouTube videos |
| GET | `/api/health` | Health check |

## LLM Configuration

Edit `backend/.env` to switch providers:

```env
# Use OpenAI (default)
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Use Anthropic Claude
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Use Google Gemini
LLM_PROVIDER=google
GOOGLE_API_KEY=AI...
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Zustand, Axios
- **Backend:** Python 3.12, FastAPI, LangChain, SQLAlchemy (async)
- **Database:** PostgreSQL 16
- **LLM:** OpenAI / Anthropic / Google (via LangChain)
- **APIs:** LeetCode (proxy), YouTube Search

## License

MIT