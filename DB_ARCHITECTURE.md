# Database Architecture

## Overview
- Database: PostgreSQL 16
- Connection: postgresql+asyncpg://faang_user:faang_pass_2024@localhost:5432/faang_prep

## Entity Relationship Diagram (ERD)

```
┌──────────────────────┐       ┌──────────────────────────────────┐
│      problems        │       │          analyses                │
├──────────────────────┤       ├──────────────────────────────────┤
│ id (PK, SERIAL)     │──┐    │ id (PK, SERIAL)                 │
│ leetcode_id (INT)    │  │    │ problem_id (FK -> problems.id) │
│ title (VARCHAR)      │  └───→│ difficulty (VARCHAR)            │
│ slug (VARCHAR, UNQ)  │       │ level (VARCHAR)                 │
│ difficulty (VARCHAR) │       │ analysis_text (TEXT)            │
│ content (TEXT)       │       │ strategy_text (TEXT)            │
│ tags (JSON)          │       │ code_text (TEXT)                │
│ fetched_at (DATETIME)│       │ resource_text (TEXT)            │
└──────────────────────┘       │ detected_pattern (VARCHAR)       │
          │                    │ created_at (DATETIME)           │
          ▼                    └──────────────────────────────────┘
┌──────────────────────────────┐
│      similar_questions       │
├──────────────────────────────┤
│ id (PK, SERIAL)             │
│ problem_id (FK -> problems.id)
│ title (VARCHAR)              │
│ level (VARCHAR)              │
│ company_asked (VARCHAR)      │
│ resources (TEXT)             │
│ created_at (DATETIME)        │
└──────────────────────────────┘

┌──────────────────────────────┐    ┌──────────────────────────────┐
│    system_design_topics      │    │       chat_messages          │
├──────────────────────────────┤    ├──────────────────────────────┤
│ id (PK, SERIAL)             │    │ id (PK, SERIAL)              │
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

## Tables

### problems
- id (PK, SERIAL)
- leetcode_id (INT)
- title (VARCHAR)
- slug (VARCHAR, UNIQUE)
- difficulty (VARCHAR)
- content (TEXT)
- tags (JSON)
- fetched_at (DATETIME)

### analyses
- id (PK, SERIAL)
- problem_id (FK -> problems.id)
- difficulty (VARCHAR)
- level (VARCHAR)
- analysis_text (TEXT)
- strategy_text (TEXT)
- code_text (TEXT)
- resource_text (TEXT)
- detected_pattern (VARCHAR)
- created_at (DATETIME)

### similar_questions
- id (PK, SERIAL)
- problem_id (FK -> problems.id)
- title (VARCHAR)
- level (VARCHAR)
- company_asked (VARCHAR)
- resources (TEXT)
- created_at (DATETIME)

### system_design_topics
- id (PK, SERIAL)
- title (VARCHAR, UNIQUE)
- category (VARCHAR)
- description (TEXT)
- requirements_text (TEXT)
- high_level_design (TEXT)
- deep_dive (TEXT)
- llm_provider (VARCHAR)
- created_at (DATETIME)

### chat_messages
- id (PK, SERIAL)
- session_id (UUID)
- role (VARCHAR)
- agent (VARCHAR, nullable)
- content (TEXT)
- order (INT)
- created_at (DATETIME)
