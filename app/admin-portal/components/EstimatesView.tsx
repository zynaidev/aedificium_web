'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from '@/lib/auth-client'

type QuoteItem = {
  id: string
  brand: string
  item_description: string
  quantity: number
  rrp_eur: number
  discount_percent?: number
  unit_price_eur: number
  lead_time_weeks: number | null
}

type Estimate = {
  id: string
  project_name: string
  status: string
  file_url: string | null
  invoice_url: string | null
  total_value_eur: number | null
  created_at: string
  architect_name: string
  architect_email: string
  quote_items: QuoteItem[]
}

type EditableRow = {
  key: string
  brand: string
  item_description: string
  quantity: number
  rrp_eur: number
  discount_percent: number
  unit_price_eur: number
  lead_time_weeks: number | null
}

const INPUT_STYLE: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--os-border)',
  color: 'var(--os-bone)',
  padding: '0.6rem',
  fontFamily: 'var(--os-fu)',
  fontSize: '0.82rem',
  width: '100%',
}

const GRID_COLS = '1.2fr 2fr 0.5fr 0.8fr 0.7fr 0.9fr 0.7fr 2rem'

function badgeClass(status: string) {
  if (status === 'Action Required: Review Quote') return 'alert'
  if (status === 'Approved' || status === 'Invoice Issued') return 'ok'
  if (status === 'Submitted: Under Review' || status === 'Closed') return 'neutral'
  return ''
}

function calcTrade(rrp: number, discount: number) {
  return rrp - (rrp * discount) / 100
}

function fmt(n: number) {
  return n.toLocaleString('en-EU', { minimumFractionDigits: 2 })
}

function toEditableRow(item: QuoteItem): EditableRow {
  return {
    key: item.id,
    brand: item.brand,
    item_description: item.item_description,
    quantity: item.quantity,
    rrp_eur: item.rrp_eur,
    discount_percent: item.discount_percent ?? 0,
    unit_price_eur: item.unit_price_eur,
    lead_time_weeks: item.lead_time_weeks,
  }
}

function emptyRow(): EditableRow {
  return {
    key: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    brand: '',
    item_description: '',
    quantity: 1,
    rrp_eur: 0,
    discount_percent: 0,
    unit_price_eur: 0,
    lead_time_weeks: null,
  }
}

function calcTotal(rows: EditableRow[]) {
  return rows.reduce((sum, r) => sum + r.unit_price_eur * r.quantity, 0)
}

