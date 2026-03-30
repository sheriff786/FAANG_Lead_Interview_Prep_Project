import api from './index'
import type { ProblemData } from '../store/types'

export async function fetchProblem(slugOrId: string): Promise<ProblemData> {
  const { data } = await api.post('/api/leetcode/fetch', { slug_or_id: slugOrId })
  return data
}
