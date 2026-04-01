import React, { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { getSystemDesignTopics, analyzeSystemDesign } from '../../api/systemDesign'
import { formatMarkdown } from '../../utils/formatMessage'
import Loader from '../common/Loader'

export default function SystemDesignTab() {
  const { systemDesignResult, systemDesignLoading, setSystemDesignResult, setSystemDesignLoading, level } = useAppStore()
  const [topics, setTopics] = useState<{ title: string; category: string }[]>([])
  const [customTopic, setCustomTopic] = useState('')
  const [activeSection, setActiveSection] = useState<'requirements' | 'hld' | 'deep_dive'>('requirements')

  useEffect(() => {
    getSystemDesignTopics().then(setTopics).catch(() => {})
  }, [])

  const handleAnalyze = async (topic: string) => {
    if (!topic.trim() || systemDesignLoading) return
    setSystemDesignLoading(true)
    setSystemDesignResult(null)
    try {
      const result = await analyzeSystemDesign(topic, level)
      setSystemDesignResult(result)
    } catch {
      // Error handling
    }
    setSystemDesignLoading(false)
  }

  const sections = [
    { key: 'requirements' as const, label: '📋 Requirements', icon: '📋' },
    { key: 'hld' as const, label: '🏗️ High-Level Design', icon: '🏗️' },
    { key: 'deep_dive' as const, label: '🔬 Deep Dive', icon: '🔬' },
  ]

  return (
    <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
      {/* Topic selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 9, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--mono)' }}>
          🏗️ System Design Topics
        </div>

        <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
          <input
            type="text"
            style={{
              flex: 1, background: 'var(--surface2)', border: '1px solid var(--border2)',
              borderRadius: 7, color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11,
              padding: '7px 10px', outline: 'none',
            }}
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Type custom topic (e.g. Design Twitter)"
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(customTopic)}
          />
          <button
            onClick={() => handleAnalyze(customTopic)}
            disabled={systemDesignLoading || !customTopic.trim()}
            style={{
              background: 'rgba(0,212,170,.15)', border: '1px solid rgba(0,212,170,.4)',
              borderRadius: 7, color: 'var(--accent2)', fontSize: 10, fontFamily: 'var(--mono)',
              padding: '0 10px', cursor: 'pointer', whiteSpace: 'nowrap',
              opacity: systemDesignLoading ? 0.3 : 1,
            }}
          >
            Analyze
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {topics.map((t) => (
            <button
              key={t.title}
              onClick={() => { setCustomTopic(t.title); handleAnalyze(t.title) }}
              disabled={systemDesignLoading}
              style={{
                fontSize: 10, padding: '4px 9px', borderRadius: 20,
                border: '1px solid var(--border2)', background: 'transparent',
                color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--sans)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)' }}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {systemDesignLoading && (
        <div style={{ textAlign: 'center', padding: 30 }}>
          <Loader />
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>Generating system design breakdown...</p>
        </div>
      )}

      {/* Result */}
      {systemDesignResult && !systemDesignLoading && (
        <div>
          <div style={{
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            borderRadius: 10, padding: '13px 15px', marginBottom: 12,
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              {systemDesignResult.title}
            </h3>
            <span style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 10, fontFamily: 'var(--mono)',
              background: 'rgba(108,99,255,.15)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,.3)',
            }}>
              {systemDesignResult.category}
            </span>
          </div>

          {/* Section tabs */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
            {sections.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                style={{
                  flex: 1, padding: '6px 0', borderRadius: 6, fontSize: 10,
                  cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s',
                  background: activeSection === key ? 'rgba(108,99,255,.15)' : 'transparent',
                  border: `1px solid ${activeSection === key ? 'var(--accent)' : 'var(--border2)'}`,
                  color: activeSection === key ? 'var(--accent)' : 'var(--muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Section content */}
          <div
            className="md-content"
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 9, padding: '13px 15px', fontSize: 12, lineHeight: 1.7,
            }}
            dangerouslySetInnerHTML={{
              __html: formatMarkdown(
                activeSection === 'requirements' ? systemDesignResult.requirements :
                activeSection === 'hld' ? systemDesignResult.high_level_design :
                systemDesignResult.deep_dive
              )
            }}
          />

          {/* YouTube */}
          {systemDesignResult.youtube_links.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: 8 }}>
                📺 VIDEO REFERENCES:
              </div>
              {systemDesignResult.youtube_links.map((v, i) => (
                <a
                  key={i}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '8px 10px', marginBottom: 5,
                    textDecoration: 'none', color: 'var(--text)', fontSize: 11,
                  }}
                >
                  {v.thumbnail && (
                    <img src={v.thumbnail} alt="" style={{ width: 60, height: 34, borderRadius: 3, objectFit: 'cover' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 500 }}>{v.title}</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{v.channel}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!systemDesignResult && !systemDesignLoading && (
        <div style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.45 }}>🏗️</div>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 7, color: 'var(--text)' }}>
            System Design Prep
          </h3>
          <p style={{ fontSize: 12, lineHeight: 1.6 }}>
            Select a topic above or type your own to get a complete FAANG-level system design breakdown
            with requirements, architecture, and deep dive.
          </p>
        </div>
      )}
    </div>
  )
}
