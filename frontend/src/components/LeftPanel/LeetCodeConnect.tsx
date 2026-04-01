import React, { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import {
  connectLeetCode,
  disconnectLeetCode,
  getLeetCodeStatus,
  getLeetCodeProgress,
  browserLoginLeetCode,
} from '../../api/leetcode'

const s: Record<string, React.CSSProperties> = {
  wrap: { padding: 13, borderBottom: '1px solid var(--border)' },
  label: {
    fontSize: 9, letterSpacing: 1, color: 'var(--muted)',
    textTransform: 'uppercase', marginBottom: 9, fontFamily: 'var(--mono)',
  },
  input: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border2)',
    borderRadius: 7, color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 10,
    padding: '7px 10px', outline: 'none', marginBottom: 6,
  },
  btn: {
    width: '100%', borderRadius: 7, fontSize: 10, fontFamily: 'var(--mono)',
    padding: '7px 0', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
  },
  connectBtn: {
    background: 'rgba(0,212,170,.12)', borderColor: 'rgba(0,212,170,.4)',
    color: 'var(--accent2)',
  },
  disconnectBtn: {
    background: 'rgba(255,107,107,.08)', borderColor: 'rgba(255,107,107,.3)',
    color: 'var(--accent3)',
  },
  profile: {
    background: 'rgba(0,212,170,.06)', border: '1px solid rgba(0,212,170,.2)',
    borderRadius: 8, padding: '10px 11px', marginBottom: 8,
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(0,212,170,.4)',
    marginRight: 8,
  },
  progressBar: {
    height: 6, borderRadius: 3, background: 'var(--surface2)', overflow: 'hidden', marginTop: 4,
  },
  helpText: {
    fontSize: 9, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8,
    background: 'rgba(108,99,255,.06)', border: '1px solid rgba(108,99,255,.15)',
    borderRadius: 6, padding: '8px 10px',
  },
  helpLink: { color: 'var(--accent)', textDecoration: 'none' },
  error: {
    fontSize: 10, color: 'var(--accent3)', marginTop: 6,
    background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.2)',
    borderRadius: 6, padding: '6px 10px',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 8px', borderRadius: 5, fontSize: 9, fontFamily: 'var(--mono)',
  },
}

const diffColors: Record<string, string> = { easy: '#00d4aa', medium: '#ffa94d', hard: '#ff6b6b' }

