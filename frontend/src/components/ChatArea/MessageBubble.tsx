import React from 'react'
import { formatMarkdown } from '../../utils/formatMessage'
import type { Message } from '../../store/types'

const AGENT_COLORS: Record<string, string> = {
  analyst: '#6c63ff',
  strategy: '#00d4aa',
  code: '#ffa94d',
  resource: '#ff6b6b',
  user: '#888899',
  system: '#6c63ff',
}

const AGENT_ICONS: Record<string, string> = {
  analyst: '🔍',
  strategy: '🎯',
  code: '💻',
  resource: '📚',
  user: '👤',
  system: '🤖',
}

export default function MessageBubble({ msg }: { msg: Message }) {
  if (msg.type === 'divider') {
    return (
      <div style={{
        textAlign: 'center', fontSize: 9, color: 'var(--muted)',
        fontFamily: 'var(--mono)', letterSpacing: 1, padding: '3px 0',
        position: 'relative',
      }}>
        <span style={{
          position: 'relative', zIndex: 1, background: 'var(--bg)',
          padding: '0 12px',
        }}>
          {msg.content}
        </span>
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 1, background: 'var(--border)',
        }} />
      </div>
    )
  }

  const color = AGENT_COLORS[msg.agent] || '#6c63ff'
  const icon = AGENT_ICONS[msg.agent] || '🤖'

  return (
    <div style={{ display: 'flex', gap: 10, animation: 'fadeUp 0.3s ease' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, flexShrink: 0,
        background: `${color}22`, color,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color }}>{msg.name}</span>
          <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{msg.timestamp}</span>
        </div>
        <div
          className="md-content"
          style={{
            background: msg.type === 'system' ? 'var(--surface)' : 'var(--surface2)',
            border: `1px ${msg.type === 'system' ? 'dashed' : 'solid'} var(--border)`,
            borderRadius: 9, padding: '11px 13px',
            fontSize: msg.type === 'system' ? 11 : 12,
            lineHeight: 1.7,
            color: msg.type === 'system' ? 'var(--muted)' : 'var(--text)',
            fontFamily: msg.type === 'system' ? 'var(--mono)' : undefined,
          }}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
        />
      </div>
    </div>
  )
}
