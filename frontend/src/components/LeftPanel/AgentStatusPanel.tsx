import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import type { AgentStatus } from '../../store/types'

const AGENTS = [
  { key: 'analyst' as const, name: 'Problem Analyst', abbr: 'PA', color: '#6c63ff' },
  { key: 'strategy' as const, name: 'Strategy Coach', abbr: 'SC', color: '#00d4aa' },
  { key: 'code' as const, name: 'Code Mentor', abbr: 'CM', color: '#ffa94d' },
  { key: 'resource' as const, name: 'Resource Finder', abbr: 'RF', color: '#ff6b6b' },
]

const statusLabels: Record<AgentStatus, string> = {
  idle: 'idle',
  running: 'analyzing...',
  done: 'done ✓',
  error: 'error',
}

export default function AgentStatusPanel() {
  const agentStates = useAppStore((s) => s.agentStates)

  return (
    <div style={{ padding: 13, borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 9, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 9, fontFamily: 'var(--mono)' }}>
        Active Agents
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {AGENTS.map(({ key, name, abbr, color }) => {
          const status = agentStates[key]
          return (
            <div
              key={key}
              style={{
                background: 'var(--surface2)',
                border: `1px solid ${status === 'running' || status === 'done' ? color : 'var(--border)'}`,
                borderRadius: 8,
                padding: '9px 11px',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                transition: 'border-color 0.2s',
              }}
            >
              <div
                style={{
                  width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0,
                  position: 'relative',
                  animation: status === 'running' ? 'pulse 1.2s ease-in-out infinite' : undefined,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 500 }}>{name}</div>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 1, fontFamily: 'var(--mono)' }}>
                  {statusLabels[status]}
                </div>
              </div>
              <div style={{
                fontSize: 8, fontFamily: 'var(--mono)', padding: '2px 5px',
                borderRadius: 10, border: `1px solid ${color}`, color, opacity: 0.7,
              }}>
                {abbr}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
