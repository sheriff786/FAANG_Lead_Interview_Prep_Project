import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatMarkdown } from '../../utils/formatMessage'

const STATIC_RESOURCES = [
  { t: 'NeetCode.io', d: 'Best structured FAANG roadmap — every pattern has a whiteboard video + clean code. Start here.', tags: ['Free', 'Video', 'Roadmap'], c: '#6c63ff' },
  { t: 'Blind 75 / NeetCode 150', d: 'Curated problem sets covering every interview pattern. Master these before random grinding.', tags: ['Curated', 'Problems'], c: '#00d4aa' },
  { t: 'Back To Back SWE (YouTube)', d: 'Whiteboard-style explanations simulating real interviews. Top-tier for DP, trees, and graphs.', tags: ['YouTube', 'Free'], c: '#ffa94d' },
  { t: 'Grokking the Coding Interview (Educative)', d: 'Pattern-based course grouping problems into 16 patterns. Best for building intuition fast.', tags: ['Paid', 'Pattern-Based'], c: '#ff6b6b' },
  { t: 'AlgoExpert', d: 'Video explanations with full complexity walkthroughs. Great alongside coding practice.', tags: ['Paid', 'Video'], c: '#6c63ff' },
  { t: 'LeetCode 75 (Official Study Plan)', d: 'Official curated plan. Sort problems by company frequency for targeted prep.', tags: ['Free', 'Company-Tagged'], c: '#00d4aa' },
]

export default function ResourcesTab() {
  const { resourceContent, youtubeLinks } = useAppStore()

  if (!resourceContent && youtubeLinks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 16px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.45 }}>📚</div>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 7, color: 'var(--text)' }}>
          Resources appear after analysis
        </h3>
        <p style={{ fontSize: 12, lineHeight: 1.6 }}>
          Curated YouTube channels, roadmaps, and books matched to your problem's pattern.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
      {/* YouTube Videos */}
      {youtubeLinks.length > 0 && (
        <>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, fontFamily: 'var(--mono)' }}>
            📺 YOUTUBE TUTORIALS FOR THIS PROBLEM:
          </div>
          {youtubeLinks.map((v, i) => (
            <a
              key={i}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 12px', marginBottom: 7,
                textDecoration: 'none', color: 'var(--text)', transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent3)' }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              {v.thumbnail && (
                <img
                  src={v.thumbnail}
                  alt=""
                  style={{ width: 80, height: 45, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 500 }}>{v.title}</div>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2, fontFamily: 'var(--mono)' }}>
                  {v.channel} {v.duration && `· ${v.duration}`}
                </div>
              </div>
            </a>
          ))}
          <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }} />
        </>
      )}

      {/* Agent resource text */}
      {resourceContent && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, fontFamily: 'var(--mono)' }}>
            🤖 AGENT RECOMMENDATIONS:
          </div>
          <div
            className="md-content"
            style={{ fontSize: 12, lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: formatMarkdown(resourceContent) }}
          />
        </div>
      )}

      {/* Static resources */}
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, fontFamily: 'var(--mono)' }}>
        📖 TOP RESOURCES FOR FAANG PREP:
      </div>
      {STATIC_RESOURCES.map((r, i) => (
        <div
          key={i}
          style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 9, padding: '12px 14px', marginBottom: 10,
          }}
        >
          <h4 style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{r.t}</h4>
          <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{r.d}</p>
          <div style={{ marginTop: 7, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {r.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 9, fontFamily: 'var(--mono)', padding: '2px 7px', borderRadius: 10,
                  background: `${r.c}22`, color: r.c, border: `1px solid ${r.c}44`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
