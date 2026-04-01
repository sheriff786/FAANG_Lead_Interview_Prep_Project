import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type {
  Difficulty, Level, AgentStatus, TabId,
  ProblemData, Message, AgentState, AnalysisResult, SystemDesignResult,
  SimilarProblem, YouTubeVideo, LeetCodeUser, LeetCodeProgress,
} from './types'

interface AppStore {
  // Config
  difficulty: Difficulty
  level: Level
  activeTab: TabId
  sessionId: string

  // Problem
  slugInput: string
  manualDescription: string
  fetchedProblem: ProblemData | null
  fetchStatus: 'idle' | 'loading' | 'ok' | 'error'
  fetchError: string

  // Agents
  agentStates: AgentState
  busy: boolean

  // Messages
  messages: Message[]
  strategyContent: string
  codeContent: string
  resourceContent: string
  detectedPattern: string
  similarProblems: SimilarProblem[]
  youtubeLinks: YouTubeVideo[]

  // Session progress
  analyzedCount: number

  // System Design
  systemDesignResult: SystemDesignResult | null
  systemDesignLoading: boolean

  // LeetCode Account
  lcConnected: boolean
  lcUser: LeetCodeUser | null
  lcProgress: LeetCodeProgress | null
  lcConnecting: boolean

  // Actions
  setDifficulty: (d: Difficulty) => void
  setLevel: (l: Level) => void
  setActiveTab: (t: TabId) => void
  setSlugInput: (s: string) => void
  setManualDescription: (s: string) => void
  setFetchedProblem: (p: ProblemData | null) => void
  setFetchStatus: (s: 'idle' | 'loading' | 'ok' | 'error', err?: string) => void
  setAgentStatus: (agent: keyof AgentState, status: AgentStatus) => void
  setBusy: (b: boolean) => void
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  setAnalysisResult: (r: AnalysisResult) => void
  incrementAnalyzed: () => void
  setSystemDesignResult: (r: SystemDesignResult | null) => void
  setSystemDesignLoading: (b: boolean) => void
  resetAgents: () => void
  setLcConnected: (connected: boolean, user?: LeetCodeUser | null) => void
  setLcProgress: (p: LeetCodeProgress | null) => void
  setLcConnecting: (b: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  difficulty: 'medium',
  level: 'intermediate',
  activeTab: 'analysis',
  sessionId: uuidv4(),

  slugInput: '',
  manualDescription: '',
  fetchedProblem: null,
  fetchStatus: 'idle',
  fetchError: '',

  agentStates: { analyst: 'idle', strategy: 'idle', code: 'idle', resource: 'idle' },
  busy: false,

  messages: [],
  strategyContent: '',
  codeContent: '',
  resourceContent: '',
  detectedPattern: '',
  similarProblems: [],
  youtubeLinks: [],

  analyzedCount: 0,

  systemDesignResult: null,
  systemDesignLoading: false,

  lcConnected: false,
  lcUser: null,
  lcProgress: null,
  lcConnecting: false,

  setDifficulty: (d) => set({ difficulty: d }),
  setLevel: (l) => set({ level: l }),
  setActiveTab: (t) => set({ activeTab: t }),
  setSlugInput: (s) => set({ slugInput: s }),
  setManualDescription: (s) => set({ manualDescription: s }),
  setFetchedProblem: (p) => set({ fetchedProblem: p }),
  setFetchStatus: (s, err) => set({ fetchStatus: s, fetchError: err || '' }),

  setAgentStatus: (agent, status) =>
    set((state) => ({
      agentStates: { ...state.agentStates, [agent]: status },
    })),

  setBusy: (b) => set({ busy: b }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, {
        ...msg,
        id: uuidv4(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }],
    })),

  clearMessages: () => set({ messages: [] }),

  setAnalysisResult: (r) => set({
    strategyContent: r.strategy.content,
    codeContent: r.code.content,
    resourceContent: r.resources.content,
    detectedPattern: r.detected_pattern,
    similarProblems: r.similar_problems,
    youtubeLinks: r.youtube_links,
  }),

  incrementAnalyzed: () =>
    set((state) => ({ analyzedCount: state.analyzedCount + 1 })),

  setSystemDesignResult: (r) => set({ systemDesignResult: r }),
  setSystemDesignLoading: (b) => set({ systemDesignLoading: b }),

  resetAgents: () => set({
    agentStates: { analyst: 'idle', strategy: 'idle', code: 'idle', resource: 'idle' },
  }),

  setLcConnected: (connected, user) => set({
    lcConnected: connected,
    lcUser: user ?? null,
    ...(!connected ? { lcProgress: null } : {}),
  }),
  setLcProgress: (p) => set({ lcProgress: p }),
  setLcConnecting: (b) => set({ lcConnecting: b }),
}))
