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
      <div className="eyebrow">Onboarding Queue</div>
      <h1 className="title">Access Requests</h1>

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      {loading ? (
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="row" style={{ gridTemplateColumns: '1fr' }}>
              <div className="sk" style={{ height: '1.2rem', width: '40%', marginBottom: '.75rem' }} />
              <div className="sk" style={{ height: '.8rem', width: '60%' }} />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p style={{ color: 'var(--mg)', fontSize: '.85rem' }}>No access requests yet.</p>
      ) : (
        <div>
          {requests.map((r) => (
            <div
              key={r.id}
              className="row"
              style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}
            >
              <div>
                <div className="row-title">{r.name}</div>
                <div className="row-sub" style={{ marginBottom: '.5rem' }}>
                  {r.email} · {r.studio}
                </div>
                <div style={{ fontSize: '.75rem', color: 'var(--wg)', marginBottom: '.5rem' }}>
                  {r.project_type}
                  {r.location ? ` · ${r.location}` : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge ${badgeClass(r.status)}`}>{r.status}</span>
                  <span style={{ fontSize: '.65rem', color: 'var(--mg)' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '.75rem', flexShrink: 0 }}>
                <button
                  className="btn-p"
                  disabled={updatingId === r.id || r.status === 'approved'}
                  onClick={() => updateStatus(r.id, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="btn-l"
                  disabled={updatingId === r.id || r.status === 'rejected'}
                  onClick={() => updateStatus(r.id, 'rejected')}
                  style={{ color: 'var(--danger)', textDecorationColor: 'var(--danger)' }}
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
