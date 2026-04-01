import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import type { TabId } from '../../store/types'

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'analysis', icon: '🔍', label: 'Analysis' },
  { id: 'strategy', icon: '🎯', label: 'Strategy' },
  { id: 'code', icon: '🐍', label: 'Solution' },
  { id: 'similar', icon: '🔗', label: 'Similar Problems' },
  { id: 'resources', icon: '📚', label: 'Resources' },
  { id: 'systemdesign', icon: '🏗️', label: 'System Design' },
]

export default function TabBar() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <div style={{
      display: 'flex', borderBottom: '1px solid var(--border)',
      background: 'var(--surface)', padding: '0 14px', gap: 2, flexShrink: 0,
    }}>
      {TABS.map(({ id, icon, label }) => (
        <div
          key={id}
          onClick={() => setActiveTab(id)}
          style={{
            padding: '10px 13px', fontSize: 11, fontWeight: 500,
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s, border-color 0.2s',
            borderBottom: `2px solid ${activeTab === id ? 'var(--accent)' : 'transparent'}`,
            color: activeTab === id ? 'var(--accent)' : 'var(--muted)',
          }}
        >
          {icon} {label}
        </div>
      ))}
    </div>
  )
}
