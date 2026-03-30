# FAANG/MAANG Interview Prep — System Architecture

> Multi-Agent AI-Powered LeetCode Coach & System Design Preparation Platform

---

## Table of Contents

1. [Project Purpose](#1-project-purpose)
2. [High-Level Architecture](#2-high-level-architecture)
3. [System Flow Diagram](#3-system-flow-diagram)
4. [Technology Stack](#4-technology-stack)
5. [Component Deep Dive](#5-component-deep-dive)
6. [Database Design](#6-database-design)
7. [Multi-Agent Architecture](#7-multi-agent-architecture)
8. [API Reference](#8-api-reference)
9. [Deployment Guide](#9-deployment-guide)
10. [Cloud Deployment](#10-cloud-deployment)
11. [Future Enhancements](#11-future-enhancements)

---

## 1. Project Purpose

### Problem Statement
Preparing for FAANG/MAANG technical interviews is overwhelming — candidates face 2000+ LeetCode problems, system design topics, and behavioral questions with no structured coaching system.

### Solution
An **AI-powered multi-agent coaching platform** that:
- **Fetches live LeetCode problems** and breaks them down using 5 specialized AI agents
- **Identifies algorithmic patterns** (sliding window, DP, greedy, etc.) across 13+ categories
- **Generates personalized study plans** with 7-day drill schedules
- **Coaches system design** for 15+ common interview topics
- **Provides curated resources** — YouTube tutorials, similar problems, company-specific insights
- **Supports multi-turn coaching** — ask follow-up questions to any agent

### Target Users
- Software engineers preparing for FAANG/MAANG interviews
- CS students transitioning to industry
- Engineers looking to level up their DSA & system design skills

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              React 18 + TypeScript + Vite                    │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │   │
│  │  │ Left Panel │  │  Chat Area │  │   State (Zustand)      │ │   │
│  │  │ • Fetch    │  │  • 5 Tabs  │  │   • Problem data       │ │   │
│  │  │ • Config   │  │  • Messages│  │   • Agent states       │ │   │
│  │  │ • Status   │  │  • Input   │  │   • Analysis results   │ │   │
│  │  └────────────┘  └────────────┘  └────────────────────────┘ │   │
│  │                  Axios HTTP Client                           │   │
│  └──────────────────────────┬───────────────────────────────────┘   │
│                             │ REST API (JSON)                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI + Python)                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  main.py — FastAPI App (CORS, Lifespan, Router Registration) │   │
│  └──────────┬──────────┬──────────────┬────────────┬────────────┘   │
│             │          │              │            │                 │
│  ┌──────────▼──┐ ┌─────▼─────┐ ┌─────▼─────┐ ┌───▼───────┐       │
│  │  Routers    │ │  Services │ │  Agents   │ │   Utils   │       │
│  │ • leetcode  │ │ • llm     │ │ • analyst │ │ • pattern │       │
│  │ • agents    │ │ • leetcode│ │ • strategy│ │   detect  │       │
│  │ • sys_design│ │ • youtube │ │ • code    │ │ • similar │       │
│  │ • youtube   │ │           │ │ • resource│ │   problems│       │
│  └──────┬──────┘ └─────┬─────┘ │ • sys_dsn │ └───────────┘       │
│         │              │       └─────┬─────┘                       │
│         │              │             │                              │
│  ┌──────▼──────────────▼─────────────▼──────────────────────────┐   │
│  │              LangChain LLM Abstraction Layer                  │   │
│  │    ┌──────────┐    ┌───────────┐    ┌────────────────┐       │   │
│  │    │  OpenAI  │    │ Anthropic │    │ Google GenAI   │       │   │
│  │    │  GPT-4o  │    │ Claude 4  │    │ Gemini 1.5 Pro │       │   │
│  │    └──────────┘    └───────────┘    └────────────────┘       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼───────────────────────────────────┐   │
│  │  SQLAlchemy 2.0 (Async) — ORM Layer                          │   │
│  │  Models: Problem │ Analysis │ SystemDesignTopic │ ChatMessage │   │
│  └──────────────────────────┬───────────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PostgreSQL 16 (Docker)                         │
│  ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │  problems  │ │  analyses  │ │ system_design│ │chat_messages │  │
│  │            │ │            │ │   _topics    │ │              │  │
│  └────────────┘ └────────────┘ └──────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

External APIs:
  ├─→ LeetCode Proxy API (leetcode-api-pied.vercel.app)
  ├─→ YouTube Search (youtube-search-python library)
  └─→ YouTube Data API v3 (optional fallback)
```

---

## 3. System Flow Diagram

### Problem Analysis Flow

```
User enters LeetCode slug/ID or pastes problem
              │
              ▼
┌──────────────────────────┐
│  POST /api/leetcode/fetch│
│  Fetch from LeetCode API │
│  Clean HTML → plain text │
│  Cache in PostgreSQL     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ POST /api/agents/analyze │
│                          │
│  ┌─────────────────────┐ │
│  │ Agent 1: Analyst    │ │ → What the problem really asks, edge cases, tricks
│  │ (ProblemAnalyst)    │ │
│  └──────────┬──────────┘ │
│             ▼            │
│  ┌─────────────────────┐ │
│  │ Agent 2: Strategist │ │ → Pattern identification, step-by-step approach
│  │ (StrategyCoach)     │ │
│  └──────────┬──────────┘ │
│             ▼            │
│  ┌─────────────────────┐ │
│  │ Agent 3: Coder      │ │ → Pseudocode, Python solution, complexity analysis
│  │ (CodeMentor)        │ │
│  └──────────┬──────────┘ │
│             ▼            │
│  ┌─────────────────────┐ │
│  │ Agent 4: Resources  │ │ → 7-day drill plan, interview script, company info
│  │ (ResourceFinder)    │ │
│  └──────────┬──────────┘ │
│             ▼            │
│  ┌─────────────────────┐ │
│  │ Pattern Detection   │ │ → Regex-based, 13 pattern categories
│  │ + Similar Problems  │ │ → Curated DB of 60+ companion problems
│  └──────────┬──────────┘ │
│             ▼            │
│  ┌─────────────────────┐ │
│  │ YouTube Search      │ │ → Tutorial videos for the problem
│  └──────────┬──────────┘ │
│             ▼            │
│  Cache all results in DB │
└────────────┬─────────────┘
             │
             ▼
    Frontend displays results
    across 5 tabs + enables
    follow-up chat
```

### System Design Flow

```
User selects topic (e.g., "Design URL Shortener")
              │
              ▼
┌──────────────────────────────────┐
│ POST /api/system-design/analyze  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ Agent 5: SystemDesignAgent │  │
│  │                            │  │
│  │ ① Requirements Gathering   │  │ → Functional + non-functional requirements
│  │ ② High-Level Design        │  │ → Components, data flow, API design
│  │ ③ Deep Dive                │  │ → Scaling, DB choice, caching, trade-offs
│  │ ④ Interview Tips           │  │ → What to say, time management, signals
│  └────────────────────────────┘  │
│                                  │
│  + YouTube tutorials for topic   │
│  + Cache in PostgreSQL           │
└──────────────────────────────────┘
```

---

## 4. Technology Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.12 | Core language |
| **FastAPI** | 0.115 | Async web framework with auto-generated OpenAPI docs |
| **Uvicorn** | 0.30 | ASGI server with hot-reload |
| **SQLAlchemy** | 2.0 | Async ORM with type-safe queries |
| **Alembic** | 1.13 | Database schema migrations |
| **asyncpg** | 0.29 | High-performance async PostgreSQL driver |
| **Pydantic** | 2.9 | Request/response validation & serialization |
| **pydantic-settings** | 2.5 | Environment variable management |
| **LangChain** | 0.3 | LLM abstraction & prompt management |
| **langchain-openai** | 0.2 | OpenAI GPT integration |
| **langchain-anthropic** | 0.2 | Anthropic Claude integration |
| **langchain-google-genai** | 2.0 | Google Gemini integration |
| **httpx** | 0.27 | Async HTTP client for LeetCode API |
| **youtube-search-python** | 1.6 | YouTube search without API key |
| **BeautifulSoup4** | 4.12 | HTML parsing & cleanup |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3 | Component-based UI library |
| **TypeScript** | 5.5 | Static type checking |
| **Vite** | 5.4 | Fast build tool & dev server with HMR |
| **Zustand** | 4.5 | Lightweight global state management |
| **Axios** | 1.7 | Promise-based HTTP client |
| **react-markdown** | 9.0 | Markdown rendering in chat bubbles |
| **react-syntax-highlighter** | 15.5 | Code block syntax highlighting |
| **uuid** | 10.0 | Session ID generation |

### Infrastructure

| Technology | Version | Purpose |
|-----------|---------|---------|
| **PostgreSQL** | 16 (Alpine) | Persistent relational database |
| **Docker** | 29+ | Containerization |
| **Docker Compose** | 2.40+ | Multi-container orchestration |

### Supported LLM Providers

| Provider | Default Model | Switching |
|----------|---------------|-----------|
| **OpenAI** | `gpt-4o` | Set `LLM_PROVIDER=openai` in `.env` |
| **Anthropic** | `claude-sonnet-4-20250514` | Set `LLM_PROVIDER=anthropic` in `.env` |
| **Google** | `gemini-1.5-pro` | Set `LLM_PROVIDER=google` in `.env` |

---

## 5. Component Deep Dive

### 5.1 Backend Components

#### `main.py` — Application Entry Point
- Creates FastAPI app with metadata (title, description, version)
- Configures CORS middleware for frontend origin
- Registers 4 API routers under `/api/` prefix
- Uses `lifespan` to initialize database tables on startup

#### `config.py` — Configuration Management
- Pydantic `Settings` class reads from `.env` file
- Manages: LLM provider selection, API keys, database URL, YouTube API key, CORS origins
- Cached via `@lru_cache` for single-load performance

#### `database.py` — Database Layer
- Async SQLAlchemy engine (`create_async_engine`) with asyncpg driver
- `AsyncSession` factory for request-scoped sessions
- `get_db()` dependency generator for FastAPI injection
- `init_db()` creates all tables on startup

#### `services/llm_service.py` — LLM Abstraction
- `_build_llm()` — Factory function: builds `ChatOpenAI`, `ChatAnthropic`, or `ChatGoogleGenerativeAI`
- `invoke_llm(system_prompt, user_prompt, history)` — Constructs message array, calls LLM
- Settings: `temperature=0.4`, `max_tokens=2048`
- Single LLM instance reused across all agents

#### `services/leetcode_service.py` — Problem Fetching
- Calls `leetcode-api-pied.vercel.app` proxy API (avoids LeetCode auth)
- Resolves both slug (`two-sum`) and numeric ID (`1`) inputs
- Strips HTML from problem description using BeautifulSoup
- Caches fetched problems in PostgreSQL to avoid repeated API calls

#### `services/youtube_service.py` — Video Search
- Primary: `youtube-search-python` library (no API key needed)
- Fallback: YouTube Data API v3 (requires `YOUTUBE_API_KEY`)
- Returns: `{title, url, channel, thumbnail, duration}`

#### `utils/pattern_detection.py` — Pattern Recognition
- 13 regex-based pattern rules matching problem text:
  - Intervals, Greedy, Sliding Window, Two Pointers, Binary Search
  - Dynamic Programming, BFS/Level-Order, Backtracking, DFS
  - Heap/Priority Queue, Stack/Monotonic Stack, Tree/BST, Hash Map/Set
- Curated `SIMILAR_PROBLEMS` dictionary: 60+ companion problems per pattern
- Functions: `detect_pattern(text)`, `get_similar_problems(pattern)`

---

### 5.2 Backend Agents

Each agent extends `BaseAgent` and implements:
- `build_system_prompt()` — Defines the agent's personality and expertise
- `build_user_prompt(context, level)` — Constructs the problem-specific prompt
- `run(context, level)` — Calls `invoke_llm()` and returns response text

| Agent | Role | What It Produces |
|-------|------|-----------------|
| **ProblemAnalystAgent** | Understands the problem | What it *really* asks, hidden constraints, edge cases, required data structures, why it's tricky |
| **StrategyCoachAgent** | Plans the approach | Pattern identification (from 13 categories), step-by-step strategy, mental model, trigger signals that hint at the pattern |
| **CodeMentorAgent** | Writes the solution | Pseudocode first, then clean Python solution, time/space complexity analysis, common mistakes to avoid |
| **ResourceFinderAgent** | Builds study plan | Core concept explanation, 7-day drill plan with companion problems, interview script (what to say to interviewer), company appearances |
| **SystemDesignAgent** | Coaches system design | Functional/non-functional requirements, high-level architecture, deep dive (scaling, DB, caching), interview delivery tips |

---

### 5.3 Frontend Components

#### Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `App.tsx` | Root | Flex layout: Header (top) + LeftPanel (sidebar, 265px) + ChatArea (main) |
| `Header.tsx` | Top | Logo (⚡), title, subtitle, "MULTI-AGENT · LIVE" badge |

#### Left Panel (Sidebar)

| Component | Purpose |
|-----------|---------|
| `LeftPanel.tsx` | Container with "Analyze Problem" button, coordinates all sidebar sub-components |
| `FetchSection.tsx` | Input field for LeetCode slug/ID + "Paste problem" toggle for manual entry |
| `ConfigSection.tsx` | Difficulty selector (Easy/Medium/Hard) + Level selector (Beginner/Intermediate/Advanced) |
| `AgentStatusPanel.tsx` | Shows real-time status of each agent: ⏳ Waiting → 🔄 Running → ✅ Done / ❌ Error |
| `SessionProgress.tsx` | Counter of problems analyzed in session + visual progress bar |

#### Chat Area (Main Content)

| Component | Purpose |
|-----------|---------|
| `ChatArea.tsx` | Tab-based layout: renders active tab + chat input below |
| `TabBar.tsx` | 5 tab buttons: Analysis · Strategy · Similar Problems · Resources · System Design |
| `AnalysisTab.tsx` | Displays Problem Analyst agent output with markdown rendering |
| `StrategyTab.tsx` | Displays Strategy Coach output including pattern identification |
| `SimilarProblemsTab.tsx` | Lists pattern-matched LeetCode problems with direct links |
| `ResourcesTab.tsx` | Shows drill plan text + YouTube video cards (thumbnail, title, channel) |
| `SystemDesignTab.tsx` | Topic selector dropdown → displays requirements / HLD / deep dive sections |
| `MessageBubble.tsx` | Agent-colored chat bubble: renders markdown with syntax-highlighted code blocks |
| `ChatInput.tsx` | Text input with send button for follow-up questions |
| `QuickChips.tsx` | 7 pre-defined follow-up prompts (e.g., "Explain time complexity", "Give me hints") |

#### Shared

| Component | Purpose |
|-----------|---------|
| `Loader.tsx` | Animated spinner for loading states |

#### State Management — Zustand Store

| State Slice | Data |
|-------------|------|
| `config` | difficulty, level, activeTab, sessionId, llmProvider |
| `problem` | slug, title, content, tags, fetched status |
| `agents` | Status map for each agent (idle/running/done/error) |
| `messages` | Chat history array (role, agent, content, timestamp) |
| `analysisResult` | Full cache: analysis_text, strategy_text, code_text, resource_text, pattern, similar_problems, youtube_links |
| `systemDesign` | Selected topic + cached design analysis |
| `sessionStats` | Count of problems analyzed |

#### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useAgents()` | `startAnalysis()` — validates input, calls API, updates agent statuses sequentially, stores results, adds messages |
| `useFollowUp()` | `handleFollowUp()` — sends follow-up question to agent, appends response to chat |

---

## 6. Database Design

### Database: PostgreSQL 16

**Connection:** `postgresql+asyncpg://faang_user:faang_pass_2024@localhost:5432/faang_prep`

### Entity Relationship Diagram

```
┌──────────────────────┐       ┌──────────────────────────────────┐
│      problems        │       │          analyses                │
├──────────────────────┤       ├──────────────────────────────────┤
│ id (PK, SERIAL)     │──┐    │ id (PK, SERIAL)                 │
│ leetcode_id (INT)    │  │    │ problem_id (FK → problems.id)   │
│ title (VARCHAR)      │  └───→│ difficulty (VARCHAR)             │
│ slug (VARCHAR, UNQ)  │       │ level (VARCHAR)                 │
│ difficulty (VARCHAR)  │       │ analysis_text (TEXT)             │
│ content (TEXT)       │       │ strategy_text (TEXT)             │
│ tags (JSON)          │       │ code_text (TEXT)                 │
│ fetched_at (DATETIME)│       │ resource_text (TEXT)             │
└──────────────────────┘       │ detected_pattern (VARCHAR)       │
                               │ created_at (DATETIME)            │
                               └──────────────────────────────────┘

┌──────────────────────────────┐    ┌──────────────────────────────┐
│    system_design_topics      │    │       chat_messages          │
├──────────────────────────────┤    ├──────────────────────────────┤
│ id (PK, SERIAL)             │    │ id (PK, SERIAL)             │
│ title (VARCHAR, UNQ)         │    │ session_id (UUID)            │
│ category (VARCHAR)           │    │ role (VARCHAR)               │
│ description (TEXT)           │    │ agent (VARCHAR, nullable)    │
│ requirements_text (TEXT)     │    │ content (TEXT)               │
│ high_level_design (TEXT)     │    │ order (INT)                  │
│ deep_dive (TEXT)             │    │ created_at (DATETIME)        │
│ llm_provider (VARCHAR)       │    └──────────────────────────────┘
│ created_at (DATETIME)        │
└──────────────────────────────┘
```

### Why PostgreSQL?
- **ACID compliance** — reliable data persistence for cached analyses
- **JSON support** — flexible storage for tags, metadata
- **Async driver (asyncpg)** — non-blocking for FastAPI's async architecture
- **Mature ecosystem** — Alembic migrations, pgAdmin, Docker support
- **Scales well** — handles concurrent users, supports connection pooling

---

## 7. Multi-Agent Architecture

### Design Philosophy

The system uses a **sequential pipeline architecture** where each agent builds on previous context, simulating a real coaching conversation:

```
Problem Text
    │
    ▼
┌─────────────┐     Output feeds into next agent's context
│   Agent 1   │ ────────────────────────────────────────┐
│  Analyst    │  "Here's what this problem really asks"  │
└─────────────┘                                          │
                                                         ▼
                                              ┌─────────────┐
                                              │   Agent 2   │
                                              │  Strategist │
                                              └──────┬──────┘
                                                     │
    ┌────────────────────────────────────────────────┘
    ▼
┌─────────────┐
│   Agent 3   │
│   Coder     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Agent 4   │
│  Resources  │
└─────────────┘
```

### Agent Communication Pattern
1. Each agent has a **system prompt** defining its role, expertise, and output format
2. The **user prompt** includes the problem text + difficulty/level context
3. The orchestrator in `routers/agents.py` runs agents sequentially
4. Results from Agent 1 can be included in Agent 2's context for coherent coaching
5. All outputs are cached in the `analyses` table to avoid redundant LLM calls

### LLM Provider Abstraction
```
                 ┌────────────────────┐
                 │  invoke_llm()      │
                 │  (llm_service.py)  │
                 └─────────┬──────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ OpenAI   │ │Anthropic │ │ Google   │
        │ GPT-4o   │ │Claude 4  │ │Gemini1.5 │
        └──────────┘ └──────────┘ └──────────┘

Switch provider by changing LLM_PROVIDER in .env
No code changes required.
```

---

## 8. API Reference

### Base URL: `http://localhost:8000`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/health` | Health check | — | `{status, provider}` |
| `POST` | `/api/leetcode/fetch` | Fetch LeetCode problem | `{slug_or_id}` | `{title, slug, difficulty, content, tags}` |
| `POST` | `/api/agents/analyze` | Run all 4 agents | `{problem_id, difficulty, level}` | `{analysis, strategy, code, resources, pattern, similar_problems, youtube}` |
| `POST` | `/api/agents/followup` | Follow-up question | `{session_id, message, agent}` | `{response}` |
| `GET` | `/api/system-design/topics` | List 15 design topics | — | `[{title, category, description}]` |
| `POST` | `/api/system-design/analyze` | Analyze design topic | `{title}` | `{requirements, hld, deep_dive, tips}` |
| `GET` | `/api/youtube/search` | Search YouTube | `?q=query&max=5` | `[{title, url, channel, thumbnail}]` |

### Interactive API Docs
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 9. Deployment Guide

### Local Development (Current Setup)

```bash
# 1. Clone the repository
git clone <repo-url>
cd FAANG_Lead_Interview_Prep_Project

# 2. Start PostgreSQL
docker compose up postgres -d

# 3. Backend setup
cd backend
python -m venv .leet              # Create virtual environment
.leet\Scripts\activate            # Activate (Windows)
# source .leet/bin/activate       # Activate (Mac/Linux)
cp .env.example .env              # Create env file
# Edit .env → add your API key
pip install -r requirements.txt   # Install dependencies
uvicorn app.main:app --port 8000 --reload  # Start server

# 4. Frontend setup (new terminal)
cd frontend
npm install                       # Install dependencies
npm run dev                       # Start dev server → localhost:5173
```

### Docker Compose (Full Stack)

```bash
# Start everything with one command
cp backend/.env.example backend/.env   # Add your API key
docker compose up --build

# Services:
#   PostgreSQL → localhost:5432
#   Backend    → localhost:8000
#   Frontend   → localhost:5173
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LLM_PROVIDER` | Yes | `openai` | `openai` / `anthropic` / `google` |
| `OPENAI_API_KEY` | If using OpenAI | — | Your OpenAI API key |
| `ANTHROPIC_API_KEY` | If using Anthropic | — | Your Anthropic API key |
| `GOOGLE_API_KEY` | If using Google | — | Your Google AI API key |
| `DATABASE_URL` | Yes | `postgresql+asyncpg://...` | PostgreSQL connection string |
| `YOUTUBE_API_KEY` | No | — | Optional YouTube Data API v3 key |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | CORS allowed origin |

---

## 10. Cloud Deployment

### Option A: AWS (Recommended for Production)

```
┌─────────────────────────────────────────────────────────┐
│                    AWS Architecture                       │
│                                                          │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ CloudFrt │───→│   S3 Bucket  │    │  ECR         │   │
│  │ (CDN)    │    │  (React SPA) │    │ (Docker Img) │   │
│  └──────────┘    └──────────────┘    └──────┬───────┘   │
│                                             │            │
│  ┌──────────┐    ┌──────────────┐    ┌──────▼───────┐   │
│  │ Route 53 │───→│    ALB       │───→│   ECS/       │   │  
│  │ (DNS)    │    │ (Load Bal.)  │    │   Fargate    │   │
│  └──────────┘    └──────────────┘    └──────┬───────┘   │
│                                             │            │
│                                      ┌──────▼───────┐   │
│                                      │    RDS       │   │
│                                      │ PostgreSQL   │   │
│                                      └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

| Component | AWS Service | Purpose |
|-----------|-------------|---------|
| **Frontend hosting** | S3 + CloudFront | Static React build, global CDN |
| **Backend hosting** | ECS Fargate or EC2 | Containerized FastAPI |
| **Database** | RDS PostgreSQL | Managed, auto-backups |
| **Load balancer** | Application Load Balancer | HTTPS termination, routing |
| **DNS** | Route 53 | Custom domain management |
| **Secrets** | AWS Secrets Manager | API keys, DB credentials |

### Option B: Simpler Alternatives

| Platform | Frontend | Backend | Database | Cost |
|----------|----------|---------|----------|------|
| **Railway** | Static deploy | Docker container | Railway PostgreSQL | ~$5-20/mo |
| **Render** | Static site | Web service | Render PostgreSQL | Free tier available |
| **Vercel + Railway** | Vercel (React) | Railway (FastAPI) | Railway PostgreSQL | ~$0-15/mo |
| **DigitalOcean** | App Platform | App Platform | Managed DB | ~$12/mo |
| **Fly.io** | — | Docker deploy | Fly PostgreSQL | ~$5-10/mo |

### Quick Deploy to Render (Easiest)

```bash
# Backend: Deploy as Web Service
#   Build Command: pip install -r requirements.txt
#   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
#   Add environment variables in Render dashboard

# Frontend: Deploy as Static Site
#   Build Command: npm run build
#   Publish Directory: dist
#   Add VITE_API_BASE_URL env var pointing to backend URL

# Database: Create Render PostgreSQL instance
#   Copy connection string to backend's DATABASE_URL
```

---

## 11. Future Enhancements

### Phase 1 — Core Improvements (Short Term)

| Feature | Description | Impact |
|---------|-------------|--------|
| **Streaming Responses (SSE)** | Real-time token-by-token agent responses instead of waiting for full completion | Better UX, feels like ChatGPT |
| **User Authentication** | JWT-based login (Google OAuth / GitHub OAuth) | Multi-user support, personal history |
| **Spaced Repetition** | Track solved problems, auto-schedule reviews using SM-2 algorithm | Proven learning technique |
| **Problem Bookmarking** | Save/organize problems into custom lists (e.g., "Weak Topics", "Must Review") | Personal study management |
| **Dark/Light Theme Toggle** | Currently dark-only; add light mode | Accessibility |

### Phase 2 — Advanced Features (Medium Term)

| Feature | Description | Impact |
|---------|-------------|--------|
| **Code Execution Sandbox** | Run Python/JS/Java code in-browser with test cases (Judge0 API) | Practice without leaving the app |
| **Mock Interview Mode** | Timed problem solving with AI interviewer asking probing questions | Realistic interview simulation |
| **Progress Dashboard** | Charts: problems solved by category, difficulty distribution, streak calendar | Motivation & tracking |
| **Collaborative Study** | Share sessions, compare solutions, study groups | Social learning |
| **Behavioral Interview Prep** | STAR method coaching, common behavioral Q&A with AI feedback | Complete interview coverage |

### Phase 3 — Scale & Intelligence (Long Term)

| Feature | Description | Impact |
|---------|-------------|--------|
| **Weakness Detection AI** | Analyze solve history → auto-recommend topics/patterns to focus on | Personalized coaching |
| **Company-Specific Prep** | Filter by company (Google, Meta, Amazon, etc.) with tagged problem sets | Targeted preparation |
| **Multi-Language Solutions** | Generate solutions in Python, Java, C++, JavaScript, Go | Language flexibility |
| **Voice Interview Practice** | Speech-to-text problem explanation + AI evaluation of communication | Communication skills |
| **Mobile App (React Native)** | Study on the go, push notification reminders | Accessibility |
| **Admin Dashboard** | Analytics on user engagement, popular problems, LLM costs | Business intelligence |
| **RAG-Enhanced Agents** | Retrieval-Augmented Generation using curated DSA textbook knowledge | Higher quality explanations |
| **WebSocket Real-Time** | Replace polling with WebSocket for live agent status updates | Performance improvement |

### Technical Debt & Improvements

| Item | Description |
|------|-------------|
| **Rate Limiting** | Add request throttling (slowapi) to prevent abuse |
| **Logging** | Structured logging with correlation IDs (structlog) |
| **Testing** | pytest (backend) + Vitest (frontend) test suites |
| **CI/CD Pipeline** | GitHub Actions: lint → test → build → deploy |
| **Monitoring** | Sentry error tracking, Prometheus metrics |
| **Caching Layer** | Redis for LLM response caching, rate limiting |
| **API Versioning** | `/api/v1/` prefix for backward compatibility |
| **OpenTelemetry** | Distributed tracing across services |

---

## License

MIT License — See [LICENSE](LICENSE) for details.

---

*Built with FastAPI, React, LangChain, and PostgreSQL. Powered by multi-agent AI coaching.*
