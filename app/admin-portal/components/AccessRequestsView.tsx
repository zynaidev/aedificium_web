'use client'

import { useEffect, useState } from 'react'

type AccessRequest = {
  id: number
  name: string
  email: string
  studio: string
  location: string | null
  project_type: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

function badgeClass(status: string) {
  if (status === 'approved') return 'ok'
  if (status === 'rejected') return 'alert'
  return 'neutral'
}

export default function AccessRequestsView() {
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  async function fetchRequests() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/access-requests')
      if (!res.ok) throw new Error('Failed to load')
      setRequests(await res.json())
    } catch {
      setError('Failed to load access requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function updateStatus(id: number, status: 'approved' | 'rejected') {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/access-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error('Update failed')
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
    } catch {
      setError('Failed to update request status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <div className="os-eyebrow">Onboarding Queue</div>
      <h1 className="os-page-title">Access Requests</h1>

      {error && (
        <p style={{ color: 'var(--os-danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      {loading ? (
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="os-row" style={{ gridTemplateColumns: '1fr' }}>
              <div className="os-sk" style={{ height: '1.2rem', width: '40%', marginBottom: '.75rem' }} />
              <div className="os-sk" style={{ height: '.8rem', width: '60%' }} />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p style={{ color: 'var(--os-mid-gray)', fontSize: '.85rem' }}>No access requests yet.</p>
      ) : (
        <div>
          {requests.map((r) => (
            <div
              key={r.id}
              className="os-row"
              style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}
            >
              <div>
                <div className="os-row-title">{r.name}</div>
                <div className="os-row-sub" style={{ marginBottom: '.5rem' }}>
                  {r.email} · {r.studio}
                </div>
                <div style={{ fontSize: '.75rem', color: 'var(--os-warm-gray)', marginBottom: '.5rem' }}>
                  {r.project_type}
                  {r.location ? ` · ${r.location}` : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`os-badge ${badgeClass(r.status)}`}>{r.status}</span>
                  <span style={{ fontSize: '.65rem', color: 'var(--os-mid-gray)' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '.75rem', flexShrink: 0 }}>
                <button
                  className="os-btn-primary"
                  disabled={updatingId === r.id || r.status === 'approved'}
                  onClick={() => updateStatus(r.id, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="os-btn-link"
                  disabled={updatingId === r.id || r.status === 'rejected'}
                  onClick={() => updateStatus(r.id, 'rejected')}
                  style={{ color: 'var(--os-danger)', textDecorationColor: 'var(--os-danger)' }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
