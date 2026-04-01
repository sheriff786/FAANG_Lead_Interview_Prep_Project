# FAANG Interview Prep Coach — Architecture & Flow Diagrams

> All diagrams below use [Mermaid](https://mermaid.js.org/) syntax. View them in GitHub, VS Code (with Mermaid extension), or any Mermaid-compatible renderer.

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend — React + Vite :5173"]
        UI[Browser UI]
        Store[Zustand Store]
        API[Axios API Layer]
    end

    subgraph Backend["Backend — FastAPI :8000"]
        Router[API Routers]
        Agents[Multi-Agent System]
        Services[Services Layer]
        LLM[LLM Service — LangChain]
    end

    subgraph External["External Services"]
        OpenAI[OpenAI GPT-4o]
        Anthropic[Anthropic Claude]
        Google[Google Gemini]
        LeetCodeAPI[LeetCode GraphQL API]
        YouTubeAPI[YouTube API]
        Playwright[Playwright Chromium]
    end

    subgraph Database["PostgreSQL :5432"]
        Problems[(problems)]
        Analyses[(analyses)]
        Chat[(chat_messages)]
        SysDesign[(system_design_topics)]
    end

    UI --> Store
    Store --> API
    API -->|REST API| Router
    Router --> Agents
    Router --> Services
    Agents --> LLM
    LLM -->|Provider Switch| OpenAI
    LLM -->|Provider Switch| Anthropic
    LLM -->|Provider Switch| Google
    Services -->|Fetch Problems| LeetCodeAPI
    Services -->|Search Videos| YouTubeAPI
    Services -->|Browser Login| Playwright
    Services -->|Read/Write| Problems
    Services -->|Read/Write| Analyses
    Services -->|Read/Write| Chat
    Services -->|Read/Write| SysDesign

    style Frontend fill:#1a1a2e,stroke:#6c63ff,stroke-width:2px,color:#e8e8f2
    style Backend fill:#1a1a2e,stroke:#00d4aa,stroke-width:2px,color:#e8e8f2
    style External fill:#1a1a2e,stroke:#ffa94d,stroke-width:2px,color:#e8e8f2
    style Database fill:#1a1a2e,stroke:#ff6b6b,stroke-width:2px,color:#e8e8f2
```

---

## 2. Multi-Agent AI Pipeline

```mermaid
flowchart TD
    Input["🎯 User Input\n(Problem slug/text + Difficulty + Level)"]
    
    Input --> Fetch["📥 Fetch Problem\n(LeetCode GraphQL → Proxy Fallback → DB Cache)"]
    Fetch --> PA

    subgraph Pipeline["Sequential Agent Pipeline"]
        direction TB
        PA["🔍 Agent 1: Problem Analyst\n─────────────────────\n• What it really asks\n• Key observations (3-4)\n• Why it's tricky\n• Data structures involved"]
        
        SC["🎯 Agent 2: Strategy Coach\n─────────────────────\n• Pattern name (13+ types)\n• Step-by-step approach (5-7)\n• Mental model / analogy\n• Pattern trigger signals"]
        
        CM["🐍 Agent 3: Code Mentor\n─────────────────────\n• Pseudocode (6-9 lines)\n• Python solution\n• Time & Space complexity\n• Common mistakes (2-3)"]
        
        RF["📚 Agent 4: Resource Finder\n─────────────────────\n• Core concept to master\n• 7-day drill plan\n• Interview script\n• Company appearances"]
        
        PA -->|"analysis_text"| SC
        SC -->|"strategy_text"| CM
        SC -->|"strategy_text"| RF
    end

    CM --> Post["🔧 Post-Processing"]
    RF --> Post
    
    Post --> PD["Pattern Detection\n(13 regex rules)"]
    Post --> SP["Similar Problems\n(65+ curated)"]
    Post --> YT["YouTube Search\n(5 videos)"]
    Post --> DB["Save to PostgreSQL"]
    
    PD --> Response["📤 Full Analysis Response"]
    SP --> Response
    YT --> Response
    DB --> Response

    style PA fill:#2d2b55,stroke:#6c63ff,stroke-width:2px,color:#e8e8f2
    style SC fill:#0d3330,stroke:#00d4aa,stroke-width:2px,color:#e8e8f2
    style CM fill:#332800,stroke:#ffa94d,stroke-width:2px,color:#e8e8f2
    style RF fill:#330d0d,stroke:#ff6b6b,stroke-width:2px,color:#e8e8f2
```

---

## 3. User Journey — Problem Analysis

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant Store as Zustand Store
    participant BE as Backend (FastAPI)
    participant LC as LeetCode API
    participant LLM as LLM Provider
    participant DB as PostgreSQL
    participant YT as YouTube

    Note over User,YT: Phase 1 — Fetch Problem
    User->>FE: Enter "two-sum" + click Fetch
    FE->>Store: setFetchStatus("loading")
    FE->>BE: POST /api/leetcode/fetch
    BE->>DB: Check cache (problems table)
    alt Cache Hit
        DB-->>BE: Return cached problem
    else Cache Miss
        BE->>LC: GraphQL query
        LC-->>BE: Problem data
        BE->>DB: Store in problems table
    end
    BE-->>FE: ProblemOut (title, difficulty, tags, content)
    FE->>Store: setFetchedProblem(data)

    Note over User,YT: Phase 2 — AI Analysis
    User->>FE: Select level + click "Analyze"
    FE->>Store: setBusy(true), resetAgents()
    FE->>BE: POST /api/agents/analyze

    rect rgb(45, 43, 85)
        Note over BE,LLM: Agent 1 — Problem Analyst
        BE->>LLM: System prompt + problem text
        LLM-->>BE: analysis_text
    end

    rect rgb(13, 51, 48)
        Note over BE,LLM: Agent 2 — Strategy Coach
        BE->>LLM: System prompt + problem + analysis
        LLM-->>BE: strategy_text
    end

    rect rgb(51, 40, 0)
        Note over BE,LLM: Agent 3 — Code Mentor
        BE->>LLM: System prompt + problem + strategy
        LLM-->>BE: code_text
    end

    rect rgb(51, 13, 13)
        Note over BE,LLM: Agent 4 — Resource Finder
        BE->>LLM: System prompt + problem + strategy
        LLM-->>BE: resource_text
    end

    BE->>BE: Detect pattern + find similar problems
    BE->>YT: Search tutorial videos
    YT-->>BE: 5 video results
    BE->>DB: Store analysis in analyses table
    BE-->>FE: FullAnalysisOut

    FE->>Store: setAnalysisResult(data)
    FE->>Store: Agent statuses → done ✓
    Store-->>User: Results in 6 tabs

    Note over User,YT: Phase 3 — Follow-up Chat
    User->>FE: "Show brute force first"
    FE->>BE: POST /api/agents/followup
    BE->>LLM: Context + question + history
    LLM-->>BE: Coach reply
    BE->>DB: Store in chat_messages
    BE-->>FE: FollowUpResponse
    FE->>Store: addMessage(reply)
    Store-->>User: Reply in Analysis tab
```

---

## 4. System Design Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend
    participant SD as SystemDesign Agent
    participant LLM as LLM Provider
    participant DB as PostgreSQL
    participant YT as YouTube

    User->>FE: Open System Design tab
    FE->>BE: GET /api/system-design/topics
    BE-->>FE: 15 predefined topics

    User->>FE: Click "URL Shortener" (or type custom)
    FE->>BE: POST /api/system-design/analyze

    BE->>DB: Check cache by topic title
    alt Cache Hit
        DB-->>BE: Return cached result
    else Cache Miss
        BE->>SD: Run SystemDesignAgent
        SD->>LLM: System prompt + topic
        LLM-->>SD: Full breakdown
        SD-->>BE: Raw text
        BE->>BE: Parse into sections
        BE->>DB: Store in system_design_topics
    end

    BE->>YT: Search "{topic} system design"
    YT-->>BE: Video results
    BE-->>FE: SystemDesignOut

    FE-->>User: Display 3 sections + videos
    Note over User: Requirements | HLD | Deep Dive
```

---

## 5. LeetCode Account Connection

```mermaid
flowchart TD
    Start["User clicks 'Sign in with Browser'"]

    Start --> Spawn["Backend spawns Playwright subprocess"]
    Spawn --> Browser["Chromium opens\nhttps://leetcode.com/accounts/login/"]
    Browser --> Login["User logs in via\nGoogle / GitHub SSO"]
    Login --> Poll["Playwright polls cookies\nevery 0.5 seconds"]

    Poll --> Check{"LEETCODE_SESSION\ncookie found?"}
    Check -->|"No (< 120s)"| Poll
    Check -->|"No (timeout)"| Timeout["⚠️ Login timed out"]
    Check -->|"Yes"| Capture["Capture session_cookie\n+ csrf_token"]

    Capture --> Verify["Backend verifies via\nLeetCode GraphQL API"]
    Verify --> Valid{"Valid session?"}
    Valid -->|No| Error["❌ Invalid session"]
    Valid -->|Yes| Store["Store in memory\n(_active_session)"]

    Store --> Profile["Fetch user profile\n+ solve progress"]
    Profile --> Display["✅ Show profile card\n+ progress bars"]

    subgraph Alternative["Alternative: Manual Cookie Entry"]
        Manual["User opens DevTools\nApplication → Cookies"]
        Manual --> Copy["Copy LEETCODE_SESSION value"]
        Copy --> Paste["Paste into app input"]
        Paste --> Verify
    end

    style Start fill:#1a1a2e,stroke:#6c63ff,color:#e8e8f2
    style Display fill:#0d3330,stroke:#00d4aa,color:#e8e8f2
    style Timeout fill:#330d0d,stroke:#ff6b6b,color:#e8e8f2
    style Error fill:#330d0d,stroke:#ff6b6b,color:#e8e8f2
```

---

## 6. LLM Provider Architecture

```mermaid
flowchart LR
    Config[".env Configuration\nLLM_PROVIDER = ?"]
    
    Config -->|"openai"| OA["OpenAI\nChatOpenAI\ngpt-4o"]
    Config -->|"anthropic"| AN["Anthropic\nChatAnthropic\nclaude-sonnet-4-20250514"]
    Config -->|"google"| GO["Google\nChatGoogleGenerativeAI\ngemini-1.5-pro"]

    OA --> LC["LangChain\ninvoke_llm()"]
    AN --> LC
    GO --> LC

    LC --> Params["temperature: 0.4\nmax_tokens: 2048"]
    
    Params --> Messages["Message Chain:\n[SystemMessage]\n[...ChatHistory]\n[HumanMessage]"]
    
    Messages --> Response["response.content\n→ Agent output string"]

    subgraph Singleton["Singleton Pattern"]
        LC
        Params
    end

    style OA fill:#2d2b55,stroke:#6c63ff,color:#e8e8f2
    style AN fill:#332800,stroke:#ffa94d,color:#e8e8f2
    style GO fill:#0d3330,stroke:#00d4aa,color:#e8e8f2
```

---

## 7. Frontend Component Tree

```mermaid
graph TD
    App["App.tsx"]

    App --> Header["Header.tsx\n⚡ LeetCode Multi-Agent Coach"]
    App --> LP["LeftPanel.tsx\n(265px sidebar)"]
    App --> CA["ChatArea.tsx\n(main content)"]

    LP --> LCC["LeetCodeConnect.tsx\n🌐 Browser login / manual cookie"]
    LP --> FS["FetchSection.tsx\n📥 Slug input + fetch button"]
    LP --> CS["ConfigSection.tsx\n⚙️ Level selector"]
    LP --> AB["[Analyze Button]\n🚀 Triggers 4-agent pipeline"]
    LP --> ASP["AgentStatusPanel.tsx\n🔍🎯🐍📚 Status indicators"]
    LP --> SP["SessionProgress.tsx\n📊 Problems analyzed counter"]

    CA --> TB["TabBar.tsx\n6 tabs"]
    CA --> AT["AnalysisTab.tsx\n💬 Chat messages"]
    CA --> ST["StrategyTab.tsx\n🎯 Strategy output"]
    CA --> CT["CodeTab.tsx\n🐍 Python solution + copy"]
    CA --> SPT["SimilarProblemsTab.tsx\n🔗 Pattern + related problems"]
    CA --> RT["ResourcesTab.tsx\n📚 YouTube + resources"]
    CA --> SDT["SystemDesignTab.tsx\n🏗️ 15 topics + analysis"]
    CA --> QC["QuickChips.tsx\n💡 Pre-built questions"]
    CA --> CI["ChatInput.tsx\n✏️ Follow-up input"]

    AT --> MB["MessageBubble.tsx\n🗨️ Individual message"]
    RT --> Loader["Loader.tsx\n⏳ Bouncing dots"]
    SDT --> Loader

    style App fill:#1a1a2e,stroke:#6c63ff,stroke-width:2px,color:#e8e8f2
    style LP fill:#1a1a2e,stroke:#6c63ff,color:#e8e8f2
    style CA fill:#1a1a2e,stroke:#00d4aa,color:#e8e8f2
```

---

## 8. Database Entity Relationship

```mermaid
erDiagram
    PROBLEMS {
        uuid id PK
        int leetcode_id UK
        string title
        string slug UK
        string difficulty
        text content
        array tags
        datetime fetched_at
    }

    ANALYSES {
        uuid id PK
        uuid problem_id FK
        string difficulty
        string level
        string llm_provider
        text analysis_text
        text strategy_text
        text code_text
        text resource_text
        string detected_pattern
        datetime created_at
    }

    CHAT_MESSAGES {
        uuid id PK
        string session_id
        string role
        string agent
        text content
        int order
        datetime created_at
    }

    SYSTEM_DESIGN_TOPICS {
        uuid id PK
        string title
        string category
        text description
        text requirements_text
        text high_level_design
        text deep_dive
        string llm_provider
        datetime created_at
    }

    PROBLEMS ||--o{ ANALYSES : "has many"
```

---

## 9. API Route Map

```mermaid
flowchart LR
    subgraph LeetCode["LeetCode Routes"]
        L1["POST /api/leetcode/fetch"]
    end

    subgraph Account["Account Routes"]
        A1["POST /connect"]
        A2["POST /browser-login"]
        A3["GET /status"]
        A4["POST /disconnect"]
        A5["GET /profile"]
        A6["GET /progress"]
        A7["GET /submissions"]
        A8["POST /problems"]
    end

    subgraph Agents["Agent Routes"]
        AG1["POST /api/agents/analyze"]
        AG2["POST /api/agents/followup"]
    end

    subgraph SysDesign["System Design Routes"]
        SD1["GET /api/system-design/topics"]
        SD2["POST /api/system-design/analyze"]
    end

    subgraph YouTube["YouTube Routes"]
        Y1["GET /api/youtube/search"]
    end

    subgraph Health["Health"]
        H1["GET /api/health"]
    end

    L1 -->|"Fetch problem"| DB[(PostgreSQL)]
    AG1 -->|"4 agents + cache"| LLM[LLM Provider]
    AG2 -->|"Follow-up"| LLM
    SD2 -->|"System design"| LLM
    A2 -->|"Browser login"| PW[Playwright]
    Y1 -->|"Video search"| YT[YouTube API]

    style LeetCode fill:#1a1a2e,stroke:#6c63ff,color:#e8e8f2
    style Account fill:#1a1a2e,stroke:#00d4aa,color:#e8e8f2
    style Agents fill:#1a1a2e,stroke:#ffa94d,color:#e8e8f2
    style SysDesign fill:#1a1a2e,stroke:#ff6b6b,color:#e8e8f2
```

---

## 10. Pattern Detection & Similar Problems

```mermaid
flowchart TD
    Input["Strategy Coach Output\n+ Problem Tags"]
    
    Input --> Scan["Regex Pattern Scanner\n(12 rule sets)"]
    
    Scan --> TP["Two Pointers\nsorted, opposite ends, left/right"]
    Scan --> SW["Sliding Window\nsubstring, subarray, contiguous"]
    Scan --> HM["Hash Map\nlookup, frequency, complement"]
    Scan --> BS["Binary Search\nsorted, log(n), divide"]
    Scan --> DP["Dynamic Programming\nfibonacci, optimal, memoization"]
    Scan --> BFS["BFS\nshortest path, level order"]
    Scan --> DFS["DFS\npath finding, connected components"]
    Scan --> STK["Stack\nparentheses, nested, LIFO"]
    Scan --> HEAP["Heap\ntop k, kth largest, priority"]
    Scan --> BT["Backtracking\npermutation, combination"]
    Scan --> TREE["Tree\nbinary tree, BST, root"]
    Scan --> IV["Intervals\noverlap, merge, meeting"]
    Scan --> GR["Greedy\nmaximum, minimum, optimal"]

    TP --> DB["Similar Problems DB\n(65+ curated problems)"]
    SW --> DB
    HM --> DB
    BS --> DB
    DP --> DB
    BFS --> DB
    DFS --> DB
    STK --> DB
    HEAP --> DB
    BT --> DB
    TREE --> DB
    IV --> DB
    GR --> DB

    DB --> Out["4-5 related problems each with:\n• LeetCode ID & title\n• Difficulty\n• Direct link\n• Why it's similar"]

    style Input fill:#1a1a2e,stroke:#6c63ff,color:#e8e8f2
    style DB fill:#1a1a2e,stroke:#00d4aa,color:#e8e8f2
    style Out fill:#1a1a2e,stroke:#ffa94d,color:#e8e8f2
```

---

## 11. Data Flow — Zustand Store

```mermaid
stateDiagram-v2
    [*] --> Idle

    state Idle {
        [*] --> WaitingForInput
        WaitingForInput: slugInput = ""
        WaitingForInput: fetchStatus = "idle"
        WaitingForInput: agentStates = all idle
        WaitingForInput: busy = false
    }

    state Fetching {
        [*] --> Loading
        Loading: fetchStatus = "loading"
        Loading --> Fetched: Success
        Loading --> FetchError: Failure
        Fetched: fetchStatus = "ok"
        Fetched: fetchedProblem = data
        FetchError: fetchStatus = "error"
    }

    state Analyzing {
        [*] --> Agent1Running
        Agent1Running: analyst = "running"
        Agent1Running --> Agent2Running: analyst = "done"
        Agent2Running: strategy = "running"
        Agent2Running --> Agent3Running: strategy = "done"
        Agent3Running: code = "running"
        Agent3Running --> Agent4Running: code = "done"
        Agent4Running: resource = "running"
        Agent4Running --> AllDone: resource = "done"
        AllDone: busy = false
        AllDone: analyzedCount++
    }

    state FollowUp {
        [*] --> UserAsks
        UserAsks: addMessage(user msg)
        UserAsks --> CoachReplies
        CoachReplies: addMessage(coach reply)
        CoachReplies --> UserAsks: Another question
    }

    Idle --> Fetching: Click "Fetch"
    Fetching --> Idle: Problem loaded
    Idle --> Analyzing: Click "Analyze"
    Analyzing --> FollowUp: Analysis complete
    FollowUp --> Analyzing: New problem analyzed
```

---

## 12. Docker Compose Services

```mermaid
graph TB
    subgraph Docker["Docker Compose"]
        PG["🐘 postgres\nPostgreSQL 16 Alpine\nPort: 5432\nVolume: pgdata"]
        
        BE["🐍 backend\nPython 3.12 + FastAPI\nPort: 8000\nDepends: postgres (healthy)"]
        
        FE["⚛️ frontend\nNode.js + Vite\nPort: 5173\nDepends: backend"]
    end

    PG -->|healthcheck\npg_isready| BE
    BE --> FE

    ENV1[".env\n(API keys, DB URL)"] -.->|env_file| BE
    VOL1["./backend:/app"] -.->|volume mount| BE
    VOL2["./frontend:/app"] -.->|volume mount| FE
    VOL3["pgdata"] -.->|persistent volume| PG

    style PG fill:#1a1a2e,stroke:#ff6b6b,stroke-width:2px,color:#e8e8f2
    style BE fill:#1a1a2e,stroke:#00d4aa,stroke-width:2px,color:#e8e8f2
    style FE fill:#1a1a2e,stroke:#6c63ff,stroke-width:2px,color:#e8e8f2
```
