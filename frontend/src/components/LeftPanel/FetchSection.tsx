import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { fetchProblem } from '../../api/leetcode'
import type { Difficulty } from '../../store/types'

const s: Record<string, React.CSSProperties> = {
  fetchRow: { display: 'flex', gap: 5, marginBottom: 8 },
  fi: {
    flex: 1, background: 'var(--surface2)', border: '1px solid var(--border2)',
    borderRadius: 7, color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11,
    padding: '7px 10px', outline: 'none',
  },
  fb: {
    background: 'rgba(0,212,170,.15)', border: '1px solid rgba(0,212,170,.4)',
    borderRadius: 7, color: 'var(--accent2)', fontSize: 10, fontFamily: 'var(--mono)',
    padding: '0 10px', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  infoBox: {
    background: 'rgba(108,99,255,.08)', border: '1px solid rgba(108,99,255,.2)',
    borderRadius: 8, padding: '9px 11px', marginBottom: 9, fontSize: 11, lineHeight: 1.6,
  },
  dr: { display: 'flex', gap: 5, marginTop: 5 },
  runBtn: {
    width: '100%', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
    border: 'none', borderRadius: 8, color: '#fff', fontFamily: 'var(--sans)',
    fontSize: 12, fontWeight: 500, padding: 9, cursor: 'pointer', marginTop: 4,
  },
}

const badgeStyles = (status: string): React.CSSProperties => {
  const map: Record<string, { bg: string; border: string; color: string }> = {
    idle: { bg: 'rgba(108,99,255,.1)', border: 'rgba(108,99,255,.3)', color: 'var(--accent)' },
    ok: { bg: 'rgba(0,212,170,.1)', border: 'rgba(0,212,170,.3)', color: 'var(--accent2)' },
    error: { bg: 'rgba(255,107,107,.1)', border: 'rgba(255,107,107,.3)', color: 'var(--accent3)' },
    loading: { bg: 'rgba(255,169,77,.1)', border: 'rgba(255,169,77,.3)', color: 'var(--accent4)' },
  }
  const m = map[status] || map.idle
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px',
    fontSize: 10, fontFamily: 'var(--mono)', borderRadius: 6, marginBottom: 6,
    background: m.bg, border: `1px solid ${m.border}`, color: m.color,
  }
}

export default function FetchSection() {
  const {
    slugInput, setSlugInput, fetchedProblem, setFetchedProblem,
    fetchStatus, setFetchStatus, fetchError,
    difficulty, setDifficulty, setManualDescription,
  } = useAppStore()

  const handleFetch = async () => {
    if (!slugInput.trim()) return
    setFetchStatus('loading')
    try {
      const data = await fetchProblem(slugInput)
      setFetchedProblem(data)
      setFetchStatus('ok')
      const diff = data.difficulty?.toLowerCase()
      if (diff === 'easy' || diff === 'medium' || diff === 'hard') {
        setDifficulty(diff as Difficulty)
      }
      const preview = data.content.slice(0, 600) + (data.content.length > 600 ? '…' : '')
      setManualDescription(`#${data.leetcode_id} ${data.title}\n\n${preview}`)
    } catch {
      setFetchStatus('error', 'Fetch failed — paste manually or try another slug')
      setFetchedProblem(null)
    }
  }

  const diffButtons: { d: Difficulty; label: string }[] = [
    { d: 'easy', label: 'Easy' },
    { d: 'medium', label: 'Med' },
    { d: 'hard', label: 'Hard' },
  ]
  const diffColors: Record<string, string> = { easy: '#00d4aa', medium: '#ffa94d', hard: '#ff6b6b' }

  return (
    <div style={{ padding: 13, borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 9, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 9, fontFamily: 'var(--mono)' }}>
        🔗 Fetch from LeetCode
      </div>

      <div style={s.infoBox}>
        <h4 style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>Direct LeetCode Integration</h4>
        Type a slug like <code style={{ fontFamily: 'var(--mono)', background: 'rgba(255,255,255,.07)', padding: '1px 4px', borderRadius: 3 }}>two-sum</code> or a number like <code style={{ fontFamily: 'var(--mono)', background: 'rgba(255,255,255,.07)', padding: '1px 4px', borderRadius: 3 }}>1</code> to auto-load.
      </div>

      <div style={s.fetchRow}>
        <input
          style={s.fi}
          value={slugInput}
          onChange={(e) => setSlugInput(e.target.value)}
          placeholder="slug or #number (e.g. two-sum)"
          onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
        />
        <button style={s.fb} onClick={handleFetch} disabled={fetchStatus === 'loading'}>
          {fetchStatus === 'loading' ? '...' : 'Fetch ↗'}
        </button>
      </div>

      {fetchStatus === 'loading' && <div style={badgeStyles('loading')}>⏳ Fetching from LeetCode...</div>}
      {fetchStatus === 'ok' && fetchedProblem && (
        <div>
          <div style={badgeStyles('ok')}>
            ✅ #{fetchedProblem.leetcode_id} {fetchedProblem.title} · {fetchedProblem.difficulty}
          </div>
          {fetchedProblem.tags.length > 0 && (
            <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3, fontFamily: 'var(--mono)' }}>
              Tags: {fetchedProblem.tags.join(', ')}
            </div>
          )}
        </div>
      )}
      {fetchStatus === 'error' && <div style={badgeStyles('error')}>⚠️ {fetchError}</div>}

      <div style={{ marginBottom: 8, marginTop: 8 }}>
        <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Or paste problem statement</label>
        <textarea
          placeholder="Paste problem here if fetch fails..."
          onChange={(e) => setManualDescription(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Difficulty</label>
        <div style={s.dr}>
          {diffButtons.map(({ d, label }) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={{
                flex: 1, padding: '5px 0', borderRadius: 6, fontSize: 10,
                cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s',
                background: difficulty === d ? `color-mix(in srgb, ${diffColors[d]} 15%, transparent)` : 'transparent',
                border: `1px solid ${difficulty === d ? diffColors[d] : 'var(--border2)'}`,
                color: difficulty === d ? diffColors[d] : 'var(--muted)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
