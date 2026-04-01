# FAANG/MAANG Interview Prep — Visual Architecture (Mermaid Diagrams)

> Open this file in VS Code with a Mermaid preview extension or draw.io to see all diagrams rendered visually.

---

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ CLIENT (Browser)"]
        direction TB
        REACT["React 18 + TypeScript + Vite"]
        ZUSTAND["Zustand State Store"]
        AXIOS["Axios HTTP Client"]
        REACT --> ZUSTAND
        REACT --> AXIOS
    end

    subgraph BACKEND["⚙️ BACKEND (FastAPI + Python 3.12)"]
        direction TB
        FASTAPI["FastAPI App\n(main.py)"]
        
        subgraph ROUTERS["API Routers"]
            R1["🔗 /api/leetcode"]
            R2["🤖 /api/agents"]
            R3["🏗️ /api/system-design"]
            R4["📺 /api/youtube"]
        end

        subgraph SERVICES["Services Layer"]
            S1["LLM Service\n(LangChain)"]
            S2["LeetCode Service\n(httpx)"]
            S3["YouTube Service\n(search lib)"]
        end

        subgraph AGENTS["🧠 AI Agents"]
            A1["Problem Analyst"]
            A2["Strategy Coach"]
            A3["Code Mentor"]
            A4["Resource Finder"]
            A5["System Design Agent"]
        end

        subgraph UTILS["Utilities"]
            U1["Pattern Detection\n(13 regex rules)"]
            U2["Similar Problems DB\n(60+ curated)"]
        end

        FASTAPI --> ROUTERS
        ROUTERS --> SERVICES
        ROUTERS --> AGENTS
        AGENTS --> S1
        ROUTERS --> UTILS
    end

    subgraph DB["🗄️ PostgreSQL 16"]
        T1[("problems")]
        T2[("analyses")]
        T3[("system_design_topics")]
        T4[("chat_messages")]
    end

    subgraph EXTERNAL["🌐 External APIs"]
        E1["LeetCode Proxy API\n(Vercel)"]
        E2["YouTube Search\n(Library)"]
        E3["YouTube Data API v3\n(Optional Fallback)"]
    end

    subgraph LLM_PROVIDERS["🧠 LLM Providers"]
        L1["OpenAI\nGPT-4o"]
        L2["Anthropic\nClaude Sonnet 4"]
        L3["Google\nGemini 1.5 Pro"]
    end

    CLIENT -->|"REST API (JSON)"| BACKEND
    BACKEND -->|"SQLAlchemy Async"| DB
    S2 -->|"httpx"| E1
    S3 --> E2
    S3 -.->|"fallback"| E3
    S1 --> L1
    S1 --> L2
    S1 --> L3

    style CLIENT fill:#1a1a2e,stroke:#00d4ff,color:#fff
    style BACKEND fill:#16213e,stroke:#0f3460,color:#fff
    style DB fill:#0f3460,stroke:#e94560,color:#fff
    style EXTERNAL fill:#1a1a2e,stroke:#ffd700,color:#fff
    style LLM_PROVIDERS fill:#1a1a2e,stroke:#00ff88,color:#fff
```

---

## 2. Multi-Agent Pipeline (Sequential Flow)

```mermaid
flowchart LR
    INPUT["📝 Problem Text\n+ Difficulty\n+ Level"] --> A1

    subgraph PIPELINE["🤖 Agent Pipeline (Sequential)"]
        direction LR
        A1["🔍 Agent 1\nProblem Analyst\n\nWhat it really asks\nEdge cases\nData structures"] --> A2["🎯 Agent 2\nStrategy Coach\n\nPattern identification\nStep-by-step approach\nTrigger signals"]
        A2 --> A3["💻 Agent 3\nCode Mentor\n\nPseudocode\nPython solution\nComplexity analysis"]
        A3 --> A4["📚 Agent 4\nResource Finder\n\n7-day drill plan\nInterview script\nCompany appearances"]
    end

    A4 --> PATTERN["🔎 Pattern Detection\n(13 regex rules)"]
    PATTERN --> SIMILAR["📋 Similar Problems\n(60+ curated)"]
    PATTERN --> YOUTUBE["📺 YouTube Search\n(Tutorial videos)"]

    SIMILAR --> OUTPUT["✅ Full Analysis\nResult"]
    YOUTUBE --> OUTPUT

    OUTPUT --> CACHE[("💾 Cache in\nPostgreSQL")]

    style INPUT fill:#2d3436,stroke:#00cec9,color:#fff
    style PIPELINE fill:#0a0a23,stroke:#6c5ce7,color:#fff
    style OUTPUT fill:#2d3436,stroke:#00b894,color:#fff
    style CACHE fill:#2d3436,stroke:#e17055,color:#fff
