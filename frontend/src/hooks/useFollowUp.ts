import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { sendFollowUp } from '../api/agents'

export function useFollowUp() {
  const handleFollowUp = useCallback(async (message: string) => {
    const {
      busy, setBusy, addMessage, sessionId, level,
      fetchedProblem, manualDescription, slugInput,
    } = useAppStore.getState()

    if (!message.trim() || busy) return

    setBusy(true)

    addMessage({ agent: 'user', name: 'You', type: 'normal', content: message })

    const context = fetchedProblem
      ? `Problem #${fetchedProblem.leetcode_id}: ${fetchedProblem.title} - ${fetchedProblem.content?.slice(0, 500)}`
      : manualDescription || slugInput || 'a LeetCode problem'

    try {
      const { reply } = await sendFollowUp({
        session_id: sessionId,
        message,
        context,
        level,
      })
      addMessage({ agent: 'strategy', name: 'Coach', type: 'normal', content: reply })
    } catch (err: any) {
      addMessage({
        agent: 'system', name: 'System', type: 'system',
        content: `Error: ${err?.response?.data?.detail || err?.message || 'Failed to get response'}`,
      })
    }

    setBusy(false)
  }, [])

  return { handleFollowUp }
}
