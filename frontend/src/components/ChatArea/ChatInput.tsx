import React, { useState } from 'react'

export default function ChatInput({ onSend, disabled }: { onSend: (msg: string) => void; disabled: boolean }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div style={{
      borderTop: '1px solid var(--border)', padding: '10px 14px',
      background: 'var(--surface)', display: 'flex', gap: 7, flexShrink: 0,
    }}>
      <input
        type="text"
        style={{
          flex: 1, background: 'var(--surface2)', border: '1px solid var(--border2)',
          borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--sans)',
          fontSize: 12, padding: '8px 11px', outline: 'none',
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask a follow-up..."
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        style={{
          background: 'var(--accent)', border: 'none', borderRadius: 8,
          color: '#fff', fontFamily: 'var(--sans)', fontSize: 12,
          padding: '8px 14px', cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.3 : 1,
        }}
      >
        Send
      </button>
    </div>
  )
}