```

---

## 3. System Design Analysis Flow

```mermaid
flowchart TD
    USER["👤 User selects topic\ne.g. Design URL Shortener"] --> CHECK{"Cached in DB?"}

    CHECK -->|"Yes"| RETURN["Return cached result"]
    CHECK -->|"No"| AGENT["🏗️ System Design Agent"]

    subgraph AGENT_WORK["System Design Agent Pipeline"]
        direction TB
        REQ["① Requirements Gathering\nFunctional + Non-functional"] --> HLD["② High-Level Design\nComponents, Data Flow, APIs"]
        HLD --> DEEP["③ Deep Dive\nScaling, DB Choice, Caching, Trade-offs"]
        DEEP --> TIPS["④ Interview Tips\nWhat to say, Time management"]
    end

    AGENT --> AGENT_WORK
    AGENT_WORK --> YT["📺 YouTube Tutorials\nfor the topic"]
    AGENT_WORK --> SAVE[("💾 Save to DB")]
    YT --> RESULT["✅ Complete\nSystem Design Analysis"]
    SAVE --> RESULT

    style USER fill:#2d3436,stroke:#74b9ff,color:#fff
    style CHECK fill:#2d3436,stroke:#ffeaa7,color:#000
    style AGENT_WORK fill:#0a0a23,stroke:#a29bfe,color:#fff
    style RESULT fill:#2d3436,stroke:#55efc4,color:#fff
