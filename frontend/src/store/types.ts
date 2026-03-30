export type Difficulty = 'easy' | 'medium' | 'hard'
export type Level = 'beginner' | 'intermediate' | 'advanced'
export type AgentStatus = 'idle' | 'running' | 'done' | 'error'
export type TabId = 'analysis' | 'strategy' | 'similar' | 'resources' | 'systemdesign'

export interface ProblemData {
  leetcode_id: number | null
  title: string
  slug: string
  difficulty: string
  content: string
  tags: string[]
}

export interface Message {
  id: string
  agent: string  // analyst | strategy | code | resource | user | system
  name: string
  content: string
  type: 'normal' | 'system' | 'divider'
  timestamp: string
}

export interface AgentState {
  analyst: AgentStatus
  strategy: AgentStatus
  code: AgentStatus
  resource: AgentStatus
}

export interface SimilarProblem {
  id: string
  title: string
  difficulty: string
  slug: string
  why: string
}

export interface YouTubeVideo {
  title: string
  url: string
  channel: string
  thumbnail: string
  duration: string
}

export interface AnalysisResult {
  problem: ProblemData | null
  analysis: { agent: string; content: string }
  strategy: { agent: string; content: string }
  code: { agent: string; content: string }
  resources: { agent: string; content: string }
  detected_pattern: string
  similar_problems: SimilarProblem[]
  youtube_links: YouTubeVideo[]
}

export interface SystemDesignResult {
  title: string
  category: string
  requirements: string
  high_level_design: string
  deep_dive: string
  youtube_links: YouTubeVideo[]
}

// ── LeetCode Account Connection ──

export interface LeetCodeUser {
  username: string
  real_name: string
  avatar: string
  is_premium: boolean
}

export interface LeetCodeProgress {
  easy: { solved: number; total: number }
  medium: { solved: number; total: number }
  hard: { solved: number; total: number }
  all: { solved: number; total: number }
}

export interface LeetCodeSubmission {
  id: string | null
  title: string
  slug: string
  timestamp: string
  language: string
}
