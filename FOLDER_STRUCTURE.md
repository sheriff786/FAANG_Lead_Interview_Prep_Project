# FAANG/MAANG Interview Prep — Folder Structure

> Complete directory layout with descriptions of every file and folder.

```
FAANG_Lead_Interview_Prep_Project/
│
├── .gitignore                          # Git ignore rules for Python + Node + IDE + OS
├── docker-compose.yml                  # Container orchestration (PostgreSQL, Backend, Frontend)
├── README.md                           # Project documentation & quick-start guide
├── FOLDER_STRUCTURE.md                 # ← You are here
├── ARCHITECTURE.md                     # System architecture, tech stack, deployment, future scope
├── LICENSE                             # Project license
├── leetcode-coach.html                 # Original standalone HTML prototype / reference UI
│
│
├── backend/                            # ═══ PYTHON FASTAPI BACKEND ═══
│   ├── .env                            # Environment secrets (API keys, DB URL) — git-ignored
│   ├── .env.example                    # Template for .env — safe to commit
│   ├── requirements.txt                # Python dependencies (FastAPI, LangChain, SQLAlchemy…)
│   ├── Dockerfile                      # Docker image: python:3.12-slim + pip install
│   ├── alembic.ini                     # Alembic migration configuration
│   │
│   ├── alembic/                        # ── Database Migrations ──
│   │   ├── env.py                      # Migration environment (async engine setup)
│   │   └── versions/
│   │       └── .gitkeep                # Placeholder — migration files auto-generated here
│   │
│   └── app/                            # ── Application Source Code ──
│       ├── __init__.py                 # Package marker
│       ├── main.py                     # FastAPI entry point: lifespan, CORS, router registration
│       ├── config.py                   # Pydantic Settings: LLM provider, keys, DB URL, CORS
│       ├── database.py                 # Async SQLAlchemy engine, session factory, init_db()
│       │
│       ├── agents/                     # ── AI Agent Definitions (5 agents) ──
│       │   ├── __init__.py
│       │   ├── base_agent.py           # Abstract BaseAgent class (build_system_prompt, run)
│       │   ├── problem_analyst.py      # Agent 1 — Problem understanding & edge case breakdown
│       │   ├── strategy_coach.py       # Agent 2 — Pattern identification & approach planning
│       │   ├── code_mentor.py          # Agent 3 — Pseudocode, Python solution, complexity
│       │   ├── resource_finder.py      # Agent 4 — 7-day drill plan, interview script, company info
│       │   └── system_design_agent.py  # Agent 5 — System design: requirements → HLD → deep dive
│       │
│       ├── models/                     # ── SQLAlchemy ORM Models (4 tables) ──
│       │   ├── __init__.py
│       │   ├── problem.py              # Problem table — cached LeetCode problems
│       │   ├── analysis.py             # Analysis table — cached agent outputs per problem
│       │   ├── system_design.py        # SystemDesignTopic — cached system design analyses
│       │   └── session.py              # ChatMessage — follow-up conversation history
│       │
│       ├── schemas/                    # ── Pydantic Request/Response Schemas ──
│       │   ├── __init__.py
│       │   ├── problem.py              # ProblemFetch, ProblemOut, AnalysisRequest, FullAnalysisOut
│       │   └── system_design.py        # SystemDesignRequest, SystemDesignOut
│       │
│       ├── routers/                    # ── FastAPI Route Handlers (4 routers) ──
│       │   ├── __init__.py
│       │   ├── leetcode.py             # POST /api/leetcode/fetch — fetch & cache problem
│       │   ├── agents.py               # POST /api/agents/analyze — orchestrate all agents
│       │   │                           # POST /api/agents/followup — follow-up chat
│       │   ├── system_design.py        # GET  /api/system-design/topics — 15 predefined topics
│       │   │                           # POST /api/system-design/analyze — full SD breakdown
│       │   └── youtube.py              # GET  /api/youtube/search — video search
│       │
│       ├── services/                   # ── Business Logic Layer ──
│       │   ├── __init__.py
│       │   ├── llm_service.py          # LangChain abstraction: OpenAI / Anthropic / Google
│       │   ├── leetcode_service.py     # Fetch from LeetCode API, HTML cleanup, DB caching
│       │   └── youtube_service.py      # YouTube search via library + optional Data API fallback
│       │
│       └── utils/                      # ── Utility Functions ──
│           ├── __init__.py
│           └── pattern_detection.py    # 13 regex pattern rules + curated similar problems DB
│
│
├── frontend/                           # ═══ REACT + TYPESCRIPT FRONTEND ═══
│   ├── .env.example                    # Frontend env template (API base URL)
│   ├── Dockerfile                      # Docker image: node:20-alpine + npm install
│   ├── package.json                    # NPM dependencies & scripts (dev, build, preview)
│   ├── package-lock.json               # Locked dependency tree
│   ├── tsconfig.json                   # TypeScript compiler configuration
│   ├── vite.config.ts                  # Vite build tool configuration + React plugin
│   ├── index.html                      # HTML shell — mounts React at <div id="root">
│   │
│   └── src/                            # ── Application Source Code ──
│       ├── main.tsx                    # React entry — renders <App /> into #root
│       ├── App.tsx                     # Root layout: Header + LeftPanel + ChatArea
│       ├── index.css                   # Global styles, CSS variables, dark theme, animations
│       ├── vite-env.d.ts              # Vite TypeScript ambient declarations
│       │
│       ├── api/                        # ── HTTP Client Layer (Axios) ──
│       │   ├── index.ts               # Axios instance (baseURL, timeout, headers)
│       │   ├── leetcode.ts            # fetchProblem() → POST /api/leetcode/fetch
│       │   ├── agents.ts             # runAnalysis() + sendFollowUp() → /api/agents/*
│       │   └── systemDesign.ts        # getTopics() + analyzeDesign() → /api/system-design/*
│       │
│       ├── store/                      # ── Zustand State Management ──
│       │   ├── types.ts               # All TypeScript interfaces & type definitions
│       │   └── useAppStore.ts         # Global store: config, problem, agents, messages, actions
│       │
│       ├── hooks/                      # ── Custom React Hooks ──
│       │   ├── useAgents.ts           # startAnalysis() — orchestrates full agent pipeline
│       │   └── useFollowUp.ts         # handleFollowUp() — sends follow-up questions
│       │
│       ├── components/                 # ── UI Components ──
│       │   ├── Header.tsx             # App header: logo, title, multi-agent badge
│       │   │
│       │   ├── LeftPanel/             # ── Sidebar Components ──
│       │   │   ├── LeftPanel.tsx       # Sidebar container + "Analyze Problem" button
│       │   │   ├── FetchSection.tsx    # LeetCode slug/ID input + manual paste option
│       │   │   ├── ConfigSection.tsx   # Difficulty (Easy/Med/Hard) + Level (Beginner/Inter/Adv)
│       │   │   ├── AgentStatusPanel.tsx # Real-time agent status (waiting/running/done/error)
│       │   │   └── SessionProgress.tsx # Problems analyzed counter + progress bar
│       │   │
│       │   ├── ChatArea/              # ── Main Content Area Components ──
│       │   │   ├── ChatArea.tsx       # Tab-based layout container
│       │   │   ├── TabBar.tsx         # 5-tab selector (Analysis/Strategy/Similar/Resources/SD)
│       │   │   ├── AnalysisTab.tsx    # Problem Analyst agent output display
│       │   │   ├── StrategyTab.tsx    # Strategy Coach agent output display
│       │   │   ├── SimilarProblemsTab.tsx # Pattern-matched similar LeetCode problems
│       │   │   ├── ResourcesTab.tsx   # Drill plans + YouTube video cards
│       │   │   ├── SystemDesignTab.tsx # System design topic selector + analysis display
│       │   │   ├── MessageBubble.tsx  # Agent-colored message with markdown rendering
│       │   │   ├── ChatInput.tsx      # Follow-up question text input
│       │   │   └── QuickChips.tsx     # 7 suggested quick-action follow-up chips
│       │   │
│       │   └── common/               # ── Shared/Reusable Components ──
│       │       └── Loader.tsx         # Animated loading spinner
│       │
│       └── utils/                      # ── Utility Functions ──
│           └── formatMessage.ts       # Message formatting and markdown parsing helpers
```