```

---

## 4. Database Entity Relationship Diagram

```mermaid
erDiagram
    PROBLEMS ||--o{ ANALYSES : "has many"
    PROBLEMS {
        int id PK
        int leetcode_id
        string title
        string slug UK
        string difficulty
        text content
        json tags
        datetime fetched_at
    }

    ANALYSES {
        int id PK
        int problem_id FK
        string difficulty
        string level
        text analysis_text
        text strategy_text
        text code_text
        text resource_text
        string detected_pattern
        datetime created_at
    }

    SYSTEM_DESIGN_TOPICS {
        int id PK
        string title UK
        string category
        text description
        text requirements_text
        text high_level_design
        text deep_dive
        string llm_provider
        datetime created_at
    }

    CHAT_MESSAGES {
        int id PK
        uuid session_id
        string role
        string agent
        text content
        int message_order
        datetime created_at
    }
```

---

## 5. Frontend Component Tree

```mermaid
flowchart TD
    APP["🏠 App.tsx\n(Root Layout)"]
    
    APP --> HEADER["📌 Header.tsx\nLogo + Title + Badge"]
    APP --> LEFT
    APP --> CHAT

    subgraph LEFT["📋 LeftPanel"]
        direction TB
        LP["LeftPanel.tsx\n(Container + Analyze Button)"]
        LP --> FETCH["FetchSection.tsx\nLeetCode slug/ID input\n+ Manual paste option"]
        LP --> CONFIG["ConfigSection.tsx\nDifficulty selector\nLevel selector"]
        LP --> STATUS["AgentStatusPanel.tsx\n⏳ Waiting → 🔄 Running\n→ ✅ Done / ❌ Error"]
        LP --> PROGRESS["SessionProgress.tsx\nProblems analyzed counter"]
    end

    subgraph CHAT["💬 ChatArea"]
        direction TB
        CA["ChatArea.tsx\n(Tab Layout Container)"]
        CA --> TABS["TabBar.tsx\n5 tabs selector"]
        
        TABS --> TAB1["AnalysisTab.tsx\nProblem Analyst output"]
        TABS --> TAB2["StrategyTab.tsx\nStrategy Coach output"]
        TABS --> TAB3["SimilarProblemsTab.tsx\nPattern-matched problems"]
        TABS --> TAB4["ResourcesTab.tsx\nDrill plans + YouTube cards"]
        TABS --> TAB5["SystemDesignTab.tsx\nTopic selector + analysis"]

        CA --> BUBBLE["MessageBubble.tsx\nMarkdown + Syntax Highlight"]
        CA --> CHIPS["QuickChips.tsx\n7 follow-up suggestions"]
        CA --> INPUT["ChatInput.tsx\nFollow-up text input"]
    end

    style APP fill:#1a1a2e,stroke:#00d4ff,color:#fff
    style LEFT fill:#16213e,stroke:#e94560,color:#fff
    style CHAT fill:#16213e,stroke:#00ff88,color:#fff
```

---

## 6. Technology Stack Overview

```mermaid
flowchart LR
    subgraph FRONT["🖥️ Frontend"]
        direction TB
        F1["React 18"] --> F2["TypeScript 5.5"]
        F2 --> F3["Vite 5.4"]
        F3 --> F4["Zustand 4.5"]
        F4 --> F5["Axios 1.7"]
        F5 --> F6["react-markdown 9.0"]
        F6 --> F7["react-syntax-highlighter"]
    end

    subgraph BACK["⚙️ Backend"]
        direction TB
        B1["Python 3.12"] --> B2["FastAPI 0.115"]
        B2 --> B3["SQLAlchemy 2.0"]
        B3 --> B4["LangChain 0.3"]
        B4 --> B5["Pydantic 2.9"]
        B5 --> B6["httpx 0.27"]
        B6 --> B7["Alembic 1.13"]
    end

    subgraph INFRA["🏗️ Infrastructure"]
        direction TB
        I1["PostgreSQL 16"] --> I2["Docker"]
        I2 --> I3["Docker Compose"]
    end

    subgraph LLM["🧠 LLM Providers"]
        direction TB
        L1["OpenAI GPT-4o"]
        L2["Anthropic Claude 4"]
        L3["Google Gemini 1.5"]
    end

    FRONT -->|"HTTP/JSON"| BACK
    BACK -->|"asyncpg"| INFRA
    BACK -->|"LangChain"| LLM

    style FRONT fill:#1e3a5f,stroke:#00d4ff,color:#fff
    style BACK fill:#1e3a5f,stroke:#ffd700,color:#fff
    style INFRA fill:#1e3a5f,stroke:#e94560,color:#fff
    style LLM fill:#1e3a5f,stroke:#00ff88,color:#fff
```

---

## 7. API Request Flow (Sequence Diagram)

```mermaid
sequenceDiagram
    actor User
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant LC as LeetCode API
    participant LLM as LLM Provider
    participant DB as PostgreSQL
    participant YT as YouTube Search

    User->>FE: Enter problem slug "two-sum"
    FE->>API: POST /api/leetcode/fetch {slug: "two-sum"}
    API->>DB: Check cache for slug
    alt Not cached
        API->>LC: GET /select?titleSlug=two-sum
        LC-->>API: Problem data (title, content, difficulty, tags)
        API->>DB: Save problem
    end
    API-->>FE: ProblemOut {title, content, difficulty, tags}

    User->>FE: Click "Analyze Problem"
    FE->>API: POST /api/agents/analyze {problem_id, difficulty, level}

    Note over API: Agent 1: Problem Analyst
    API->>LLM: System + User prompt
    LLM-->>API: Analysis text

    Note over API: Agent 2: Strategy Coach
    API->>LLM: System + User prompt
    LLM-->>API: Strategy text

    Note over API: Agent 3: Code Mentor
    API->>LLM: System + User prompt
    LLM-->>API: Code + complexity text

    Note over API: Agent 4: Resource Finder
    API->>LLM: System + User prompt
    LLM-->>API: Drill plan + resources text

    Note over API: Pattern Detection (regex)
    Note over API: Similar Problems Lookup

    API->>YT: Search "two-sum leetcode solution"
    YT-->>API: Video results

    API->>DB: Cache full analysis
    API-->>FE: FullAnalysisOut {analysis, strategy, code, resources, pattern, similar, youtube}

    FE->>User: Display across 5 tabs

    User->>FE: Ask follow-up "Explain time complexity"
    FE->>API: POST /api/agents/followup {session_id, message}
    API->>LLM: Context + follow-up prompt
    LLM-->>API: Response
    API-->>FE: Follow-up response
    FE->>User: Display in chat
```

---

## 8. LLM Provider Abstraction

```mermaid
flowchart TD
    AGENTS["All 5 Agents\n(BaseAgent.run)"] --> INVOKE["invoke_llm()\n(llm_service.py)"]
    
    INVOKE --> BUILD["_build_llm()\nFactory Function"]
    
    BUILD --> CHECK{"LLM_PROVIDER\nin .env"}
    
    CHECK -->|"openai"| OPENAI["ChatOpenAI\nmodel: gpt-4o\ntemp: 0.4\nmax_tokens: 2048"]
    CHECK -->|"anthropic"| ANTHROPIC["ChatAnthropic\nmodel: claude-sonnet-4-20250514\ntemp: 0.4\nmax_tokens: 2048"]
    CHECK -->|"google"| GOOGLE["ChatGoogleGenerativeAI\nmodel: gemini-1.5-pro\ntemp: 0.4\nmax_tokens: 2048"]

    OPENAI --> RESPONSE["LLM Response\n(text)"]
    ANTHROPIC --> RESPONSE
    GOOGLE --> RESPONSE

    RESPONSE --> AGENT_OUT["Return to Agent\n→ Router → Frontend"]

    style AGENTS fill:#2d3436,stroke:#6c5ce7,color:#fff
    style INVOKE fill:#2d3436,stroke:#00cec9,color:#fff
    style CHECK fill:#2d3436,stroke:#ffeaa7,color:#000
    style OPENAI fill:#1e3a5f,stroke:#00ff88,color:#fff
    style ANTHROPIC fill:#1e3a5f,stroke:#ff7675,color:#fff
    style GOOGLE fill:#1e3a5f,stroke:#fdcb6e,color:#fff
```

---

## 9. Docker Compose Architecture

```mermaid
flowchart LR
    subgraph DOCKER["🐳 Docker Compose"]
        direction TB
        
        subgraph PG["PostgreSQL Container"]
            PG_IMG["postgres:16-alpine"]
            PG_PORT["Port: 5432"]
            PG_VOL[("pgdata volume")]
            PG_IMG --- PG_PORT
            PG_IMG --- PG_VOL
        end

        subgraph BE["Backend Container"]
            BE_IMG["python:3.12-slim"]
            BE_PORT["Port: 8000"]
            BE_CMD["uvicorn app.main:app"]
            BE_IMG --- BE_PORT
            BE_IMG --- BE_CMD
        end

        subgraph FEE["Frontend Container"]
            FE_IMG["node:20-alpine"]
            FE_PORT["Port: 5173"]
            FE_CMD["npm run dev (vite)"]
            FE_IMG --- FE_PORT
            FE_IMG --- FE_CMD
        end

        FEE -->|"depends_on"| BE
        BE -->|"depends_on\n(healthy)"| PG
    end

    BROWSER["🌐 Browser"] -->|"http://localhost:5173"| FEE
    BROWSER -->|"http://localhost:8000/docs"| BE

    style DOCKER fill:#0a0a23,stroke:#00d4ff,color:#fff
    style PG fill:#1e3a5f,stroke:#e94560,color:#fff
    style BE fill:#1e3a5f,stroke:#ffd700,color:#fff
    style FEE fill:#1e3a5f,stroke:#00ff88,color:#fff
```

---

## 10. Cloud Deployment Architecture (AWS)

```mermaid
flowchart TD
    USER["👤 Users"] --> R53["Route 53\n(DNS)"]
    R53 --> CF["CloudFront\n(CDN)"]
    R53 --> ALB["Application\nLoad Balancer"]

    CF --> S3["S3 Bucket\n(React SPA Build)"]

    ALB --> ECS["ECS Fargate\n(FastAPI Container)"]

    ECS --> RDS["RDS PostgreSQL\n(Managed DB)"]
    ECS --> SM["Secrets Manager\n(API Keys)"]

    ECS --> LLM_EXT["External LLM APIs\n(OpenAI/Anthropic/Google)"]

    subgraph VPC["AWS VPC"]
        ALB
        ECS
        RDS
    end

    style USER fill:#2d3436,stroke:#dfe6e9,color:#fff
    style VPC fill:#0a0a23,stroke:#00d4ff,color:#fff
    style CF fill:#1e3a5f,stroke:#ffd700,color:#fff
    style S3 fill:#1e3a5f,stroke:#00ff88,color:#fff
    style ECS fill:#1e3a5f,stroke:#a29bfe,color:#fff
    style RDS fill:#1e3a5f,stroke:#e94560,color:#fff
```

---

## 11. Future Enhancement Roadmap

```mermaid
flowchart LR
    subgraph PHASE1["🟢 Phase 1: Core"]
        direction TB
        P1A["Streaming SSE\nResponses"]
        P1B["JWT Auth\n(Google/GitHub OAuth)"]
        P1C["Spaced\nRepetition"]
        P1D["Problem\nBookmarking"]
        P1E["Light/Dark\nTheme Toggle"]
    end

    subgraph PHASE2["🟡 Phase 2: Advanced"]
        direction TB
        P2A["Code Execution\nSandbox (Judge0)"]
        P2B["Mock Interview\nMode (Timed)"]
        P2C["Progress\nDashboard"]
        P2D["Collaborative\nStudy Groups"]
        P2E["Behavioral\nInterview Prep"]
    end

    subgraph PHASE3["🔴 Phase 3: Scale"]
        direction TB
        P3A["Weakness\nDetection AI"]
        P3B["Company-Specific\nPrep Paths"]
        P3C["Multi-Language\nSolutions"]
        P3D["Voice Interview\nPractice"]
        P3E["Mobile App\n(React Native)"]
        P3F["RAG-Enhanced\nAgents"]
    end

    PHASE1 --> PHASE2 --> PHASE3

    style PHASE1 fill:#1e3a5f,stroke:#00ff88,color:#fff
    style PHASE2 fill:#1e3a5f,stroke:#ffd700,color:#fff
    style PHASE3 fill:#1e3a5f,stroke:#e94560,color:#fff
```

---

## 12. Pattern Detection Categories

```mermaid
flowchart TD
    INPUT["Problem Text"] --> PD["🔎 Pattern Detection Engine\n(13 Regex Rules)"]

    PD --> P1["Intervals"]
    PD --> P2["Greedy"]
    PD --> P3["Sliding Window"]
    PD --> P4["Two Pointers"]
    PD --> P5["Binary Search"]
    PD --> P6["Dynamic Programming"]
    PD --> P7["BFS / Level-Order"]
    PD --> P8["Backtracking"]
    PD --> P9["DFS"]
    PD --> P10["Heap / Priority Queue"]
    PD --> P11["Stack / Monotonic Stack"]
    PD --> P12["Tree / BST"]
    PD --> P13["Hash Map / Set"]

    P1 --> SIM["📋 Similar Problems DB\n(60+ curated companions)"]
    P2 --> SIM
    P3 --> SIM
    P4 --> SIM
    P5 --> SIM
    P6 --> SIM
    P7 --> SIM
    P8 --> SIM
    P9 --> SIM
    P10 --> SIM
    P11 --> SIM
    P12 --> SIM
    P13 --> SIM

    style INPUT fill:#2d3436,stroke:#74b9ff,color:#fff
    style PD fill:#2d3436,stroke:#ffeaa7,color:#000
    style SIM fill:#2d3436,stroke:#55efc4,color:#fff
```

---

## How to View These Diagrams

1. **VS Code** — Install "Markdown Preview Mermaid Support" or "Mermaid Markdown Syntax Highlighting" extension
2. **draw.io** — Open `.md` file in draw.io which supports Mermaid rendering
3. **GitHub** — Push to GitHub, it renders Mermaid natively in `.md` files
4. **Mermaid Live Editor** — Copy any diagram block to [mermaid.live](https://mermaid.live)

---

*Built with FastAPI, React, LangChain, and PostgreSQL. Powered by multi-agent AI coaching.*
