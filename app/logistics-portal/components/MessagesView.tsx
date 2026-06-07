'use client'

import { useEffect, useRef, useState } from 'react'
import type { Shipment } from '../page'

type Msg = {
  id: string
  sender_name: string
  sender_role: string
  message_body: string
  created_at: string
  read_at: string | null
}

export default function MessagesView() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [unreadIds, setUnreadIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Shipment | null>(null)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [msgsLoading, setMsgsLoading] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/admin/shipments')
        if (!res.ok) throw new Error('Failed to load')
        const data: Shipment[] = await res.json()
        setShipments(data)

        const unread = new Set<string>()
        await Promise.all(
          data.map(async (s) => {
            const mr = await fetch(`/api/messages?shipment_id=${s.id}`)
            if (!mr.ok) return
            const messages: Msg[] = await mr.json()
            if (
              messages.some((m) => m.read_at === null && m.sender_role === 'designer')
            ) {
              unread.add(s.id)
            }
          })
        )
        setUnreadIds(unread)
      } catch {
        setError('Failed to load messages.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!selected) return
    async function loadMsgs() {
      setMsgsLoading(true)
      const res = await fetch(`/api/messages?shipment_id=${selected!.id}`)
      if (res.ok) {
        setMsgs(await res.json())
        setUnreadIds((prev) => {
          const next = new Set(prev)
          next.delete(selected!.id)
          return next
        })
      }
      setMsgsLoading(false)
    }
    loadMsgs()
  }, [selected])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !text.trim() || sending) return
    setSending(true)
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipment_id: selected.id,
        message_body: text,
      }),
    })
    if (res.ok) {
      const msg = await res.json()
      setMsgs((p) => [...p, msg])
      setText('')
    }
    setSending(false)
  }

  return (
    <div>
      <div className="os-eyebrow">Communications</div>
      <h1 className="os-page-title">Messages</h1>

      {error && (
        <p style={{ color: 'var(--os-danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '2rem' }}>
        <div>
          <div className="os-row-sub" style={{ marginBottom: '1rem' }}>
            Shipment Threads
          </div>

          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                style={{ padding: '1.25rem', marginBottom: '0.75rem', border: '1px solid var(--os-border)' }}
              >
                <div className="os-sk" style={{ height: '1rem', width: '70%' }} />
              </div>
            ))
          ) : shipments.length === 0 ? (
            <p style={{ color: 'var(--os-mid-gray)', fontSize: '.875rem' }}>No shipment threads yet.</p>
          ) : (
            shipments.map((s) => (
              <div
                key={s.id}
                className="os-card"
                style={{
                  padding: '1.25rem',
                  marginBottom: '0.75rem',
                  cursor: 'pointer',
                  borderColor: selected?.id === s.id ? 'var(--os-border-gold)' : 'var(--os-border)',
                }}
                onClick={() => setSelected(s)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  {unreadIds.has(s.id) && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--os-accent)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div>
                    <div className="os-row-title">{s.shipment_ref}</div>
                    <div className="os-row-sub" style={{ marginTop: '.25rem' }}>
                      {s.project_name} · {s.architect_name}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            border: '1px solid var(--os-border)',
            background: 'rgba(17,16,9,.4)',
            minHeight: '420px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {!selected ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--os-mid-gray)',
                fontSize: '.875rem',
              }}
            >
              Select a shipment to view messages.
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: '1.5rem 2rem',
                  borderBottom: '1px solid var(--os-border)',
                }}
              >
                <div style={{ fontFamily: 'var(--os-fd)', fontSize: '1.2rem', color: 'var(--os-white)' }}>
                  {selected.shipment_ref}
                </div>
                <div className="os-row-sub" style={{ marginTop: '.35rem' }}>
                  {selected.project_name} · {selected.architect_name}
                </div>
              </div>
              <div style={{ flex: 1, padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
                <div className="os-chat" style={{ height: 'auto', flex: 1, marginTop: 0 }}>
                  <div className="os-chat-msgs" style={{ minHeight: '280px' }}>
                    {msgsLoading ? (
                      <div
                        style={{
                          color: 'var(--os-mid-gray)',
                          fontSize: '.75rem',
                          textAlign: 'center',
                          marginTop: '2rem',
                        }}
                      >
                        Loading messages...
                      </div>
                    ) : msgs.length === 0 ? (
                      <div
                        style={{
                          color: 'var(--os-mid-gray)',
                          fontSize: '.75rem',
                          textAlign: 'center',
                          marginTop: '2rem',
                        }}
                      >
                        No messages yet.
                      </div>
                    ) : (
                      msgs.map((m) => (
                        <div
                          key={m.id}
                          className={`os-msg ${m.sender_role === 'logistics' ? 'os-msg-me' : 'os-msg-other'}`}
                        >
                          <div>{m.message_body}</div>
                          <div className="os-msg-meta">
                            {m.sender_name} ·{' '}
                            {new Date(m.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={endRef} />
                  </div>
                  <form className="os-chat-form" onSubmit={send}>
                    <input
                      className="os-chat-input"
                      placeholder="Message architect..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                    />
                    <button type="submit" className="os-chat-send" disabled={sending}>
                      {sending ? '...' : 'Send'}
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
