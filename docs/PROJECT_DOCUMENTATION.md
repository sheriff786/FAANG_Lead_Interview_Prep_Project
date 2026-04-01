# FAANG/MAANG Interview Prep Coach — Project Documentation

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Use Case](#2-use-case)
- [3. Features & Functionality](#3-features--functionality)
- [4. Application Flow](#4-application-flow)
- [5. AI System — Multi-Agent Architecture](#5-ai-system--multi-agent-architecture)
- [6. Backend Components](#6-backend-components)
- [7. Frontend Components](#7-frontend-components)
- [8. Database Layer](#8-database-layer)
- [9. API Endpoints Reference](#9-api-endpoints-reference)
- [10. Tech Stack](#10-tech-stack)

---

## 1. Project Overview

**FAANG/MAANG Interview Prep Coach** is a full-stack, AI-powered coding interview preparation platform. It combines **live LeetCode problem fetching**, a **5-agent AI coaching system**, and **system design prep** into a single application. The platform is built for anyone targeting software engineering interviews at top tech companies (Google, Meta, Amazon, Apple, Netflix, Microsoft, etc.).

The application uses a **multi-agent AI architecture** where 4 specialized AI agents (Problem Analyst, Strategy Coach, Code Mentor, Resource Finder) work together in a pipeline — each agent builds on the previous agent's output to provide comprehensive, progressive coaching on any LeetCode problem. A 5th agent handles system design interview preparation separately.

---

## 2. Use Case

### Who Is This For?

- Software engineers preparing for FAANG/MAANG coding interviews
- Students learning Data Structures & Algorithms
- Developers transitioning to new roles who need structured interview prep
- Anyone who wants AI-guided, step-by-step help understanding LeetCode problems

### What Problems Does It Solve?

| Problem | How This App Solves It |
|---------|----------------------|
| "I don't understand what the problem is really asking" | **Problem Analyst** breaks it down in plain English with key observations and edge cases |
| "I don't know which pattern or approach to use" | **Strategy Coach** identifies the algorithmic pattern (13+ types) and gives a step-by-step mental model |
| "I can't translate the approach into clean code" | **Code Mentor** provides pseudocode, a full Python solution, complexity analysis, and common mistakes |
| "I don't know what to study next" | **Resource Finder** gives a 7-day drill plan, interview scripts, and company targeting advice |
| "I need to practice similar problems" | **Pattern Detection** auto-finds related problems with explanations of why they're similar |
| "I need help with system design interviews" | **System Design Agent** provides full FAANG-level breakdowns (requirements, HLD, deep dive) for 15+ topics |
| "I want to track my LeetCode progress" | **LeetCode Account Integration** shows your solve count, progress bars, and recent submissions |
| "I have a follow-up question" | **Follow-up Chat** lets you ask deeper questions with full problem context preserved |

---

## 3. Features & Functionality

### 3.1 LeetCode Problem Fetching

**What it does:** Fetch any LeetCode problem by its slug (e.g., `two-sum`) or number (e.g., `1`).

**How it works:**
- User types a problem slug or number in the input field and clicks "Fetch ↗" (or presses Enter)
- Backend first tries direct LeetCode GraphQL API (uses connected account cookies if available)
- If GraphQL fails, falls back to a public proxy API
- Fetched problem is cached in PostgreSQL — subsequent fetches for the same problem hit the cache instantly
- Problem details displayed: number, title, difficulty, tags
- Users can also paste a problem statement manually if they prefer

**Manual Input Alternative:** Users can paste any problem description into a textarea instead of fetching from LeetCode, useful for problems from other platforms.

### 3.2 Multi-Agent AI Analysis (4 Agents)

**What it does:** Runs 4 AI agents sequentially on a LeetCode problem, each building on the previous agent's output.

**How it works:**
1. User fetches or pastes a problem, selects difficulty and experience level
2. Clicks "Analyze with All Agents"
3. Backend runs the 4-agent pipeline (see [Section 5](#5-ai-system--multi-agent-architecture) for details)
4. Results appear in the Analysis tab as chat messages, one per agent
5. Each agent's output is also populated into its dedicated tab (Strategy, Solution, Resources)

**User Levels:**
- **Beginner** (< 6 months) — simple explanations, no jargon
- **Intermediate** (6 months – 2 years) — standard CS terminology
- **Advanced** (2+ years) — concise, expert-level, performance-focused

### 3.3 Follow-Up Chat

**What it does:** After analysis, users can ask deeper questions about the problem.

**How it works:**
- Available in the Analysis tab after an analysis is complete
- User types a question or clicks a Quick Chip (pre-written question)
- Backend sends the question + full problem context to the LLM
- Chat history is stored in PostgreSQL for the session

**Quick Chips (pre-built questions):**
- "Explain with a visual walkthrough example"
- "Show brute force approach first then optimize"
- "Give me a hint without giving away the solution"
- "Explain time and space complexity step by step"
- "Show solution in Java"
- "Show solution in C++"
- "What edge cases must I handle?"

### 3.4 Algorithmic Pattern Detection

**What it does:** Automatically identifies which algorithmic pattern a problem belongs to and finds similar practice problems.

**Supported Patterns (13+):**

| Pattern | Example Trigger |
|---------|----------------|
| Two Pointers | sorted array, opposite ends, left/right |
| Sliding Window | substring, subarray, contiguous |
| Hash Map | lookup, frequency, complement |
| Binary Search | sorted, log(n), divide range |
| Dynamic Programming | fibonacci, optimal, subproblem, memoization |
| BFS | shortest path, level order, layer by layer |
| DFS | path finding, explore all, connected components |
| Stack | parentheses, nested, LIFO |
| Heap | top k, kth largest, priority |
| Backtracking | permutation, combination, all possible |
| Tree | binary tree, BST, root, nodes |
| Intervals | overlap, merge, interval, meeting |
| Greedy | maximum, minimum, optimal choice |

**Similar Problems:** Each pattern has 4–5 curated problems with explanations of why they're related (e.g., "Same two-pointer technique on sorted arrays").

### 3.5 System Design Interview Prep

**What it does:** Generates full FAANG-level system design breakdowns for any topic.

**15 Pre-loaded Topics:**
1. URL Shortener (like Bit.ly)
2. Chat System (like WhatsApp)
3. News Feed (like Facebook/Twitter)
4. Video Streaming (like YouTube/Netflix)
5. Ride Sharing (like Uber/Lyft)
6. E-commerce (like Amazon)
7. Search Engine (like Google)
8. Notification System
9. Rate Limiter
10. Distributed Cache (like Redis)
11. Message Queue (like Kafka)
12. Key-Value Store (like DynamoDB)
13. Web Crawler
14. Payment System (like Stripe)
15. File Storage (like Google Drive)

**Custom Topics:** Users can type any system design topic (e.g., "Design Instagram Stories").

**Output Structure:**
- **Requirements** — Functional, non-functional, and capacity estimation
- **High-Level Design** — System components, API design, data model, architecture diagram
- **Deep Dive** — Scaling strategies, database choices, trade-offs, failure handling
- **YouTube Videos** — Auto-searched tutorial videos for the topic

**Caching:** Results are stored in PostgreSQL. Analyzing the same topic again returns the cached result instantly.

### 3.6 LeetCode Account Integration

**What it does:** Connect your real LeetCode account to see your progress and stats.

**Two Connection Methods:**

1. **Browser Login (Primary)** — Opens a real Chromium browser window via Playwright. User logs into LeetCode using Google/GitHub SSO. The app automatically captures the session cookie. No passwords are stored anywhere.

2. **Manual Cookie Entry (Backup)** — User copies the `LEETCODE_SESSION` cookie from browser DevTools and pastes it into the app. Useful if Playwright isn't available.

**What You See After Connecting:**
- Profile card with avatar, username, real name
- Premium badge (if applicable)
- Progress bars for Easy / Medium / Hard problems (solved / total)
- Color-coded: Easy = green, Medium = orange, Hard = red

**Security:** Session cookies are stored only in server memory (`_active_session`). They are never written to the database. They're cleared when the server restarts.

### 3.7 YouTube Video Integration

**What it does:** Automatically finds tutorial videos for each problem and system design topic.

**How it works:**
- After analysis, searches YouTube for "{problem title} solution explanation"
- If a `YOUTUBE_API_KEY` is configured, uses the official YouTube Data API v3
- Otherwise, falls back to the `youtubesearchpython` library (no API key needed)
- Returns up to 5 videos with title, URL, channel name, thumbnail, and duration

### 3.8 Session Progress Tracking

**What it does:** Shows how many problems you've analyzed in the current session.

**Display:** A progress bar showing count of problems analyzed with a percentage indicator (each problem = 10%, max 100%).

---

## 4. Application Flow

### 4.1 Main User Flow — LeetCode Problem Coaching

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER STARTS HERE                             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │  Open http://localhost  │
                │       :5173            │
                └────────────┬───────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  (Optional) Connect LeetCode │
              │  account via Browser Login   │
              │  or manual cookie entry      │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Enter problem slug/number   │
              │  (e.g., "two-sum" or "1")    │
              │  OR paste problem text       │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Click "Fetch ↗" button      │
              │  → Problem loaded from       │
              │    LeetCode (or cache)       │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Select difficulty & level   │
              │  → Easy/Med/Hard             │
              │  → Beginner/Intermediate/    │
              │    Advanced                  │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Click "Analyze with All     │
              │       Agents" button         │
              └──────────────┬───────────────┘
                             │
                    ┌────────┴────────────────────────┐
                    │   BACKEND AI PIPELINE RUNS      │
                    │                                  │
                    │  Agent 1: Problem Analyst ───┐   │
                    │  Agent 2: Strategy Coach  ◄──┘   │
                    │  Agent 3: Code Mentor   ◄────┘   │
                    │  Agent 4: Resource Finder         │
                    │  + Pattern Detection              │
                    │  + Similar Problems Lookup        │
                    │  + YouTube Search                 │
                    └────────┬────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Results appear in tabs:     │
              │  🔍 Analysis tab (chat)     │
              │  🎯 Strategy tab            │
              │  🐍 Solution tab            │
              │  🔗 Similar Problems tab    │
              │  📚 Resources tab           │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Ask follow-up questions     │
              │  (type or use Quick Chips)   │
              │  → Coach responds in chat    │
              └──────────────────────────────┘
```

### 4.2 System Design Flow

```
User opens "System Design" tab
        │
        ▼
Select a pre-loaded topic (15 options)
OR type a custom topic
        │
        ▼
Click "Analyze" button
        │
        ▼
Backend: Check DB cache → If miss, run SystemDesignAgent → Store in DB
        │
        ▼
Results displayed in 3 sections:
  ├── Requirements (functional, non-functional, estimation)
  ├── High-Level Design (components, API, data model)
  └── Deep Dive (scaling, trade-offs, failures)
  + YouTube tutorial videos
```

### 4.3 LeetCode Account Connection Flow

```
User clicks "Sign in with Browser"
        │
        ▼
Backend spawns Playwright → Opens Chromium window
        │
        ▼
User logs into LeetCode (Google/GitHub SSO)
        │
        ▼
Playwright captures LEETCODE_SESSION cookie
        │
        ▼
Backend verifies cookie via LeetCode GraphQL API
        │
        ▼
Profile card + progress bars displayed in sidebar
```

---

## 5. AI System — Multi-Agent Architecture

### 5.1 Overview

The AI system uses a **sequential multi-agent pipeline** — each agent is a specialist that produces a different type of coaching output. Agents run in order, and each subsequent agent receives the output of previous agents as context. This allows later agents to build on earlier insights rather than starting from scratch.

### 5.2 LLM Provider Support

The system supports **3 LLM providers** via LangChain. You can switch providers with a single config change in `.env`:

| Provider | Model | Config Key |
|----------|-------|------------|
| **OpenAI** | gpt-4o | `OPENAI_API_KEY` |
| **Anthropic** | claude-sonnet-4-20250514 | `ANTHROPIC_API_KEY` |
| **Google** | gemini-1.5-pro | `GOOGLE_API_KEY` |

**LLM Parameters:** temperature = 0.4 (moderate creativity), max_tokens = 2048

**LLM Service (`llm_service.py`):**
- Singleton pattern — LLM instance is created once and reused
- `invoke_llm(system_prompt, user_prompt, history)` — single entry point for all AI calls
- Builds message chain: `[SystemMessage, ...ChatHistory, HumanMessage]`
- Supports conversation history for follow-up questions

### 5.3 Agent Details

#### Agent 1: Problem Analyst 🔍

| Property | Value |
|----------|-------|
| Abbreviation | PA |
| Color | #6c63ff (purple) |
| Input | Problem text + difficulty |
| Output | Problem analysis |

**What it produces:**
1. **What the problem really asks** — Plain English explanation
2. **Key observations** — 3–4 bullets identifying the core insight
3. **Why it's tricky** — Common pitfalls and misconceptions
4. **Data structures involved** — Which structures map to this problem

**Context passed to next agent:** `analysis_text`

---

#### Agent 2: Strategy Coach 🎯

| Property | Value |
|----------|-------|
| Abbreviation | SC |
| Color | #00d4aa (teal) |
| Input | Problem text + Agent 1's analysis |
| Output | Solving strategy |

**What it produces:**
1. **Pattern name** — Which of the 13+ patterns applies (sliding window, two pointers, DP, etc.)
2. **Step-by-step approach** — 5–7 concrete steps to solve it
3. **Mental model** — A memorable analogy to internalize the approach
4. **Pattern trigger signals** — How to recognize this pattern in future problems

**Context passed to next agent:** `strategy_text`

---

#### Agent 3: Code Mentor 🐍

| Property | Value |
|----------|-------|
| Abbreviation | CM |
| Color | #ffa94d (orange) |
| Input | Problem text + Agent 2's strategy |
| Output | Code solution |

**What it produces:**
1. **Pseudocode** — 6–9 lines of language-agnostic steps
2. **Python solution** — Clean, commented, interview-ready code
3. **Complexity analysis** — Time O(?) and Space O(?)
4. **Common mistakes** — 2–3 pitfalls to avoid

---

#### Agent 4: Resource Finder 📚

| Property | Value |
|----------|-------|
| Abbreviation | RF |
| Color | #ff6b6b (red) |
| Input | Problem text + Agent 2's strategy |
| Output | Learning resources and plan |

**What it produces:**
1. **Core concept to master** — The foundational topic behind the problem
2. **7-day drill plan** — 3 specific practice steps
3. **Interview script** — 3–4 sentences to say in an interview setting
4. **Company appearances** — Which companies commonly ask this type of problem

---

#### Agent 5: System Design Coach 🏗️

| Property | Value |
|----------|-------|
| Abbreviation | SD |
| Color | N/A (separate tab) |
| Input | Topic name |
| Output | Full system design breakdown |

**What it produces:**
1. **Requirements Gathering** — Functional requirements, non-functional requirements, capacity estimation
2. **High-Level Design** — System components, API design, data model, architecture diagram
3. **Deep Dive** — Scaling strategies, database choices, trade-offs, failure handling
4. **Interview Tips** — Follow-up questions, red flags, structure advice

---

### 5.4 Agent Pipeline Diagram

```
                     Problem Text + Difficulty + Level
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Agent 1: Problem      │
                    │   Analyst               │
                    │   "What does it ask?"   │
                    └────────────┬────────────┘
                                 │ analysis_text
                                 ▼
                    ┌─────────────────────────┐
                    │   Agent 2: Strategy     │
                    │   Coach                 │
                    │   "How to approach it?" │
                    └────────────┬────────────┘
                                 │ strategy_text
                        ┌────────┴────────┐
                        ▼                 ▼
          ┌─────────────────────┐ ┌──────────────────────┐
          │  Agent 3: Code      │ │  Agent 4: Resource   │
          │  Mentor             │ │  Finder              │
          │  "Show me the code" │ │  "What to study next"│
          └─────────────────────┘ └──────────────────────┘
```

### 5.5 Prompt Engineering

Each agent has a structured prompt template in `prompt_pkg/prompts.py`. The prompts are **level-aware** — they adapt based on the user's experience level:

| Level | Prompt Behavior |
|-------|----------------|
| **Beginner** | "Explain everything simply, avoid jargon, use analogies" |
| **Intermediate** | "Use standard CS terminology, assume basic knowledge" |
| **Advanced** | "Be concise and expert-level, focus on edge cases and optimization" |

### 5.6 Follow-Up Chat

After the initial 4-agent analysis, users can ask follow-up questions:
- The LLM receives the original problem context (first 500 chars) + the new question
- Chat history (user messages + AI replies) is stored in the `chat_messages` database table
- Each session has a unique `session_id` (UUID) to group messages together

---

## 6. Backend Components

### 6.1 Project Structure

```
backend/
├── app/
│   ├── main.py              ← FastAPI app entry point
│   ├── config.py            ← Settings from .env
│   ├── database.py          ← SQLAlchemy async engine + session
│   │
│   ├── agents/              ← AI Agent implementations
│   │   ├── base_agent.py    ← Abstract base class
│   │   ├── problem_analyst.py
│   │   ├── strategy_coach.py
│   │   ├── code_mentor.py
│   │   ├── resource_finder.py
│   │   └── system_design_agent.py
│   │
│   ├── routers/             ← API endpoint definitions
│   │   ├── leetcode.py      ← Problem fetching
│   │   ├── leetcode_auth.py ← Account connection (8 endpoints)
│   │   ├── agents.py        ← Analysis + follow-up
│   │   ├── system_design.py ← System design topics
│   │   └── youtube.py       ← Video search
│   │
│   ├── services/            ← Business logic
│   │   ├── llm_service.py   ← LangChain LLM abstraction
│   │   ├── leetcode_service.py       ← Fetch + cache problems
│   │   ├── leetcode_graphql.py       ← Direct LeetCode API
│   │   ├── leetcode_browser_login.py ← Playwright login
│   │   └── youtube_service.py        ← YouTube search
│   │
│   ├── models/              ← Database ORM models
│   │   ├── problem.py       ← problems table
│   │   ├── analysis.py      ← analyses table
│   │   ├── session.py       ← chat_messages table
│   │   └── system_design.py ← system_design_topics table
│   │
│   ├── schemas/             ← Pydantic request/response models
│   │   ├── problem.py       ← AnalysisRequest, FullAnalysisOut, etc.
│   │   └── system_design.py ← SystemDesignRequest, SystemDesignOut
│   │
│   ├── prompt_pkg/          ← AI prompt templates
│   │   └── prompts.py       ← All agent prompts (level-aware)
│   │
│   └── utils/               ← Utilities
│       └── pattern_detection.py ← 13 pattern rules + 65+ similar problems
│
├── alembic/                 ← Database migrations
│   └── env.py
├── alembic.ini
├── requirements.txt
├── Dockerfile
└── .env                     ← API keys and config
```

### 6.2 Main Application (`main.py`)

- **Framework:** FastAPI with async support
- **Lifespan:** On startup, calls `init_db()` to create all database tables
- **CORS:** Allows requests from `http://localhost:5173`, `http://localhost:3000`, and the configured `FRONTEND_URL`
- **Routers:** Registers 5 router modules (leetcode, leetcode_auth, agents, system_design, youtube)
- **Health Check:** `GET /api/health` returns `{"status": "ok", "provider": "openai"}`

### 6.3 Configuration (`config.py`)

- Uses **pydantic-settings** to load environment variables from `backend/.env`
- Resolves `.env` path relative to the config file itself (`Path(__file__).parent.parent / ".env"`) — works from any working directory
- Settings are cached with `@lru_cache` so the file is read only once

### 6.4 Services Layer

| Service | File | Purpose |
|---------|------|---------|
| **LLM Service** | `llm_service.py` | Abstracts OpenAI/Anthropic/Google behind a single `invoke_llm()` function using LangChain |
| **LeetCode Service** | `leetcode_service.py` | Fetches problems with GraphQL → proxy API fallback, caches in PostgreSQL |
| **LeetCode GraphQL** | `leetcode_graphql.py` | Direct LeetCode GraphQL API client — 7 query types for problems, profiles, progress, submissions |
| **Browser Login** | `leetcode_browser_login.py` | Opens Chromium via Playwright subprocess for SSO login, captures session cookies |
| **YouTube Service** | `youtube_service.py` | Searches YouTube via API key (if available) or youtubesearchpython library (no key needed) |

### 6.5 Pattern Detection (`pattern_detection.py`)

- **12 regex-based rules** that scan the Strategy Coach's output for pattern keywords
- **65+ curated similar problems** organized by pattern, each with:
  - LeetCode ID and title
  - Difficulty level
  - Slug (for direct linking)
  - Reason why it's similar (e.g., "Same sliding window technique with variable window size")

---

## 7. Frontend Components

### 7.1 Project Structure

```
frontend/src/
├── App.tsx                  ← Root layout (Header + LeftPanel + ChatArea)
├── main.tsx                 ← React entry point
├── index.css                ← Global styles, CSS variables, animations
│
├── api/                     ← Axios HTTP client layer
│   ├── index.ts             ← Base axios instance (baseURL, 2min timeout)
│   ├── agents.ts            ← runAnalysis(), sendFollowUp()
│   ├── leetcode.ts          ← fetchProblem(), auth endpoints
│   └── systemDesign.ts      ← getTopics(), analyzeSystemDesign()
│
├── store/                   ← Zustand state management
│   ├── types.ts             ← TypeScript interfaces
│   └── useAppStore.ts       ← Global store (30+ state fields, 20+ actions)
│
├── hooks/                   ← Custom React hooks
│   ├── useAgents.ts         ← Analysis orchestration (startAnalysis)
│   └── useFollowUp.ts       ← Follow-up chat (handleFollowUp)
│
├── utils/
│   └── formatMessage.ts     ← Markdown → HTML converter
│
└── components/
    ├── Header.tsx            ← Top bar with logo and title
    ├── common/
    │   └── Loader.tsx        ← Bouncing dots animation
    ├── LeftPanel/            ← Sidebar (265px fixed width)
    │   ├── LeftPanel.tsx     ← Container with Analyze button
    │   ├── LeetCodeConnect.tsx ← Account connection UI
    │   ├── FetchSection.tsx  ← Problem input + fetch
    │   ├── ConfigSection.tsx ← Level selector dropdown
    │   ├── AgentStatusPanel.tsx ← 4 agent status indicators
    │   └── SessionProgress.tsx  ← Problems analyzed counter
    └── ChatArea/             ← Main content area (6 tabs)
        ├── ChatArea.tsx      ← Tab content switcher
        ├── TabBar.tsx        ← 6 tab buttons
        ├── AnalysisTab.tsx   ← Chat messages list
        ├── StrategyTab.tsx   ← Strategy Coach output
        ├── CodeTab.tsx       ← Python solution with copy buttons
        ├── SimilarProblemsTab.tsx ← Pattern + related problems
        ├── ResourcesTab.tsx  ← YouTube + agent recs + static resources
        ├── SystemDesignTab.tsx ← 15 topics + custom input + results
        ├── ChatInput.tsx     ← Follow-up text input
        ├── MessageBubble.tsx ← Individual chat message component
        └── QuickChips.tsx    ← Pre-built follow-up question buttons
```

### 7.2 Layout

```
┌──────────────────────────────────────────────────────────────┐
│  ⚡ LeetCode Multi-Agent Coach          MULTI-AGENT · LIVE  │  ← Header (57px)
├──────────────┬───────────────────────────────────────────────┤
│              │  🔍 Analysis  🎯 Strategy  🐍 Solution  ...  │  ← TabBar
│  LeetCode    │───────────────────────────────────────────────│
│  Connect     │                                               │
│              │  Chat messages / Tab content                   │
│  Fetch       │  (scrollable area)                            │
│  Section     │                                               │
│              │                                               │
│  Config      │                                               │
│  (Level)     │                                               │
│              │                                               │
│  [Analyze]   │                                               │
│              │───────────────────────────────────────────────│
│  Agent       │  Quick Chips (follow-up suggestions)          │
│  Status      │───────────────────────────────────────────────│
│              │  [Ask a follow-up...              ] [Send]     │  ← ChatInput
│  Progress    │                                               │
├──────────────┴───────────────────────────────────────────────┤
│  265px fixed                    flex: 1                      │
└──────────────────────────────────────────────────────────────┘
```

### 7.3 State Management (Zustand)

The app uses a single Zustand store (`useAppStore`) with the following state groups:

| Group | State Fields | Purpose |
|-------|-------------|---------|
| **Config** | `difficulty`, `level`, `activeTab`, `sessionId` | User preferences and UI state |
| **Problem** | `slugInput`, `manualDescription`, `fetchedProblem`, `fetchStatus`, `fetchError` | Problem fetching state |
| **Agents** | `agentStates` (analyst/strategy/code/resource), `busy` | Agent execution tracking |
| **Messages** | `messages[]`, `strategyContent`, `codeContent`, `resourceContent` | Chat and tab content |
| **Analysis** | `detectedPattern`, `similarProblems[]`, `youtubeLinks[]` | Analysis results |
| **Session** | `analyzedCount` | Progress tracking |
| **System Design** | `systemDesignResult`, `systemDesignLoading` | System design state |
| **LeetCode Account** | `lcConnected`, `lcUser`, `lcProgress`, `lcConnecting` | Account integration |

### 7.4 Key Components Detail

#### LeetCodeConnect

The most complex sidebar component. Handles two connection methods:
- **Browser Login:** Calls `browserLoginLeetCode()`, which triggers Playwright on the backend. Shows a loading state during the 120s login window.
- **Manual Cookie Entry:** Toggle panel with instructions for copying cookies from DevTools.
- **Connected State:** Shows profile card with avatar, username, and Easy/Medium/Hard progress bars with smooth width animations.

#### AgentStatusPanel

Displays 4 agent cards, each with:
- A colored dot indicator (animated pulse when running)
- Agent name and abbreviation badge
- Status label: idle → analyzing... → done ✓ (or error)
- Border color changes to the agent's color when active/done

#### CodeTab

The code solution tab with special features:
- **Code Block Extraction:** Regex parses markdown code fences (` ```python ... ``` `)
- **Copy Buttons:** Individual copy button per code block + "Copy All Code" button
- **Syntax Display:** Dark background (#0d1117), monospace font, language tag in header
- **Remaining Sections:** Non-code parts (complexity analysis, common mistakes) rendered as formatted markdown

#### SimilarProblemsTab

Shows the detected pattern name and a list of related problems:
- Each problem is a clickable card linking to `leetcode.com/problems/{slug}`
- Shows LeetCode ID, title, difficulty badge (color-coded), and reason why it's similar
- Current problem highlighted with 📌 pin icon

#### SystemDesignTab

A self-contained section with its own input, topic selection, and analysis display:
- **Topic Grid:** 15 pre-loaded buttons, each triggers analysis
- **Custom Input:** Text field for any custom system design topic
- **Result Tabs:** Requirements / High-Level Design / Deep Dive (sub-tabs within the tab)
- **YouTube Integration:** Tutorial videos for the analyzed topic

### 7.5 Design System

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | #090910 | Main background |
| `--surface` | #111119 | Primary surface (cards, panels) |
| `--surface2` | #18181f | Secondary surface (inputs, code blocks) |
| `--accent` | #6c63ff | Primary accent (purple — Problem Analyst) |
| `--accent2` | #00d4aa | Secondary accent (teal — Strategy Coach) |
| `--accent3` | #ff6b6b | Tertiary accent (red — Resource Finder) |
| `--accent4` | #ffa94d | Quaternary accent (orange — Code Mentor) |
| `--text` | #e8e8f2 | Primary text |
| `--muted` | #7a7a8c | Secondary/disabled text |
| `--mono` | JetBrains Mono | Code, timestamps, badges |
| `--sans` | Sora | UI text |

**Animations:** `fadeUp` (message entry), `pulse` (agent running indicator), `dotBounce` (loading dots)

---

## 8. Database Layer

### 8.1 Technology

- **Engine:** PostgreSQL 16 (Alpine, via Docker)
- **ORM:** SQLAlchemy 2.0 (async mode with asyncpg driver)
- **Migrations:** Alembic

### 8.2 Tables

#### `problems` — Cached LeetCode problems

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| leetcode_id | Integer | Unique, nullable |
| title | String(300) | Problem title |
| slug | String(300) | Unique, indexed (e.g., "two-sum") |
| difficulty | String(20) | easy / medium / hard |
| content | Text | Cleaned problem statement (HTML stripped) |
| tags | Array[String] | PostgreSQL native array (e.g., ["Array", "Hash Table"]) |
| fetched_at | DateTime(TZ) | Auto-set to UTC now |

#### `analyses` — AI analysis results

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| problem_id | UUID | FK → problems.id |
| difficulty | String(20) | easy / medium / hard |
| level | String(30) | beginner / intermediate / advanced |
| llm_provider | String(30) | Which provider generated this |
| analysis_text | Text | Problem Analyst output |
| strategy_text | Text | Strategy Coach output |
| code_text | Text | Code Mentor output |
| resource_text | Text | Resource Finder output |
| detected_pattern | String(100) | e.g., "two pointers" |
| created_at | DateTime(TZ) | Auto-set |

#### `chat_messages` — Follow-up conversation history

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| session_id | String(100) | Indexed, groups messages per session |
| role | String(20) | "user" or "assistant" |
| agent | String(50) | Agent name (e.g., "follow-up") |
| content | Text | Message content |
| order | Integer | Message sequence in session |
| created_at | DateTime(TZ) | Auto-set |

#### `system_design_topics` — Cached system design analyses

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| title | String(300) | Indexed (e.g., "URL Shortener") |
| category | String(100) | e.g., "Web Service", "Real-time" |
| description | Text | Brief description |
| requirements_text | Text | Requirements section output |
| high_level_design | Text | HLD section output |
| deep_dive | Text | Deep dive section output |
| llm_provider | String(30) | Which provider generated this |
| created_at | DateTime(TZ) | Auto-set |

---

## 9. API Endpoints Reference

### LeetCode Problem Fetching

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leetcode/fetch` | Fetch problem by slug or number |

### LeetCode Account

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leetcode-account/connect` | Verify session cookie and connect |
| POST | `/api/leetcode-account/browser-login` | Open browser for SSO login |
| GET | `/api/leetcode-account/status` | Check if account is connected |
| POST | `/api/leetcode-account/disconnect` | Clear session |
| GET | `/api/leetcode-account/profile` | Get user profile details |
| GET | `/api/leetcode-account/progress` | Get solve progress (Easy/Med/Hard) |
| GET | `/api/leetcode-account/submissions` | Get recent submissions |
| POST | `/api/leetcode-account/problems` | List problems with filters |

### AI Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agents/analyze` | Run 4-agent analysis pipeline |
| POST | `/api/agents/followup` | Send follow-up question |

### System Design

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system-design/topics` | Get 15 predefined topics |
| POST | `/api/system-design/analyze` | Analyze a system design topic |

### YouTube

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/youtube/search` | Search YouTube for videos |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health + active LLM provider |

---

## 10. Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.12+ | Runtime |
| FastAPI | 0.115.0 | Web framework |
| Uvicorn | 0.30.0 | ASGI server |
| SQLAlchemy | 2.0.35 | ORM (async) |
| Alembic | 1.13.2 | Database migrations |
| asyncpg | 0.29.0 | PostgreSQL async driver |
| Pydantic | 2.9.0 | Data validation |
| LangChain | 0.3.0 | LLM abstraction |
| langchain-openai | 0.2.0 | OpenAI integration |
| langchain-anthropic | 0.2.0 | Anthropic integration |
| langchain-google-genai | 2.0.0 | Google Gemini integration |
| httpx | 0.27.0 | Async HTTP client |
| Playwright | Latest | Browser automation for LeetCode login |
| youtube-search-python | 1.6.6 | YouTube search (no API key) |
| BeautifulSoup4 | 4.12.3 | HTML parsing |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.5.4 | Type safety |
| Vite | 5.4.3 | Build tool / dev server |
| Zustand | 4.5.5 | State management |
| Axios | 1.7.7 | HTTP client |
| react-markdown | 9.0.1 | Markdown rendering |
| react-syntax-highlighter | 15.5.0 | Code syntax highlighting |
| uuid | 10.0.0 | Session ID generation |

### Infrastructure

| Technology | Purpose |
|-----------|---------|
| PostgreSQL 16 (Alpine) | Primary database |
| Docker / Docker Compose | Container orchestration |