export default function LeetCodeConnect() {
  const {
    lcConnected, lcUser, lcProgress, lcConnecting,
    setLcConnected, setLcProgress, setLcConnecting,
  } = useAppStore()

  const [sessionCookie, setSessionCookie] = useState('')
  const [csrfToken, setCsrfToken] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [error, setError] = useState('')

  // Check existing connection on mount
  useEffect(() => {
    getLeetCodeStatus()
      .then((res) => {
        if (res.connected) {
          setLcConnected(true, { username: res.username || '', real_name: '', avatar: '', is_premium: false })
          loadProgress()
        }
      })
      .catch(() => {})
  }, [])

  const loadProgress = async () => {
    try {
      const prog = await getLeetCodeProgress()
      setLcProgress(prog)
    } catch {}
  }

  const handleBrowserLogin = async () => {
    setError('')
    setLcConnecting(true)
    try {
      const user = await browserLoginLeetCode()
      setLcConnected(true, {
        username: user.username,
        real_name: user.real_name,
        avatar: user.avatar,
        is_premium: user.is_premium,
      })
      loadProgress()
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Browser login failed. Try again or use manual method.'
      setError(msg)
    } finally {
      setLcConnecting(false)
    }
  }

  const handleConnect = async () => {
    if (!sessionCookie.trim()) return
    setError('')
    setLcConnecting(true)
    try {
      const user = await connectLeetCode(sessionCookie.trim(), csrfToken.trim() || undefined)
      setLcConnected(true, {
        username: user.username,
        real_name: user.real_name,
        avatar: user.avatar,
        is_premium: user.is_premium,
      })
      setShowForm(false)
      setSessionCookie('')
      setCsrfToken('')
      loadProgress()
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Connection failed. Check your session cookie.'
      setError(msg)
    } finally {
      setLcConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectLeetCode()
    } catch {}
    setLcConnected(false)
    setLcProgress(null)
  }

  // ── Connected State ─────────────────────────────────────────────────────
  if (lcConnected && lcUser) {
    return (
      <div style={s.wrap}>
        <div style={s.label}>🔗 LeetCode Account</div>

        <div style={s.profile}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            {lcUser.avatar && <img src={lcUser.avatar} alt="" style={s.avatar} />}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent2)' }}>
                {lcUser.username}
                {lcUser.is_premium && (
                  <span style={{
                    ...s.badge, marginLeft: 6,
                    background: 'rgba(255,169,77,.15)', color: '#ffa94d',
                    border: '1px solid rgba(255,169,77,.3)',
                  }}>★ Premium</span>
                )}
              </div>
              {lcUser.real_name && (
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{lcUser.real_name}</div>
              )}
            </div>
          </div>

          {/* Progress bars */}
          {lcProgress && (
            <div style={{ marginTop: 6 }}>
              {(['easy', 'medium', 'hard'] as const).map((d) => {
                const data = lcProgress[d]
                const pct = data.total > 0 ? (data.solved / data.total) * 100 : 0
                return (
                  <div key={d} style={{ marginBottom: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)' }}>
                      <span style={{ color: diffColors[d], textTransform: 'capitalize' }}>{d}</span>
                      <span style={{ color: 'var(--muted)' }}>{data.solved}/{data.total}</span>
                    </div>
                    <div style={s.progressBar}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        background: diffColors[d],
                        width: `${pct}%`,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
              <div style={{ textAlign: 'center', marginTop: 6, fontSize: 10, fontFamily: 'var(--mono)' }}>
                <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>{lcProgress.all.solved}</span>
                <span style={{ color: 'var(--muted)' }}> / {lcProgress.all.total} solved</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleDisconnect}
          style={{ ...s.btn, ...s.disconnectBtn }}
        >
          ✕ Disconnect
        </button>
      </div>
    )
  }

  // ── Disconnected State ──────────────────────────────────────────────────
  return (
    <div style={s.wrap}>
      <div style={s.label}>🔗 LeetCode Account</div>

      {!lcConnecting ? (
        <>
          <div style={{
            ...s.badge, marginBottom: 8,
            background: 'rgba(108,99,255,.08)', color: 'var(--muted)',
            border: '1px solid rgba(108,99,255,.2)',
          }}>
            ○ Not connected
          </div>

          {/* Primary: Browser Login */}
          <button
            onClick={handleBrowserLogin}
            style={{ ...s.btn, ...s.connectBtn, marginBottom: 6 }}
          >
            🌐 Sign in with Browser
          </button>

          {/* Secondary: Manual cookie entry */}
          {!showManual ? (
            <button
              onClick={() => setShowManual(true)}
              style={{
                ...s.btn,
                background: 'transparent', borderColor: 'var(--border2)',
                color: 'var(--muted)', fontSize: 9,
              }}
            >
              ⚙ Manual cookie entry
            </button>
          ) : (
            <>
              <div style={{ ...s.helpText, marginTop: 6 }}>
                <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: 4 }}>Manual: paste your session cookie</strong>
                DevTools → Application → Cookies → <code style={{ fontFamily: 'var(--mono)', background: 'rgba(255,255,255,.06)', padding: '1px 4px', borderRadius: 3 }}>LEETCODE_SESSION</code>
              </div>

              <input
                style={s.input}
                value={sessionCookie}
                onChange={(e) => setSessionCookie(e.target.value)}
                placeholder="LEETCODE_SESSION cookie"
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              />
              <input
                style={{ ...s.input, marginBottom: 8 }}
                value={csrfToken}
                onChange={(e) => setCsrfToken(e.target.value)}
                placeholder="csrftoken (optional)"
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              />

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={handleConnect}
                  disabled={!sessionCookie.trim()}
                  style={{
                    ...s.btn, ...s.connectBtn, flex: 1,
                    opacity: !sessionCookie.trim() ? 0.4 : 1,
                  }}
                >
                  ✓ Connect
                </button>
                <button
                  onClick={() => { setShowManual(false); setError('') }}
                  style={{
                    ...s.btn, flex: 0.5,
                    background: 'transparent', borderColor: 'var(--border2)',
                    color: 'var(--muted)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {error && <div style={s.error}>⚠️ {error}</div>}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ fontSize: 11, color: 'var(--accent2)', marginBottom: 6, fontFamily: 'var(--mono)' }}>
            ⏳ Browser opened...
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.5 }}>
            Log in to LeetCode in the browser window.<br />
            Cookies will be captured automatically.
          </div>
        </div>
      )}
    </div>
  )
}
