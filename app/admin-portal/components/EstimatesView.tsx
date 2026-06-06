'use client'

import { useEffect, useMemo, useState } from 'react'

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
  invoice_url: string | null
  total_value_eur: number | null
  created_at: string
  architect_name: string
  architect_email: string
  quote_items: QuoteItem[]
}

const STATUS_OPTIONS = [
  'Action Required: Review Quote',
  'Approved',
  'Invoice Issued',
  'Closed',
]

const EMPTY_ITEM = {
  brand: '',
  item_description: '',
  quantity: '1',
  rrp_eur: '',
  discount_percent: '0',
  lead_time_weeks: '',
}

function badgeClass(s: string) {
  return s === 'Action Required: Review Quote'
    ? 'alert'
    : s === 'Approved' || s === 'Invoice Issued'
      ? 'ok'
      : s === 'Closed'
        ? 'neutral'
        : ''
}

function calcTrade(rrp: number, discount: number) {
  return rrp * (1 - discount / 100)
}

function calcTotal(items: QuoteItem[]) {
  return items.reduce((sum, i) => sum + i.unit_price_eur * i.quantity, 0)
}

function fmt(n: number) {
  return n.toLocaleString('en-EU', { minimumFractionDigits: 2 })
}

function EditPanel({
  estimate,
  onClose,
  onRefresh,
}: {
  estimate: Estimate
  onClose: () => void
  onRefresh: () => Promise<Estimate[]>
}) {
  const [status, setStatus] = useState(estimate.status)
  const [invoiceUrl, setInvoiceUrl] = useState(estimate.invoice_url ?? '')
  const [items, setItems] = useState<QuoteItem[]>(estimate.quote_items ?? [])
  const [itemForm, setItemForm] = useState(EMPTY_ITEM)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    setStatus(estimate.status)
    setInvoiceUrl(estimate.invoice_url ?? '')
    setItems(estimate.quote_items ?? [])
  }, [estimate])

  const tradePreview = useMemo(() => {
    const rrp = parseFloat(itemForm.rrp_eur) || 0
    const discount = parseFloat(itemForm.discount_percent) || 0
    return calcTrade(rrp, discount)
  }, [itemForm.rrp_eur, itemForm.discount_percent])

  const totalValue = useMemo(() => calcTotal(items), [items])

  async function refreshItems() {
    const data = await onRefresh()
    const updated = data.find((e) => e.id === estimate.id)
    if (updated) setItems(updated.quote_items ?? [])
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/quote-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimate_id: estimate.id,
          brand: itemForm.brand,
          item_description: itemForm.item_description,
          quantity: Number(itemForm.quantity),
          rrp_eur: Number(itemForm.rrp_eur),
          discount_percent: Number(itemForm.discount_percent),
          unit_price_eur: tradePreview,
          lead_time_weeks: itemForm.lead_time_weeks
            ? Number(itemForm.lead_time_weeks)
            : null,
        }),
      })
      if (!res.ok) throw new Error('Failed to add item')
      setItemForm(EMPTY_ITEM)
      await refreshItems()
    } catch {
      setErr('Failed to add quote item.')
    } finally {
      setBusy(false)
    }
  }

  async function deleteItem(id: string) {
    setBusy(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/quote-items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Failed to delete')
      await refreshItems()
    } catch {
      setErr('Failed to delete quote item.')
    } finally {
      setBusy(false)
    }
  }

  async function saveStatus() {
    setBusy(true)
    setErr('')
    setMsg('')
    try {
      const res = await fetch('/api/admin/estimates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: estimate.id,
          status,
          total_value_eur: totalValue,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setMsg('Estimate updated.')
      await onRefresh()
    } catch {
      setErr('Failed to update estimate.')
    } finally {
      setBusy(false)
    }
  }

  async function saveInvoiceUrl() {
    setBusy(true)
    setErr('')
    setMsg('')
    try {
      const res = await fetch('/api/admin/estimates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: estimate.id,
          invoice_url: invoiceUrl,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setMsg('Invoice URL saved.')
      await onRefresh()
    } catch {
      setErr('Failed to save invoice URL.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <style>{`
        .overlay{position:fixed;inset:0;background:rgba(10,8,6,.75);backdrop-filter:blur(4px);z-index:100}
        .panel{position:fixed;top:0;right:0;width:640px;max-width:100vw;height:100svh;background:var(--bg-r);border-left:1px solid var(--border-g);z-index:101;display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(0,0,0,.6)}
        .panel-hdr{padding:2rem 2rem 1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;flex-shrink:0}
        .panel-body{flex:1;padding:2rem;overflow-y:auto}
        .panel-close{background:none;border:none;color:var(--wg);font-size:1.4rem;cursor:pointer;line-height:1;padding:0}
        .panel-close:hover{color:var(--accent)}
        .row{display:grid;align-items:center;gap:1.5rem;padding:1.5rem 0;border-bottom:1px solid var(--border)}
        .row-title{font-family:var(--fd);font-size:1.1rem;color:var(--white);margin-bottom:.2rem}
        .row-sub{font-size:.62rem;color:var(--wg);text-transform:uppercase;letter-spacing:.06em}
        .sk{background:linear-gradient(90deg,var(--bg-s) 25%,rgba(255,255,255,.04) 50%,var(--bg-s) 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:2px}
        @keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
      `}</style>
      <div className="overlay" onClick={onClose} />
      <div className="panel">
        <div className="panel-hdr">
          <div>
            <div className="eyebrow" style={{ marginBottom: '.2rem' }}>
              Estimate Editor
            </div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', color: 'var(--white)' }}>
              {estimate.project_name}
            </div>
            <div className="row-sub" style={{ marginTop: '.5rem' }}>
              {estimate.architect_name} · {estimate.architect_email}
            </div>
          </div>
          <button type="button" className="panel-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="panel-body">
          <label className="lbl">Status</label>
          <select
            className="inp"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div
            style={{
              marginBottom: '1.5rem',
              fontSize: '.85rem',
              color: 'var(--bone)',
            }}
          >
            Total trade value:{' '}
            <strong style={{ color: 'var(--white)' }}>€{fmt(totalValue)}</strong>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 2fr .5fr 1fr 1fr .8fr auto',
              gap: '.75rem',
              paddingBottom: '.75rem',
              borderBottom: '1px solid rgba(185,139,54,.25)',
              marginBottom: '.5rem',
            }}
          >
            {['Brand', 'Description', 'Qty', 'RRP €', 'Trade €', 'Lead', ''].map(
              (h) => (
                <div
                  key={h}
                  style={{
                    fontSize: '.6rem',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '.1em',
                  }}
                >
                  {h}
                </div>
              )
            )}
          </div>

          {items.length === 0 ? (
            <div style={{ color: 'var(--mg)', fontSize: '.8rem', padding: '1.5rem 0' }}>
              No quote items yet.
            </div>
          ) : (
            items.map((i) => (
              <div
                key={i.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 2fr .5fr 1fr 1fr .8fr auto',
                  gap: '.75rem',
                  padding: '.75rem 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '.78rem',
                  color: 'var(--wg)',
                  alignItems: 'center',
                }}
              >
                <div style={{ color: 'var(--bone)' }}>{i.brand}</div>
                <div>{i.item_description}</div>
                <div style={{ color: 'var(--bone)' }}>{i.quantity}</div>
                <div>€{fmt(i.rrp_eur)}</div>
                <div style={{ color: 'var(--white)' }}>€{fmt(i.unit_price_eur)}</div>
                <div>{i.lead_time_weeks ? `${i.lead_time_weeks}w` : '—'}</div>
                <button
                  type="button"
                  className="btn-l"
                  disabled={busy}
                  onClick={() => deleteItem(i.id)}
                  style={{ color: 'var(--danger)', textDecorationColor: 'var(--danger)', fontSize: '.65rem' }}
                >
                  Delete
                </button>
              </div>
            ))
          )}

          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              border: '1px solid var(--border)',
              background: 'rgba(17,16,9,.4)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--fd)',
                fontSize: '1.1rem',
                color: 'var(--white)',
                marginBottom: '1rem',
              }}
            >
              Add Item
            </div>
            <form onSubmit={addItem}>
              <label className="lbl">Brand</label>
              <input
                className="inp"
                value={itemForm.brand}
                onChange={(e) => setItemForm((p) => ({ ...p, brand: e.target.value }))}
                required
              />
              <label className="lbl">Item Description</label>
              <input
                className="inp"
                value={itemForm.item_description}
                onChange={(e) =>
                  setItemForm((p) => ({ ...p, item_description: e.target.value }))
                }
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="lbl">Quantity</label>
                  <input
                    className="inp"
                    type="number"
                    min="1"
                    value={itemForm.quantity}
                    onChange={(e) =>
                      setItemForm((p) => ({ ...p, quantity: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="lbl">RRP €</label>
                  <input
                    className="inp"
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemForm.rrp_eur}
                    onChange={(e) =>
                      setItemForm((p) => ({ ...p, rrp_eur: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="lbl">Discount %</label>
                  <input
                    className="inp"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={itemForm.discount_percent}
                    onChange={(e) =>
                      setItemForm((p) => ({ ...p, discount_percent: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <label className="lbl">Trade Price € (auto)</label>
              <input
                className="inp"
                readOnly
                value={tradePreview ? fmt(tradePreview) : ''}
                style={{ opacity: 0.7 }}
              />
              <label className="lbl">Lead Time (weeks)</label>
              <input
                className="inp"
                type="number"
                min="0"
                value={itemForm.lead_time_weeks}
                onChange={(e) =>
                  setItemForm((p) => ({ ...p, lead_time_weeks: e.target.value }))
                }
              />
              <button type="submit" className="btn-p" disabled={busy}>
                {busy ? 'Adding...' : 'Add Item'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.75rem' }}>
            <button type="button" className="btn-p" disabled={busy} onClick={saveStatus}>
              {busy ? 'Saving...' : 'Save Status & Total'}
            </button>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <label className="lbl">Invoice URL</label>
            <input
              className="inp"
              value={invoiceUrl}
              onChange={(e) => setInvoiceUrl(e.target.value)}
              placeholder="https://"
            />
            <button type="button" className="btn-g" disabled={busy} onClick={saveInvoiceUrl}>
              Save Invoice URL
            </button>
          </div>

          {msg && (
            <p style={{ color: 'var(--ok)', fontSize: '.85rem', marginTop: '1rem' }}>{msg}</p>
          )}
          {err && (
            <p style={{ color: 'var(--danger)', fontSize: '.85rem', marginTop: '1rem' }}>
              {err}
            </p>
          )}
        </div>
      </div>
    </>
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
      <style>{`
        .row{display:grid;align-items:center;gap:1.5rem;padding:1.5rem 0;border-bottom:1px solid var(--border)}
        .row-title{font-family:var(--fd);font-size:1.1rem;color:var(--white);margin-bottom:.2rem}
        .row-sub{font-size:.62rem;color:var(--wg);text-transform:uppercase;letter-spacing:.06em}
        .sk{background:linear-gradient(90deg,var(--bg-s) 25%,rgba(255,255,255,.04) 50%,var(--bg-s) 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:2px}
        @keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
      `}</style>
      <div className="eyebrow">Sourcing</div>
      <h1 className="title">Estimates & Quotes</h1>

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="row-sub">Project</div>
        <div className="row-sub">Status</div>
      </div>

      {loading ? (
        [1, 2, 3].map((i) => (
          <div key={i} className="row" style={{ gridTemplateColumns: '2fr 1fr auto' }}>
            <div className="sk" style={{ height: '1rem', width: '60%' }} />
            <div className="sk" style={{ height: '1.2rem', width: '40%' }} />
            <div className="sk" style={{ height: '1rem', width: '30%' }} />
          </div>
        ))
      ) : estimates.length === 0 ? (
        <p style={{ color: 'var(--mg)', fontSize: '.85rem' }}>No estimates yet.</p>
      ) : (
        estimates.map((e) => (
          <div
            key={e.id}
            className="row"
            style={{ gridTemplateColumns: '2fr 1.5fr 1fr auto', alignItems: 'center' }}
          >
            <div>
              <div className="row-title">{e.project_name}</div>
              <div className="row-sub">
                {e.architect_name} · {e.architect_email}
              </div>
              <div className="row-sub" style={{ marginTop: '.25rem' }}>
                {new Date(e.created_at).toLocaleDateString()}
              </div>
            </div>
            <span className={`badge ${badgeClass(e.status)}`}>{e.status}</span>
            <div style={{ fontSize: '.8rem', color: e.total_value_eur ? 'var(--bone)' : 'var(--mg)' }}>
              {e.total_value_eur ? `€${fmt(e.total_value_eur)}` : '—'}
            </div>
            <button type="button" className="btn-l" onClick={() => setSelected(e)}>
              View / Edit
            </button>
          </div>
        ))
      )}

      {selected && (
        <EditPanel
          estimate={selected}
          onClose={() => setSelected(null)}
          onRefresh={fetchEstimates}
        />
      )}
    </div>
  )
}
