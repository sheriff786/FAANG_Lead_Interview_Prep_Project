import React, { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatMarkdown } from '../../utils/formatMessage'

const s: Record<string, React.CSSProperties> = {
  wrap: { padding: 16, overflowY: 'auto', flex: 1 },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontSize: 13, fontWeight: 600, color: 'var(--accent2)' },
  copyBtn: {
    background: 'rgba(0,212,170,.1)', border: '1px solid rgba(0,212,170,.3)',
    borderRadius: 6, color: 'var(--accent2)', fontSize: 10, fontFamily: 'var(--mono)',
    padding: '5px 12px', cursor: 'pointer', transition: 'all 0.2s',
  },
  codeWrap: {
    background: '#0d1117', border: '1px solid var(--border2)',
    borderRadius: 10, overflow: 'hidden', marginBottom: 14,
  },
  codeLang: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(108,99,255,.08)', padding: '6px 12px',
    borderBottom: '1px solid var(--border2)',
  },
  langTag: {
    fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--accent)',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  pre: {
    margin: 0, padding: '14px 16px', overflowX: 'auto',
    fontSize: 12, lineHeight: 1.6, fontFamily: 'var(--mono)',
    color: '#e6edf3',
  },
  section: {
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '13px 15px', marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 8,
    display: 'flex', alignItems: 'center', gap: 6,
  },
}

function extractCodeBlocks(text: string): { lang: string; code: string }[] {
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  const blocks: { lang: string; code: string }[] = []
  let match
  while ((match = regex.exec(text)) !== null) {
    blocks.push({ lang: match[1] || 'python', code: match[2].trim() })
  }
  return blocks
}

function extractSections(text: string) {
  // Remove code blocks, then split by headings or bold markers
  const withoutCode = text.replace(/```[\w]*\n?[\s\S]*?```/g, '___CODE_BLOCK___')
  const parts = withoutCode.split(/(?=#{1,3} |\*\*[^*]+\*\*)/g).filter(Boolean)
  return parts
}

export default function CodeTab() {
  const codeContent = useAppStore((s) => s.codeContent)
  const [copied, setCopied] = useState<number | null>(null)

  if (!codeContent) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 16px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.45 }}>🐍</div>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 7, color: 'var(--text)' }}>
          Python solution appears after analysis
        </h3>
        <p style={{ fontSize: 12, lineHeight: 1.6 }}>
          Pseudocode, clean Python solution with comments, complexity analysis, and common pitfalls.
        </p>
      </div>
    )
  }

  const codeBlocks = extractCodeBlocks(codeContent)
  const sections = extractSections(codeContent)

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.title}>🐍 Python Solution</div>
        {codeBlocks.length > 0 && (
          <button
            style={s.copyBtn}
            onClick={() => handleCopy(codeBlocks.map(b => b.code).join('\n\n'), -1)}
          >
            {copied === -1 ? '✓ Copied!' : '📋 Copy All Code'}
          </button>
        )}
      </div>

      {/* Code blocks with syntax highlight styling */}
      {codeBlocks.map(({ lang, code }, i) => (
        <div key={i} style={s.codeWrap}>
          <div style={s.codeLang}>
            <span style={s.langTag}>{lang || 'python'}</span>
            <button
              style={{ ...s.copyBtn, padding: '3px 8px', fontSize: 9 }}
              onClick={() => handleCopy(code, i)}
            >
              {copied === i ? '✓' : '📋'}
            </button>
          </div>
          <pre style={s.pre}><code>{code}</code></pre>
        </div>
      ))}

      {/* Remaining content (complexity, tips, etc.) */}
      {sections
        .filter(s => !s.includes('___CODE_BLOCK___') || s.replace('___CODE_BLOCK___', '').trim())
        .map((section, i) => {
          const cleaned = section.replace(/___CODE_BLOCK___/g, '').trim()
          if (!cleaned) return null
          return (
            <div key={`s-${i}`} style={s.section}>
              <div
                className="md-content"
                style={{ fontSize: 12, lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(cleaned) }}
              />
            </div>
          )
        })}
    </div>
  )
}