---

## File Count Summary

| Area | Files | Description |
|------|-------|-------------|
| **Root** | 6 | Config, docs, Docker, license |
| **Backend — Config** | 5 | .env, requirements.txt, Dockerfile, alembic |
| **Backend — App** | 21 | main, config, database, agents(6), models(4), schemas(2), routers(4), services(3), utils(1) |
| **Frontend — Config** | 7 | package.json, tsconfig, vite config, Dockerfile, HTML |
| **Frontend — Source** | 22 | App, main, CSS, api(4), store(2), hooks(2), components(13) |
| **Total** | **~61** | Full-stack production-ready application |

---

## Quick Navigation

| Want to… | Go to… |
|----------|--------|
| Change LLM provider / API keys | `backend/.env` |
| Add a new AI agent | `backend/app/agents/` — extend `BaseAgent` |
| Add a new API endpoint | `backend/app/routers/` — create router, register in `main.py` |
| Add a new DB table | `backend/app/models/` — create model, import in `__init__.py` |
| Modify UI layout | `frontend/src/App.tsx` |
| Add a new tab | `frontend/src/components/ChatArea/TabBar.tsx` + new tab component |
| Change theme/colors | `frontend/src/index.css` — CSS custom properties |
| Modify state shape | `frontend/src/store/types.ts` + `useAppStore.ts` |
