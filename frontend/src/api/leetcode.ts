import api from './index'
import type { ProblemData, LeetCodeUser, LeetCodeProgress, LeetCodeSubmission } from '../store/types'

export async function fetchProblem(slugOrId: string): Promise<ProblemData> {
  const { data } = await api.post('/api/leetcode/fetch', { slug_or_id: slugOrId })
  return data
}

// ── LeetCode Account API ────────────────────────────────────────────────────

export async function connectLeetCode(sessionCookie: string, csrfToken?: string): Promise<LeetCodeUser & { connected: boolean }> {
  const { data } = await api.post('/api/leetcode-account/connect', {
    session_cookie: sessionCookie,
    csrf_token: csrfToken || null,
  })
  return data
}

export async function disconnectLeetCode(): Promise<void> {
  await api.post('/api/leetcode-account/disconnect')
}

export async function getLeetCodeStatus(): Promise<{ connected: boolean; username: string | null }> {
  const { data } = await api.get('/api/leetcode-account/status')
  return data
}

export async function getLeetCodeProfile(): Promise<LeetCodeUser & { ranking: number | null; reputation: number; solved: Record<string, number> }> {
  const { data } = await api.get('/api/leetcode-account/profile')
  return data
}

export async function getLeetCodeProgress(): Promise<LeetCodeProgress> {
  const { data } = await api.get('/api/leetcode-account/progress')
  return data
}

export async function getLeetCodeSubmissions(limit: number = 15): Promise<LeetCodeSubmission[]> {
  const { data } = await api.get(`/api/leetcode-account/submissions?limit=${limit}`)
  return data
}
