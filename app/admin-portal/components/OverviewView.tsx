'use client'

import { useEffect, useState } from 'react'

type Stats = {
  users: number
  projects: number
  openClaims: number
  pendingRequests: number
}

export default function OverviewView() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [usersRes, projectsRes, claimsRes, requestsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/projects'),
          fetch('/api/admin/claims'),
          fetch('/api/access-requests'),
        ])

        if (!usersRes.ok || !projectsRes.ok || !claimsRes.ok || !requestsRes.ok) {
          throw new Error('Failed to load')
        }

        const [users, projects, claims, requests] = await Promise.all([
          usersRes.json(),
          projectsRes.json(),
          claimsRes.json(),
          requestsRes.json(),
        ])

        setStats({
          users: users.length,
          projects: projects.length,
          openClaims: claims.filter((c: { status: string }) => c.status === 'Open').length,
          pendingRequests: requests.filter(
            (r: { status: string }) => r.status === 'pending'
          ).length,
        })
      } catch {
        setError('Failed to load overview stats.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const cards = [
    { label: 'Total Users', value: stats?.users ?? 0, alert: false },
    { label: 'Total Projects', value: stats?.projects ?? 0, alert: false },
    { label: 'Open Claims', value: stats?.openClaims ?? 0, alert: (stats?.openClaims ?? 0) > 0 },
    {
      label: 'Pending Access Requests',
      value: stats?.pendingRequests ?? 0,
      alert: (stats?.pendingRequests ?? 0) > 0,
    },
  ]

  return (
    <div>
      <div className="os-eyebrow">Admin Intelligence</div>
      <h1 className="os-page-title">Overview</h1>

      {error && (
        <p style={{ color: 'var(--os-danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'rgba(185,139,54,.12)',
          border: '1px solid rgba(185,139,54,.12)',
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{ background: 'var(--os-bg-raised)', padding: '2rem', textAlign: 'center' }}
          >
            {loading ? (
              <div
                className="os-sk"
                style={{ height: '2.5rem', width: '3rem', margin: '0 auto .5rem' }}
              />
            ) : (
              <div
                style={{
                  fontFamily: 'var(--os-fd)',
                  fontSize: '3rem',
                  fontWeight: 300,
                  color: c.alert ? 'var(--os-danger)' : 'var(--os-white)',
                  lineHeight: 1,
                  marginBottom: '.5rem',
                }}
              >
                {c.value}
              </div>
            )}
            <div
              style={{
                fontSize: '.6rem',
                color: 'var(--os-warm-gray)',
                textTransform: 'uppercase',
                letterSpacing: '.12em',
              }}
            >
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
