import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatMarkdown } from '../../utils/formatMessage'

export default function StrategyTab() {
  const strategyContent = useAppStore((s) => s.strategyContent)

  if (!strategyContent) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 16px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.45 }}>🎯</div>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 7, color: 'var(--text)' }}>
          Strategy appears after analysis
        </h3>
        <p style={{ fontSize: 12, lineHeight: 1.6 }}>
          Step-by-step approach, pattern recognition, mental models, and interview trigger signals.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
      <div
        className="md-content"
        style={{ fontSize: 12, lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: formatMarkdown(strategyContent) }}
      />
    </div>
  )
}
