import React from 'react'
import { useAppStore } from '../../store/useAppStore'

const diffColors: Record<string, string> = { Easy: '#00d4aa', Medium: '#ffa94d', Hard: '#ff6b6b' }

export default function SimilarProblemsTab() {
  const { similarProblems, detectedPattern, fetchedProblem } = useAppStore()

  if (similarProblems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 16px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.45 }}>🔗</div>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 7, color: 'var(--text)' }}>
          Similar problems appear after analysis
        </h3>
        <p style={{ fontSize: 12, lineHeight: 1.6 }}>
          Problems using the same pattern — with clickable LeetCode links, difficulty tags, and why they're related.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12, fontFamily: 'var(--mono)' }}>
        Detected pattern: <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{detectedPattern}</span>
        — click any problem to open on LeetCode
      </div>

      {fetchedProblem && (
        <div style={{
          background: 'var(--surface2)', border: '1px solid var(--border2)',
          borderRadius: 10, padding: '13px 15px', marginBottom: 11,
        }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 7, display: 'flex', alignItems: 'center', gap: 8 }}>
            📌 Current Problem
            <span style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 10, fontFamily: 'var(--mono)',
              background: `${diffColors[fetchedProblem.difficulty] || '#ffa94d'}22`,
              color: diffColors[fetchedProblem.difficulty] || '#ffa94d',
              border: `1px solid ${diffColors[fetchedProblem.difficulty] || '#ffa94d'}44`,
            }}>
              {fetchedProblem.difficulty}
            </span>
          </h3>
          <p style={{ fontSize: 11, color: 'var(--muted)' }}>
            <a
              href={`https://leetcode.com/problems/${fetchedProblem.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent2)', textDecoration: 'none' }}
            >
              #{fetchedProblem.leetcode_id} {fetchedProblem.title}
            </a>
          </p>
        </div>
      )}

      <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: 8 }}>
        SAME PATTERN — PRACTICE THESE NEXT:
      </div>

      {similarProblems.map((p) => {
        const c = diffColors[p.difficulty] || '#ffa94d'
        return (
          <div
            key={p.slug}
            onClick={() => window.open(`https://leetcode.com/problems/${p.slug}/`, '_blank')}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 12px', marginBottom: 7,
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateX(2px)' }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
          >
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', width: 32, flexShrink: 0 }}>
              {p.id}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 12, fontWeight: 500 }}>{p.title}</h4>
              <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{p.why}</p>
            </div>
            <div style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 10, fontFamily: 'var(--mono)',
              background: `${c}22`, color: c, border: `1px solid ${c}44`,
            }}>
              {p.difficulty}
            </div>
          </div>
        )
      })}
    </div>
  )
}
