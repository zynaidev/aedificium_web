'use client'

import { useEffect, useState } from 'react'

type User = {
  id: string
  name: string
  email: string
  role: 'designer' | 'logistics' | 'admin' | string
  studio_name: string | null
  is_active: boolean
  createdAt: string
}

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'designer',
  studio_name: '',
}

function UserSection({
  title,
  users,
  loading,
  emptyLabel,
  updatingId,
  onToggle,
}: {
  title: string
  users: User[]
  loading: boolean
  emptyLabel: string
  updatingId: string | null
  onToggle: (id: string, is_active: boolean) => void
}) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <div
        style={{
          fontFamily: 'var(--fd)',
          fontSize: '1.3rem',
          color: 'var(--white)',
          marginBottom: '1.5rem',
        }}
      >
        {title}
      </div>
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
      ) : users.length === 0 ? (
        <p style={{ color: 'var(--mg)', fontSize: '.85rem' }}>{emptyLabel}</p>
      ) : (
        <div>
          {users.map((u) => (
            <div
              key={u.id}
              className="row"
              style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}
            >
              <div>
                <div className="row-title">{u.name}</div>
                <div className="row-sub" style={{ marginBottom: '.5rem' }}>
                  {u.email}
                  {u.studio_name ? ` · ${u.studio_name}` : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge ${u.is_active ? 'ok' : 'alert'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span style={{ fontSize: '.65rem', color: 'var(--mg)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                className={u.is_active ? 'btn-l' : 'btn-p'}
                disabled={updatingId === u.id}
                onClick={() => onToggle(u.id, !u.is_active)}
                style={
                  u.is_active
                    ? { color: 'var(--danger)', textDecorationColor: 'var(--danger)' }
                    : undefined
                }
              >
                {u.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function UsersView() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  async function fetchUsers() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Failed to load')
      setUsers(await res.json())
    } catch {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function toggleActive(id: string, is_active: boolean) {
    setUpdatingId(id)
    setError('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active }),
      })
      if (!res.ok) throw new Error('Update failed')
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_active } : u))
      )
    } catch {
      setError('Failed to update user status.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create user')
      }
      setForm(EMPTY_FORM)
      setSuccess('User created successfully.')
      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user.')
    } finally {
      setBusy(false)
    }
  }

  const designers = users.filter((u) => u.role === 'designer')
  const logistics = users.filter((u) => u.role === 'logistics')

  return (
    <div>
      <div className="eyebrow">User Management</div>
      <h1 className="title">Users</h1>

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
          Create New User
        </div>
        <form onSubmit={handleSubmit}>
          <label className="lbl">Name</label>
          <input
            className="inp"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <label className="lbl">Email</label>
          <input
            className="inp"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <label className="lbl">Password</label>
          <input
            className="inp"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
          <label className="lbl">Role</label>
          <select
            className="inp"
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            required
          >
            <option value="designer">Designer</option>
            <option value="logistics">Logistics</option>
          </select>
          <label className="lbl">Studio Name (optional)</label>
          <input
            className="inp"
            value={form.studio_name}
            onChange={(e) => setForm((p) => ({ ...p, studio_name: e.target.value }))}
          />
          <button type="submit" className="btn-p" disabled={busy}>
            {busy ? 'Creating...' : 'Create User'}
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

      <UserSection
        title="Designers"
        users={designers}
        loading={loading}
        emptyLabel="No designers yet."
        updatingId={updatingId}
        onToggle={toggleActive}
      />
      <UserSection
        title="Logistics"
        users={logistics}
        loading={loading}
        emptyLabel="No logistics users yet."
        updatingId={updatingId}
        onToggle={toggleActive}
      />
    </div>
  )
}
