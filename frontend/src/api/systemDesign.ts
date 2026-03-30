import api from './index'
import type { SystemDesignResult } from '../store/types'

export async function getSystemDesignTopics(): Promise<{ title: string; category: string }[]> {
  const { data } = await api.get('/api/system-design/topics')
  return data
}

export async function analyzeSystemDesign(topic: string, level: string): Promise<SystemDesignResult> {
  const { data } = await api.post('/api/system-design/analyze', { topic, level })
  return data
}
