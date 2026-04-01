import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { runAnalysis } from '../api/agents'

export function useAnalysis() {
  const store = useAppStore()

  const startAnalysis = useCallback(async () => {
    const {
      fetchedProblem, slugInput, manualDescription, difficulty, level,
      busy, setBusy, clearMessages, addMessage, setAgentStatus,
      setAnalysisResult, incrementAnalyzed, resetAgents,
    } = useAppStore.getState()

    if (!manualDescription && !slugInput && !fetchedProblem) {
      alert('Please fetch a problem or paste a problem statement.')
      return
    }
    if (busy) return

    setBusy(true)
    clearMessages()
    resetAgents()

    // System message for fetched problem
    if (fetchedProblem) {
      addMessage({
        agent: 'system', name: 'System', type: 'system',
        content: `🔗 Loaded: [#${fetchedProblem.leetcode_id} ${fetchedProblem.title}](https://leetcode.com/problems/${fetchedProblem.slug}/) · ${fetchedProblem.difficulty}\nTags: ${fetchedProblem.tags.join(', ') || 'N/A'}`,
      })
    }

    // Show loading states sequentially
    addMessage({ agent: 'analyst', name: 'System', type: 'divider', content: 'AGENT 1 · PROBLEM ANALYST' })
    setAgentStatus('analyst', 'running')

    try {
      const result = await runAnalysis({
        slug_or_id: slugInput || fetchedProblem?.slug,
        manual_description: manualDescription || undefined,
        difficulty,
        level,
      })

      // Agent 1 done
      setAgentStatus('analyst', 'done')
      addMessage({ agent: 'analyst', name: 'Problem Analyst', type: 'normal', content: result.analysis.content })

      // Agent 2
      addMessage({ agent: 'strategy', name: 'System', type: 'divider', content: 'AGENT 2 · STRATEGY COACH' })
      setAgentStatus('strategy', 'done')
      addMessage({ agent: 'strategy', name: 'Strategy Coach', type: 'normal', content: result.strategy.content })

      // Agent 3
      addMessage({ agent: 'code', name: 'System', type: 'divider', content: 'AGENT 3 · CODE MENTOR' })
      setAgentStatus('code', 'done')
      addMessage({ agent: 'code', name: 'Code Mentor', type: 'normal', content: result.code.content })

      // Agent 4
      addMessage({ agent: 'resource', name: 'System', type: 'divider', content: 'AGENT 4 · RESOURCE FINDER' })
      setAgentStatus('resource', 'done')
      addMessage({ agent: 'resource', name: 'Resource Finder', type: 'normal', content: result.resources.content })

      // Final
      addMessage({ agent: 'analyst', name: 'System', type: 'divider', content: 'ANALYSIS COMPLETE' })
      addMessage({
        agent: 'system', name: 'System', type: 'system',
        content: '✅ All 4 agents done! Check the **Similar Problems** tab for related questions with LeetCode links, and **Resources** for study materials & YouTube videos. Ask follow-ups below.',
      })

      setAnalysisResult(result)
      incrementAnalyzed()

    } catch (err: any) {
      addMessage({
        agent: 'system', name: 'System', type: 'system',
        content: `Error: ${err?.response?.data?.detail || err?.message || 'Analysis failed'}`,
      })
      ;(['analyst', 'strategy', 'code', 'resource'] as const).forEach((a) => setAgentStatus(a, 'error'))
    }

    setBusy(false)
  }, [])

  return { startAnalysis }
}
