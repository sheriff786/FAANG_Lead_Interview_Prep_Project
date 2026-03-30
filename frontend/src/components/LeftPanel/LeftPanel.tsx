import React from 'react'
import FetchSection from './FetchSection'
import ConfigSection from './ConfigSection'
import AgentStatusPanel from './AgentStatusPanel'
import SessionProgress from './SessionProgress'
import { useAppStore } from '../../store/useAppStore'

export default function LeftPanel({ onAnalyze }: { onAnalyze: () => void }) {
  const busy = useAppStore((s) => s.busy)

  return (
    <div style={{
      width: 265, minWidth: 265,
      borderRight: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <FetchSection />
      <ConfigSection />
      <div style={{ padding: 13, borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={onAnalyze}
          disabled={busy}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            border: 'none', borderRadius: 8, color: '#fff',
            fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
            padding: 9, cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.35 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {busy ? '⏳ Analyzing...' : '⚡ Analyze with All Agents'}
        </button>
      </div>
      <AgentStatusPanel />
      <SessionProgress />
    </div>
  )
}
