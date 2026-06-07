'use client'

import { useEffect, useMemo, useState } from 'react'

type Shipment = {
  id: string
  shipment_ref: string
  status: string
  destination_address: string | null
  target_date: string | null
  tracking_number: string | null
  cbm: number | null
  weight_kg: number | null
  pallet_count: number | null
  notes: string | null
  created_at: string
  project_name: string
  ref_number: string
  architect_name: string
  architect_email: string
}

const STATUS_OPTIONS = [
  'Pending',
  'On Hold',
  'Processing',
  'In transit',
  'Out for Delivery',
  'Warehouse (AEDIFICIUM)',
  'Delivered',
]

type Tab = 'active' | 'warehouse'

function badgeClass(status: string) {
  if (status === 'Delivered') return 'ok'
  if (status === 'On Hold') return 'alert'
  if (status === 'Pending') return 'neutral'
  return ''
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString()
}

function toDateInput(d: string | null) {
  if (!d) return ''
  return d.slice(0, 10)
}

function EditPanel({
  shipment,
  onClose,
  onSaved,
}: {
  shipment: Shipment
  onClose: () => void
  onSaved: () => Promise<Shipment[]>
}) {
  const [status, setStatus] = useState(shipment.status)
  const [targetDate, setTargetDate] = useState(toDateInput(shipment.target_date))
  const [cbm, setCbm] = useState(shipment.cbm?.toString() ?? '')
  const [weightKg, setWeightKg] = useState(shipment.weight_kg?.toString() ?? '')
  const [palletCount, setPalletCount] = useState(shipment.pallet_count?.toString() ?? '')
  const [trackingNumber, setTrackingNumber] = useState(shipment.tracking_number ?? '')
  const [notes, setNotes] = useState(shipment.notes ?? '')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    setStatus(shipment.status)
    setTargetDate(toDateInput(shipment.target_date))
    setCbm(shipment.cbm?.toString() ?? '')
    setWeightKg(shipment.weight_kg?.toString() ?? '')
    setPalletCount(shipment.pallet_count?.toString() ?? '')
    setTrackingNumber(shipment.tracking_number ?? '')
    setNotes(shipment.notes ?? '')
  }, [shipment])

  async function save() {
    setBusy(true)
    setErr('')
    setMsg('')
    try {
      const res = await fetch('/api/admin/shipments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: shipment.id,
          status,
          target_date: targetDate || null,
          cbm: cbm ? Number(cbm) : null,
          weight_kg: weightKg ? Number(weightKg) : null,
          pallet_count: palletCount ? Number(palletCount) : null,
          tracking_number: trackingNumber || null,
          notes: notes || null,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setMsg('Shipment updated.')
      await onSaved()
    } catch {
      setErr('Failed to update shipment.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="os-overlay open" onClick={onClose} />
      <div className="os-panel open">
        <div className="os-panel-header">
          <div>
            <div className="os-eyebrow" style={{ marginBottom: '.2rem' }}>
              Shipment Editor
            </div>
            <div style={{ fontFamily: 'var(--os-fd)', fontSize: '1.4rem', color: 'var(--os-white)' }}>
              {shipment.shipment_ref}
            </div>
            <div className="os-row-sub" style={{ marginTop: '.5rem' }}>
              {shipment.project_name} · {shipment.ref_number}
            </div>
            <div className="os-row-sub" style={{ marginTop: '.25rem' }}>
              {shipment.architect_name} · {shipment.architect_email}
            </div>
          </div>
          <button type="button" className="os-panel-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="os-panel-body">
          <label className="os-input-label">Status</label>
          <select className="os-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label className="os-input-label">Target Date</label>
          <input
            type="date"
            className="os-input"
            style={{ colorScheme: 'dark' }}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="os-input-label">CBM</label>
              <input
                className="os-input"
                type="number"
                step="0.01"
                min="0"
                value={cbm}
                onChange={(e) => setCbm(e.target.value)}
              />
            </div>
            <div>
              <label className="os-input-label">Weight kg</label>
              <input
                className="os-input"
                type="number"
                step="0.01"
                min="0"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>
            <div>
              <label className="os-input-label">Pallet Count</label>
              <input
                className="os-input"
                type="number"
                min="0"
                value={palletCount}
                onChange={(e) => setPalletCount(e.target.value)}
              />
            </div>
          </div>

          <label className="os-input-label">Tracking Number</label>
          <input
            className="os-input"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />

          <label className="os-input-label">Notes</label>
          <input className="os-input" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <button type="button" className="os-btn-primary" disabled={busy} onClick={save}>
            {busy ? 'Saving...' : 'Save Changes'}
          </button>

          {msg && (
            <p style={{ color: 'var(--os-success)', fontSize: '.85rem', marginTop: '1rem' }}>{msg}</p>
          )}
          {err && (
            <p style={{ color: 'var(--os-danger)', fontSize: '.85rem', marginTop: '1rem' }}>
              {err}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default function ShipmentsView() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('active')
  const [selected, setSelected] = useState<Shipment | null>(null)

  async function fetchShipments(): Promise<Shipment[]> {
    const res = await fetch('/api/admin/shipments')
    if (!res.ok) throw new Error('Failed to load')
    const data = await res.json()
    setShipments(data)
    if (selected) {
      const updated = data.find((s: Shipment) => s.id === selected.id)
      if (updated) setSelected(updated)
    }
    return data
  }

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchShipments()
      .catch(() => setError('Failed to load shipments.'))
      .finally(() => setLoading(false))
  }, [])

  const activeQueue = useMemo(
    () =>
      shipments.filter(
        (s) => s.status !== 'Warehouse (AEDIFICIUM)' && s.status !== 'Delivered'
      ),
    [shipments]
  )

  const warehouse = useMemo(
    () => shipments.filter((s) => s.status === 'Warehouse (AEDIFICIUM)'),
    [shipments]
  )

  const list = tab === 'active' ? activeQueue : warehouse

  return (
    <div>
      <div className="os-eyebrow">Logistics</div>
      <h1 className="os-page-title">Shipments</h1>

      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '2rem' }}>
        <button
          type="button"
          className={`os-btn-ghost${tab === 'active' ? '' : ''}`}
          style={{
            borderColor: tab === 'active' ? 'var(--os-border-gold)' : 'var(--os-border)',
            color: tab === 'active' ? 'var(--os-white)' : 'var(--os-warm-gray)',
            padding: '.55rem 1.25rem',
            fontSize: '.65rem',
          }}
          onClick={() => setTab('active')}
        >
          Active Queue
        </button>
        <button
          type="button"
          className="os-btn-ghost"
          style={{
            borderColor: tab === 'warehouse' ? 'var(--os-border-gold)' : 'var(--os-border)',
            color: tab === 'warehouse' ? 'var(--os-white)' : 'var(--os-warm-gray)',
            padding: '.55rem 1.25rem',
            fontSize: '.65rem',
          }}
          onClick={() => setTab('warehouse')}
        >
          Warehouse
        </button>
      </div>

      {error && (
        <p style={{ color: 'var(--os-danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto',
          gap: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--os-border)',
          marginBottom: '.5rem',
        }}
      >
        {['Shipment', 'Project', 'Architect', 'Destination', 'Status', 'Target / Tracking'].map(
          (h) => (
            <div key={h} className="os-row-sub">
              {h}
            </div>
          )
        )}
      </div>

      {loading ? (
        [1, 2, 3].map((i) => (
          <div
            key={i}
            className="os-row"
            style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto', cursor: 'default' }}
          >
            <div className="os-sk" style={{ height: '1rem', width: '70%' }} />
            <div className="os-sk" style={{ height: '1rem', width: '60%' }} />
            <div className="os-sk" style={{ height: '1rem', width: '50%' }} />
            <div className="os-sk" style={{ height: '1rem', width: '80%' }} />
            <div className="os-sk" style={{ height: '1.2rem', width: '40%' }} />
            <div className="os-sk" style={{ height: '1rem', width: '55%' }} />
          </div>
        ))
      ) : list.length === 0 ? (
        <p style={{ color: 'var(--os-mid-gray)', fontSize: '.85rem' }}>
          {tab === 'active'
            ? 'No shipments in the active queue.'
            : 'No shipments in warehouse.'}
        </p>
      ) : (
        list.map((s) => (
          <div
            key={s.id}
            className="os-row"
            style={{
              gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background .2s',
            }}
            onClick={() => setSelected(s)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(17,16,9,.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <div>
              <div className="os-row-title">{s.shipment_ref}</div>
            </div>
            <div style={{ fontSize: '.78rem', color: 'var(--os-bone)' }}>
              {s.project_name}
              <div className="os-row-sub" style={{ marginTop: '.2rem' }}>
                {s.ref_number}
              </div>
            </div>
            <div style={{ fontSize: '.75rem', color: 'var(--os-warm-gray)' }}>{s.architect_name}</div>
            <div style={{ fontSize: '.72rem', color: 'var(--os-mid-gray)' }}>
              {s.destination_address ?? '—'}
            </div>
            <span className={`os-badge ${badgeClass(s.status)}`}>{s.status}</span>
            <div style={{ fontSize: '.72rem', color: 'var(--os-warm-gray)' }}>
              <div>{fmtDate(s.target_date)}</div>
              <div style={{ marginTop: '.25rem', color: 'var(--os-mid-gray)' }}>
                {s.tracking_number ?? '—'}
              </div>
            </div>
          </div>
        ))
      )}

      {selected && (
        <EditPanel
          shipment={selected}
          onClose={() => setSelected(null)}
          onSaved={fetchShipments}
        />
      )}
    </div>
  )
}
