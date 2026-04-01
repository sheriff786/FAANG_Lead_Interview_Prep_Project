import React, { useRef, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import MessageBubble from './MessageBubble'

export default function AnalysisTab() {
  const messages = useAppStore((s) => s.messages)
  const msgsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 16px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.45 }}>🤖</div>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 7, color: 'var(--text)' }}>
          Ready to coach you
        </h3>
        <p style={{ fontSize: 12, lineHeight: 1.6 }}>
          Fetch a LeetCode problem by typing its slug (e.g.{' '}
          <strong style={{ color: 'var(--accent)' }}>merge-intervals</strong>) or number,
          then click <strong style={{ color: 'var(--accent)' }}>Analyze</strong> — all 4 agents
          break it down for FAANG prep.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={msgsRef}
      style={{
        flex: 1, overflowY: 'auto', padding: 16,
        display: 'flex', flexDirection: 'column', gap: 13,
      }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
    </div>
  )
}
