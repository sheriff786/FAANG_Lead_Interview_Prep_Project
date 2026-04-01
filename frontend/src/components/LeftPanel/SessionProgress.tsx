import React from 'react'
import { useAppStore } from '../../store/useAppStore'

export default function SessionProgress() {
  const analyzedCount = useAppStore((s) => s.analyzedCount)
  const pct = Math.min(100, analyzedCount * 10)

  return (
    <div style={{ padding: 13 }}>
      <div style={{ fontSize: 9, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 9, fontFamily: 'var(--mono)' }}>
        Session
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 5 }}>Problems analyzed</div>
      <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', margin: '5px 0' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
          transition: 'width 0.5s ease',
          width: `${pct}%`,
        }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span>{analyzedCount} analyzed</span>
        <span style={{ color: 'var(--accent2)' }}>{pct}%</span>
      </div>
    </div>
  )
}
