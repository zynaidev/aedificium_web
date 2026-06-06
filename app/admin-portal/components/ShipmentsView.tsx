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
      <style>{`
        .overlay{position:fixed;inset:0;background:rgba(10,8,6,.75);backdrop-filter:blur(4px);z-index:100}
        .panel{position:fixed;top:0;right:0;width:560px;max-width:100vw;height:100svh;background:var(--bg-r);border-left:1px solid var(--border-g);z-index:101;display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(0,0,0,.6)}
        .panel-hdr{padding:2rem 2rem 1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;flex-shrink:0}
        .panel-body{flex:1;padding:2rem;overflow-y:auto}
        .panel-close{background:none;border:none;color:var(--wg);font-size:1.4rem;cursor:pointer;line-height:1;padding:0}
        .panel-close:hover{color:var(--accent)}
      `}</style>
      <div className="overlay" onClick={onClose} />
      <div className="panel">
        <div className="panel-hdr">
          <div>
            <div className="eyebrow" style={{ marginBottom: '.2rem' }}>
              Shipment Editor
            </div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', color: 'var(--white)' }}>
              {shipment.shipment_ref}
            </div>
            <div className="row-sub" style={{ marginTop: '.5rem' }}>
              {shipment.project_name} · {shipment.ref_number}
            </div>
            <div className="row-sub" style={{ marginTop: '.25rem' }}>
              {shipment.architect_name} · {shipment.architect_email}
            </div>
          </div>
          <button type="button" className="panel-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="panel-body">
          <label className="lbl">Status</label>
          <select className="inp" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label className="lbl">Target Date</label>
          <input
            type="date"
            className="inp"
            style={{ colorScheme: 'dark' }}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="lbl">CBM</label>
              <input
                className="inp"
                type="number"
                step="0.01"
                min="0"
                value={cbm}
                onChange={(e) => setCbm(e.target.value)}
              />
            </div>
            <div>
              <label className="lbl">Weight kg</label>
              <input
                className="inp"
                type="number"
                step="0.01"
                min="0"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>
            <div>
              <label className="lbl">Pallet Count</label>
              <input
                className="inp"
                type="number"
                min="0"
                value={palletCount}
                onChange={(e) => setPalletCount(e.target.value)}
              />
            </div>
          </div>

          <label className="lbl">Tracking Number</label>
          <input
            className="inp"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />

          <label className="lbl">Notes</label>
          <input className="inp" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <button type="button" className="btn-p" disabled={busy} onClick={save}>
            {busy ? 'Saving...' : 'Save Changes'}
          </button>

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
      <style>{`
        .row{display:grid;align-items:center;gap:1.5rem;padding:1.5rem 0;border-bottom:1px solid var(--border);cursor:pointer;transition:background .2s}
        .row:hover{background:rgba(17,16,9,.35)}
        .row-title{font-family:var(--fd);font-size:1.1rem;color:var(--white);margin-bottom:.2rem}
        .row-sub{font-size:.62rem;color:var(--wg);text-transform:uppercase;letter-spacing:.06em}
        .sk{background:linear-gradient(90deg,var(--bg-s) 25%,rgba(255,255,255,.04) 50%,var(--bg-s) 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:2px}
        @keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .tab-btn{background:none;border:1px solid var(--border);color:var(--wg);padding:.55rem 1.25rem;font-family:var(--fu);font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;cursor:pointer;transition:all .25s;border-radius:2px}
        .tab-btn.active{border-color:var(--border-g);color:var(--white)}
        .tab-btn:hover{border-color:var(--accent);color:var(--accent)}
      `}</style>

      <div className="eyebrow">Logistics</div>
      <h1 className="title">Shipments</h1>

      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '2rem' }}>
        <button
          type="button"
          className={`tab-btn${tab === 'active' ? ' active' : ''}`}
          onClick={() => setTab('active')}
        >
          Active Queue
        </button>
        <button
          type="button"
          className={`tab-btn${tab === 'warehouse' ? ' active' : ''}`}
          onClick={() => setTab('warehouse')}
        >
          Warehouse
        </button>
      </div>

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto',
          gap: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '.5rem',
        }}
      >
        {['Shipment', 'Project', 'Architect', 'Destination', 'Status', 'Target / Tracking'].map(
          (h) => (
            <div key={h} className="row-sub">
              {h}
            </div>
          )
        )}
      </div>

      {loading ? (
        [1, 2, 3].map((i) => (
          <div
            key={i}
            className="row"
            style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto', cursor: 'default' }}
          >
            <div className="sk" style={{ height: '1rem', width: '70%' }} />
            <div className="sk" style={{ height: '1rem', width: '60%' }} />
            <div className="sk" style={{ height: '1rem', width: '50%' }} />
            <div className="sk" style={{ height: '1rem', width: '80%' }} />
            <div className="sk" style={{ height: '1.2rem', width: '40%' }} />
            <div className="sk" style={{ height: '1rem', width: '55%' }} />
          </div>
        ))
      ) : list.length === 0 ? (
        <p style={{ color: 'var(--mg)', fontSize: '.85rem' }}>
          {tab === 'active'
            ? 'No shipments in the active queue.'
            : 'No shipments in warehouse.'}
        </p>
      ) : (
        list.map((s) => (
          <div
            key={s.id}
            className="row"
            style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto', alignItems: 'center' }}
            onClick={() => setSelected(s)}
          >
            <div>
              <div className="row-title">{s.shipment_ref}</div>
            </div>
            <div style={{ fontSize: '.78rem', color: 'var(--bone)' }}>
              {s.project_name}
              <div className="row-sub" style={{ marginTop: '.2rem' }}>
                {s.ref_number}
              </div>
            </div>
            <div style={{ fontSize: '.75rem', color: 'var(--wg)' }}>{s.architect_name}</div>
            <div style={{ fontSize: '.72rem', color: 'var(--mg)' }}>
              {s.destination_address ?? '—'}
            </div>
            <span className={`badge ${badgeClass(s.status)}`}>{s.status}</span>
            <div style={{ fontSize: '.72rem', color: 'var(--wg)' }}>
              <div>{fmtDate(s.target_date)}</div>
              <div style={{ marginTop: '.25rem', color: 'var(--mg)' }}>
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
