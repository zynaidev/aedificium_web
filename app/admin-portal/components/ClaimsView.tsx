'use client'

import { useEffect, useState } from 'react'

type Claim = {
  id: string
  item_name: string
  issue_type: string
  status: string
  file_url: string | null
  created_at: string
  architect_name: string
  architect_email: string
  project_name: string | null
}

const STATUS_OPTIONS = [
  'Open',
  'Under Investigation',
  'Awaiting Parts',
  'Resolved',
  'Closed',
]

function badgeClass(status: string) {
  if (status === 'Open') return 'alert'
  if (status === 'Resolved' || status === 'Closed') return 'ok'
  return 'neutral'
}

export default function ClaimsView() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function fetchClaims() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/claims')
      if (!res.ok) throw new Error('Failed to load')
      setClaims(await res.json())
    } catch {
      setError('Failed to load claims.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [])

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id)
    setError('')
    try {
      const res = await fetch('/api/admin/claims', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error('Update failed')
      setClaims((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      )
    } catch {
      setError('Failed to update claim status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <style>{`
        .row{display:grid;align-items:center;gap:1.5rem;padding:1.5rem 0;border-bottom:1px solid var(--border)}
        .row-title{font-family:var(--fd);font-size:1.1rem;color:var(--white);margin-bottom:.2rem}
        .row-sub{font-size:.62rem;color:var(--wg);text-transform:uppercase;letter-spacing:.06em}
        .sk{background:linear-gradient(90deg,var(--bg-s) 25%,rgba(255,255,255,.04) 50%,var(--bg-s) 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:2px}
        @keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
      `}</style>

      <div className="eyebrow">Resolution Center</div>
      <h1 className="title">Claims</h1>

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      {loading ? (
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="row" style={{ gridTemplateColumns: '1fr' }}>
              <div
                className="sk"
                style={{ height: '1.2rem', width: '40%', marginBottom: '.75rem' }}
              />
              <div className="sk" style={{ height: '.8rem', width: '60%' }} />
            </div>
          ))}
        </div>
      ) : claims.length === 0 ? (
        <p style={{ color: 'var(--mg)', fontSize: '.85rem' }}>No claims filed yet.</p>
      ) : (
        <div>
          {claims.map((c) => (
            <div
              key={c.id}
              className="row"
              style={{
                gridTemplateColumns: '2fr 1.2fr 1fr auto',
                alignItems: 'center',
              }}
            >
              <div>
                <div className="row-title">{c.item_name}</div>
                <div className="row-sub" style={{ marginBottom: '.35rem' }}>
                  {c.issue_type}
                </div>
                <div style={{ fontSize: '.75rem', color: 'var(--wg)', marginBottom: '.35rem' }}>
                  {c.architect_name} · {c.architect_email}
                </div>
                <div style={{ fontSize: '.7rem', color: 'var(--mg)' }}>
                  Project: {c.project_name ?? '—'}
                </div>
                <div style={{ fontSize: '.65rem', color: 'var(--mg)', marginTop: '.35rem' }}>
                  Filed {new Date(c.created_at).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                <span className={`badge ${badgeClass(c.status)}`}>{c.status}</span>
                <select
                  className="inp"
                  style={{ marginBottom: 0, fontSize: '.72rem', padding: '.4rem 0' }}
                  value={c.status}
                  disabled={updatingId === c.id}
                  onChange={(e) => updateStatus(c.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                {c.file_url ? (
                  <button
                    type="button"
                    className="btn-l"
                    style={{ fontSize: '.65rem' }}
                    onClick={() => window.open(c.file_url!, '_blank')}
                  >
                    View Evidence ↗
                  </button>
                ) : (
                  <span style={{ fontSize: '.65rem', color: 'var(--mg)' }}>—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
