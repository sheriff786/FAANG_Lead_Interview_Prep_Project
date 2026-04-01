import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import type { Level } from '../../store/types'

export default function ConfigSection() {
  const { level, setLevel } = useAppStore()

  return (
    <div style={{ padding: 13, borderBottom: '1px solid var(--border)' }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Your level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as Level)}
        >
          <option value="beginner">Beginner (&lt;6 months)</option>
          <option value="intermediate">Intermediate (6m–2yr)</option>
          <option value="advanced">Advanced (2+ years)</option>
        </select>
      </div>
    </div>
  )
}
