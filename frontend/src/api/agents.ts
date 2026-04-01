import api from './index'
import type { AnalysisResult } from '../store/types'

export async function runAnalysis(params: {
  slug_or_id?: string
  manual_description?: string
  difficulty: string
  level: string
}): Promise<AnalysisResult> {
  const { data } = await api.post('/api/agents/analyze', params)
  return data
}

export async function sendFollowUp(params: {
  session_id: string
  message: string
  context: string
  level: string
}): Promise<{ reply: string }> {
  const { data } = await api.post('/api/agents/followup', params)
  return data
}