function SmartLedgerEditor({
  estimate,
  onClose,
  onRefresh,
}: {
  estimate: Estimate
  onClose: () => void
  onRefresh: () => Promise<Estimate[]>
}) {
  const { data: session } = useSession()
  const [status, setStatus] = useState(estimate.status)
  const [rows, setRows] = useState<EditableRow[]>(
    (estimate.quote_items ?? []).map(toEditableRow)
  )
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [attaching, setAttaching] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    setStatus(estimate.status)
    setRows((estimate.quote_items ?? []).map(toEditableRow))
  }, [estimate])

  const totalValue = useMemo(() => calcTotal(rows), [rows])

  function updateRow(key: string, patch: Partial<EditableRow>) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.key !== key) return r
        const next = { ...r, ...patch }
        if ('rrp_eur' in patch || 'discount_percent' in patch) {
          next.unit_price_eur = calcTrade(next.rrp_eur, next.discount_percent)
        }
        return next
      })
    )
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((r) => r.key !== key))
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()])
  }

  async function saveDraft() {
    const toSave = rows.filter((r) => r.item_description.trim())
    const delRes = await fetch('/api/admin/quote-items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estimate_id: estimate.id }),
    })
    if (!delRes.ok) throw new Error('Failed to clear items')

    for (const row of toSave) {
      const res = await fetch('/api/admin/quote-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimate_id: estimate.id,
          brand: row.brand,
          item_description: row.item_description,
          quantity: row.quantity,
          rrp_eur: row.rrp_eur,
          discount_percent: row.discount_percent,
          unit_price_eur: row.unit_price_eur,
          lead_time_weeks: row.lead_time_weeks,
        }),
      })
      if (!res.ok) throw new Error('Failed to save item')
    }

    const patchRes = await fetch('/api/admin/estimates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: estimate.id, total_value_eur: totalValue }),
    })
    if (!patchRes.ok) throw new Error('Failed to update total')
  }

  async function handleSaveDraft() {
    setSaving(true)
    setErr('')
    try {
      await saveDraft()
      await onRefresh()
    } catch {
      setErr('Failed to save draft.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSendToArchitect() {
    setSending(true)
    setErr('')
    try {
      await saveDraft()
      const res = await fetch('/api/admin/estimates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: estimate.id,
          status: 'Action Required: Review Quote',
        }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('Action Required: Review Quote')
      await onRefresh()
    } catch {
      setErr('Failed to send to architect.')
    } finally {
      setSending(false)
    }
  }

  async function handleAttachInvoice() {
    if (!invoiceFile || !session?.user?.id) return
    setAttaching(true)
    setErr('')
    try {
      const uploadFd = new FormData()
      uploadFd.append('file', invoiceFile)
      uploadFd.append('type', 'invoice')
      uploadFd.append('userId', session.user.id)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadFd })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const { url } = await uploadRes.json()

      const res = await fetch('/api/admin/estimates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: estimate.id,
          invoice_url: url,
          status: 'Invoice Issued',
        }),
      })
      if (!res.ok) throw new Error('Failed to attach invoice')
      setStatus('Invoice Issued')
      setInvoiceFile(null)
      await onRefresh()
    } catch {
      setErr('Failed to attach invoice.')
    } finally {
      setAttaching(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--os-bg)',
        zIndex: 200,
        overflowY: 'auto',
        padding: '4rem 5rem',
      }}
    >
      <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto' }}>
        <button
          type="button"
          onClick={onClose}
          className="os-panel-close"
          style={{ position: 'absolute', top: 0, right: 0, fontSize: '1.6rem' }}
        >
          ×
        </button>

        <div className="os-eyebrow" style={{ marginBottom: '0.5rem' }}>
          Status: {status}
        </div>
        <h2
          style={{
            fontFamily: 'var(--os-fd)',
            fontSize: '3rem',
            fontWeight: 300,
            color: 'var(--os-white)',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
          }}
        >
          {estimate.project_name}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--os-warm-gray)', marginBottom: '3rem' }}>
          {estimate.architect_name} · {estimate.architect_email}
        </p>

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
          {/* Left — line items */}
          <div style={{ flex: 3, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.62rem',
                color: 'var(--os-accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              Itemized Specification
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: GRID_COLS,
                gap: '0.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(185,139,54,0.25)',
                marginBottom: '0.5rem',
              }}
            >
              {[
                'Brand',
                'Description',
                'Qty',
                'RRP (€)',
                'Disc. (%)',
                'Trade Price (€)',
                'Lead Time',
                '',
              ].map((h) => (
                <div
                  key={h}
                  style={{
                    fontSize: '0.58rem',
                    color: 'var(--os-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {rows.map((row) => (
              <div
                key={row.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: GRID_COLS,
                  gap: '0.5rem',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--os-border)',
                  alignItems: 'center',
                }}
              >
                <input
                  style={INPUT_STYLE}
                  value={row.brand}
                  onChange={(e) => updateRow(row.key, { brand: e.target.value })}
                />
                <input
                  style={INPUT_STYLE}
                  value={row.item_description}
                  onChange={(e) => updateRow(row.key, { item_description: e.target.value })}
                />
                <input
                  style={INPUT_STYLE}
                  type="number"
                  min="1"
                  value={row.quantity}
                  onChange={(e) =>
                    updateRow(row.key, { quantity: Number(e.target.value) || 1 })
                  }
                />
                <input
                  style={INPUT_STYLE}
                  type="number"
                  step="0.01"
                  min="0"
                  value={row.rrp_eur || ''}
                  onChange={(e) =>
                    updateRow(row.key, { rrp_eur: Number(e.target.value) || 0 })
                  }
                />
                <input
                  style={INPUT_STYLE}
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={row.discount_percent}
                  onChange={(e) =>
                    updateRow(row.key, { discount_percent: Number(e.target.value) || 0 })
                  }
                />
                <input
                  style={{ ...INPUT_STYLE, color: 'var(--os-accent)' }}
                  readOnly
                  value={fmt(row.unit_price_eur)}
                />
                <input
                  style={INPUT_STYLE}
                  type="number"
                  min="0"
                  placeholder="wks"
                  value={row.lead_time_weeks ?? ''}
                  onChange={(e) =>
                    updateRow(row.key, {
                      lead_time_weeks: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => removeRow(row.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--os-danger)',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '1rem',
                background: 'transparent',
                border: '1px dashed var(--os-accent)',
                color: 'var(--os-accent)',
                fontFamily: 'var(--os-fu)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              + Add Line Item
            </button>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '2rem',
                fontFamily: 'var(--os-fd)',
                fontSize: '2rem',
                color: 'var(--os-white)',
              }}
            >
              Total Trade Value: €{fmt(totalValue)}
            </div>
          </div>

          {/* Right — action panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                border: '1px solid var(--os-border)',
                background: 'rgba(17,16,9,0.4)',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--os-fd)',
                  fontSize: '1.1rem',
                  color: 'var(--os-white)',
                  marginBottom: '1rem',
                }}
              >
                Architect&apos;s Upload
              </div>
              {estimate.file_url ? (
                <button
                  type="button"
                  className="os-btn-ghost"
                  style={{ width: '100%' }}
                  onClick={() => window.open(estimate.file_url!, '_blank')}
                >
                  View Original BOQ File
                </button>
              ) : (
                <p style={{ fontSize: '0.75rem', color: 'var(--os-mid-gray)' }}>No BOQ file attached.</p>
              )}
            </div>

            <div
              style={{
                border: '1px solid var(--os-border)',
                background: 'rgba(17,16,9,0.4)',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--os-fd)',
                  fontSize: '1.1rem',
                  color: 'var(--os-white)',
                  marginBottom: '1rem',
                }}
              >
                Quote Actions
              </div>
              <button
                type="button"
                className="os-btn-primary"
                style={{ width: '100%', marginBottom: '0.75rem' }}
                disabled={saving || sending || attaching}
                onClick={handleSaveDraft}
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="button"
                className="os-btn-primary"
                style={{ width: '100%' }}
                disabled={saving || sending || attaching}
                onClick={handleSendToArchitect}
              >
                {sending ? 'Sending...' : 'Send to Architect for Approval'}
              </button>
            </div>

            {status === 'Approved' && (
              <div
                style={{
                  border: '1px solid var(--os-border)',
                  background: 'rgba(17,16,9,0.4)',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--os-fd)',
                    fontSize: '1.1rem',
                    color: 'var(--os-white)',
                    marginBottom: '1rem',
                  }}
                >
                  Upload Invoice
                </div>
                <label
                  style={{
                    display: 'block',
                    padding: '2rem 1rem',
                    border: '1px dashed rgba(230,226,216,0.2)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    fontSize: '0.75rem',
                    color: 'var(--os-warm-gray)',
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setInvoiceFile(e.target.files?.[0] ?? null)}
                  />
                  {invoiceFile ? invoiceFile.name : 'Drop PDF invoice here or click to browse'}
                </label>
                <button
                  type="button"
                  className="os-btn-primary"
                  style={{ width: '100%' }}
                  disabled={!invoiceFile || attaching || saving || sending}
                  onClick={handleAttachInvoice}
                >
                  {attaching ? 'Attaching...' : 'Attach & Notify Architect'}
                </button>
              </div>
            )}

            {err && (
              <p style={{ color: 'var(--os-danger)', fontSize: '0.85rem' }}>{err}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EstimatesView() {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Estimate | null>(null)

  async function fetchEstimates(): Promise<Estimate[]> {
    const res = await fetch('/api/admin/estimates')
    if (!res.ok) throw new Error('Failed to load')
    const data = await res.json()
    setEstimates(data)
    if (selected) {
      const updated = data.find((e: Estimate) => e.id === selected.id)
      if (updated) setSelected(updated)
    }
    return data
  }

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchEstimates()
      .catch(() => setError('Failed to load estimates.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="os-eyebrow">Quote-to-Cash</div>
      <h1 className="os-page-title">Smart Ledger</h1>

      {error && (
        <p style={{ color: 'var(--os-danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto',
          gap: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--os-border)',
          marginBottom: '0.5rem',
        }}
      >
        {['Project Name', 'Architect', 'Date Submitted', 'Status', ''].map((h) => (
          <div key={h} className="os-row-sub">
            {h}
          </div>
        ))}
      </div>

      {loading ? (
        [1, 2, 3].map((i) => (
          <div
            key={i}
            className="os-row"
            style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto' }}
          >
            <div className="os-sk" style={{ height: '1rem', width: '60%' }} />
            <div className="os-sk" style={{ height: '1rem', width: '70%' }} />
            <div className="os-sk" style={{ height: '1rem', width: '40%' }} />
            <div className="os-sk" style={{ height: '1.2rem', width: '50%' }} />
            <div className="os-sk" style={{ height: '1rem', width: '30%' }} />
          </div>
        ))
      ) : estimates.length === 0 ? (
        <p style={{ color: 'var(--os-mid-gray)', fontSize: '.85rem' }}>No estimates yet.</p>
      ) : (
        estimates.map((e) => (
          <div
            key={e.id}
            className="os-row"
            style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto', alignItems: 'center' }}
          >
            <div className="os-row-title">{e.project_name}</div>
            <div className="os-row-sub">
              {e.architect_name} · {e.architect_email}
            </div>
            <div style={{ fontSize: '.78rem', color: 'var(--os-warm-gray)' }}>
              {new Date(e.created_at).toLocaleDateString()}
            </div>
            <span className={`os-badge ${badgeClass(e.status)}`}>{e.status}</span>
            <button type="button" className="os-btn-link" onClick={() => setSelected(e)}>
              Open Ledger
            </button>
          </div>
        ))
      )}

      {selected && (
        <SmartLedgerEditor
          estimate={selected}
          onClose={() => setSelected(null)}
          onRefresh={fetchEstimates}
        />
      )}
    </div>
  )
}
