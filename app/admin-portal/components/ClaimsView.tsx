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
      <div className="os-eyebrow">Resolution Center</div>
      <h1 className="os-page-title">Claims</h1>

      {error && (
        <p style={{ color: 'var(--os-danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      {loading ? (
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="os-row" style={{ gridTemplateColumns: '1fr' }}>
              <div
                className="os-sk"
                style={{ height: '1.2rem', width: '40%', marginBottom: '.75rem' }}
              />
              <div className="os-sk" style={{ height: '.8rem', width: '60%' }} />
            </div>
          ))}
        </div>
      ) : claims.length === 0 ? (
        <p style={{ color: 'var(--os-mid-gray)', fontSize: '.85rem' }}>No claims filed yet.</p>
      ) : (
        <div>
          {claims.map((c) => (
            <div
              key={c.id}
              className="os-row"
              style={{
                gridTemplateColumns: '2fr 1.2fr 1fr auto',
                alignItems: 'center',
              }}
            >
              <div>
                <div className="os-row-title">{c.item_name}</div>
                <div className="os-row-sub" style={{ marginBottom: '.35rem' }}>
                  {c.issue_type}
                </div>
                <div style={{ fontSize: '.75rem', color: 'var(--os-warm-gray)', marginBottom: '.35rem' }}>
                  {c.architect_name} · {c.architect_email}
                </div>
                <div style={{ fontSize: '.7rem', color: 'var(--os-mid-gray)' }}>
                  Project: {c.project_name ?? '—'}
                </div>
                <div style={{ fontSize: '.65rem', color: 'var(--os-mid-gray)', marginTop: '.35rem' }}>
                  Filed {new Date(c.created_at).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                <span className={`os-badge ${badgeClass(c.status)}`}>{c.status}</span>
                <select
                  className="os-input"
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
                    className="os-btn-link"
                    style={{ fontSize: '.65rem' }}
                    onClick={() => window.open(c.file_url!, '_blank')}
                  >
                    View Evidence ↗
                  </button>
                ) : (
                  <span style={{ fontSize: '.65rem', color: 'var(--os-mid-gray)' }}>—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
