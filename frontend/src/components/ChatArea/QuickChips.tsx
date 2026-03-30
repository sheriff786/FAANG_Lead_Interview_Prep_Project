import React from 'react'

const CHIPS = [
  'Explain with a visual walkthrough example',
  'Show brute force approach first then optimize',
  'Give me a hint without giving away the solution',
  'Explain time and space complexity step by step',
  'Show solution in Java',
  'Show solution in C++',
  'What edge cases must I handle?',
]

export default function QuickChips({ onAsk }: { onAsk: (q: string) => void }) {
  return (
    <div style={{
      padding: '7px 14px 0', display: 'flex', gap: 5, flexWrap: 'wrap',
      background: 'var(--surface)', flexShrink: 0,
    }}>
      {CHIPS.map((text) => (
        <button
          key={text}
          onClick={() => onAsk(text)}
          style={{
            fontSize: 10, padding: '4px 9px', borderRadius: 20,
            border: '1px solid var(--border2)', background: 'transparent',
            color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--sans)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--border2)'
            e.currentTarget.style.color = 'var(--muted)'
          }}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
