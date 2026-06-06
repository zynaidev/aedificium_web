'use client'

import { useEffect, useState } from 'react'

type Shipment = {
  id: string
  project_id: string
  shipment_ref: string
  status: string
  destination_type: string | null
  destination_address: string | null
  target_date: string | null
}

type Project = {
  id: string
  name: string
  ref_number: string
  status: string
  eta_date: string | null
  studio_name: string | null
  architect_name: string
  architect_email: string
  created_at: string
  shipments: Shipment[]
}

type Designer = {
  id: string
  name: string
  email: string
  role: string
  is_active: boolean
}

const EMPTY_FORM = {
  name: '',
  architect_id: '',
  studio_name: '',
  eta_date: '',
}

function statusBadgeClass(status: string) {
  if (status === 'active') return 'ok'
  if (status === 'on_hold') return 'neutral'
  if (status === 'cancelled') return 'alert'
  return ''
}

export default function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([])
  const [designers, setDesigners] = useState<Designer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  async function fetchData() {
    setLoading(true)
    setError('')
    try {
      const [projectsRes, usersRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/users'),
      ])
      if (!projectsRes.ok || !usersRes.ok) throw new Error('Failed to load')
      const projectsData = await projectsRes.json()
      const usersData = await usersRes.json()
      setProjects(projectsData)
      setDesigners(
        usersData.filter((u: Designer) => u.role === 'designer' && u.is_active !== false)
      )
    } catch {
      setError('Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create project')
      }
      setForm(EMPTY_FORM)
      setSuccess('Project created successfully.')
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="eyebrow">Project Management</div>
      <h1 className="title">Projects</h1>

      <div
        style={{
          border: '1px solid var(--border)',
          padding: '2rem',
          marginBottom: '3rem',
          background: 'rgba(17,16,9,.3)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--fd)',
            fontSize: '1.2rem',
            color: 'var(--white)',
            marginBottom: '1.5rem',
          }}
        >
          Create New Project
        </div>
        <form onSubmit={handleSubmit}>
          <label className="lbl">Project Name</label>
          <input
            className="inp"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <label className="lbl">Architect</label>
          <select
            className="inp"
            value={form.architect_id}
            onChange={(e) =>
              setForm((p) => ({ ...p, architect_id: e.target.value }))
            }
            required
          >
            <option value="" disabled>
              Select architect
            </option>
            {designers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.email})
              </option>
            ))}
          </select>
          <label className="lbl">Studio Name</label>
          <input
            className="inp"
            value={form.studio_name}
            onChange={(e) =>
              setForm((p) => ({ ...p, studio_name: e.target.value }))
            }
          />
          <label className="lbl">ETA Date</label>
          <input
            type="date"
            className="inp"
            style={{ colorScheme: 'dark' }}
            value={form.eta_date}
            onChange={(e) => setForm((p) => ({ ...p, eta_date: e.target.value }))}
          />
          <button type="submit" className="btn-p" disabled={busy}>
            {busy ? 'Creating...' : 'Create Project'}
          </button>
        </form>
        {success && (
          <p style={{ color: 'var(--ok)', fontSize: '.85rem', marginTop: '1rem' }}>
            {success}
          </p>
        )}
      </div>

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
      ) : projects.length === 0 ? (
        <p style={{ color: 'var(--mg)', fontSize: '.85rem' }}>No projects yet.</p>
      ) : (
        <div>
          {projects.map((p) => (
            <div
              key={p.id}
              className="row"
              style={{
                gridTemplateColumns: '1fr',
                border: '1px solid var(--border)',
                padding: '1.5rem',
                marginBottom: '1rem',
                background: 'rgba(17,16,9,.3)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div className="row-title">{p.name}</div>
                  <div className="row-sub" style={{ marginBottom: '.5rem' }}>
                    {p.ref_number}
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--wg)', marginBottom: '.5rem' }}>
                    {p.architect_name} · {p.architect_email}
                    {p.studio_name ? ` · ${p.studio_name}` : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${statusBadgeClass(p.status)}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                    {p.eta_date && (
                      <span style={{ fontSize: '.65rem', color: 'var(--mg)' }}>
                        ETA {new Date(p.eta_date).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn-l"
                      onClick={() => toggleExpanded(p.id)}
                      style={{ fontSize: '.65rem' }}
                    >
                      {p.shipments.length} shipment{p.shipments.length !== 1 ? 's' : ''}{' '}
                      {expanded.has(p.id) ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
              </div>

              {expanded.has(p.id) && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  {p.shipments.length === 0 ? (
                    <p style={{ color: 'var(--mg)', fontSize: '.75rem' }}>No shipments yet.</p>
                  ) : (
                    p.shipments.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          padding: '.75rem 0',
                          borderBottom: '1px solid var(--border)',
                          fontSize: '.78rem',
                          color: 'var(--bone)',
                        }}
                      >
                        <div style={{ fontFamily: 'var(--fd)', color: 'var(--white)' }}>
                          {s.shipment_ref}
                        </div>
                        <div className="row-sub">
                          {s.status}
                          {s.destination_type ? ` · ${s.destination_type}` : ''}
                          {s.target_date
                            ? ` · ${new Date(s.target_date).toLocaleDateString()}`
                            : ''}
                        </div>
                        {s.destination_address && (
                          <div style={{ fontSize: '.7rem', color: 'var(--mg)', marginTop: '.25rem' }}>
                            {s.destination_address}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
