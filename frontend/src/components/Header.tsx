import React from 'react'

const styles: Record<string, React.CSSProperties> = {
  header: {
    padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--surface)',
    flexShrink: 0,
  },
  logo: {
    width: 30,
    height: 30,
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
  title: { fontSize: 14, fontWeight: 600 },
  sub: { fontSize: 10, color: 'var(--muted)', marginTop: 1 },
  badge: {
    marginLeft: 'auto',
    fontSize: 9,
    fontFamily: 'var(--mono)',
    color: 'var(--accent2)',
    border: '1px solid rgba(0,212,170,0.3)',
    padding: '3px 8px',
    borderRadius: 20,
    letterSpacing: 0.5,
  },
}

export default function Header() {
  return (
    <div style={styles.header}>
      <div style={styles.logo}>⚡</div>
      <div>
        <div style={styles.title}>LeetCode Multi-Agent Coach</div>
        <div style={styles.sub}>Live problem fetch · 5 AI agents · FAANG prep</div>
      </div>
      <div style={styles.badge}>MULTI-AGENT · LIVE</div>
    </div>
  )
}
