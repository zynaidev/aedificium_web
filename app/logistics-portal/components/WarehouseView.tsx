'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Shipment } from '../page'

const STATUS_OPTIONS = [
  'Pending',
  'On Hold',
  'Processing',
  'In transit',
  'Out for Delivery',
  'Warehouse (AEDIFICIUM)',
  'Delivered',
]

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
  onRefresh,
}: {
  shipment: Shipment
  onClose: () => void
  onRefresh: () => Promise<Shipment[]>
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
      await onRefresh()
    } catch {
      setErr('Failed to update shipment.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="overlay open" onClick={onClose} />
      <div className="panel open">
        <div className="panel-hdr">
          <div>
            <div className="eyebrow" style={{ marginBottom: '.2rem' }}>
              Shipment Editor
            </div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', color: 'var(--white)' }}>
              {shipment.shipment_ref}
            </div>
            <div className="row-sub" style={{ marginTop: '.5rem' }}>
              {shipment.project_name} · {shipment.architect_name}
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

type Props = {
  shipments: Shipment[]
  loading: boolean
  onRefresh: () => Promise<Shipment[]>
}

export default function WarehouseView({ shipments, loading, onRefresh }: Props) {
  const [selected, setSelected] = useState<Shipment | null>(null)

  const warehouse = useMemo(
    () => shipments.filter((s) => s.status === 'Warehouse (AEDIFICIUM)'),
    [shipments]
  )

  return (
    <div>
      <div className="eyebrow">Storage</div>
      <h1 className="title">Warehouse</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1.2fr 1fr 1.2fr auto auto auto',
          gap: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '.5rem',
        }}
      >
        {['Shipment', 'Project', 'Architect', 'Destination', 'Status', 'Target', 'Tracking'].map(
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
            style={{
              gridTemplateColumns: '1.5fr 1.2fr 1fr 1.2fr auto auto auto',
              cursor: 'default',
            }}
          >
            <div className="sk" style={{ height: '1rem', width: '70%' }} />
            <div className="sk" style={{ height: '1rem', width: '60%' }} />
            <div className="sk" style={{ height: '1rem', width: '50%' }} />
            <div className="sk" style={{ height: '1rem', width: '80%' }} />
            <div className="sk" style={{ height: '1.2rem', width: '40%' }} />
            <div className="sk" style={{ height: '1rem', width: '45%' }} />
            <div className="sk" style={{ height: '1rem', width: '55%' }} />
          </div>
        ))
      ) : warehouse.length === 0 ? (
        <p style={{ color: 'var(--mg)', fontSize: '.85rem' }}>No items currently in warehouse.</p>
      ) : (
        warehouse.map((s) => (
          <div
            key={s.id}
            className="row"
            style={{
              gridTemplateColumns: '1.5fr 1.2fr 1fr 1.2fr auto auto auto',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setSelected(s)}
          >
            <div className="row-title">{s.shipment_ref}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--bone)' }}>{s.project_name}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--wg)' }}>{s.architect_name}</div>
            <div style={{ fontSize: '.72rem', color: 'var(--mg)' }}>
              {s.destination_address ?? '—'}
            </div>
            <span className={`badge ${badgeClass(s.status)}`}>{s.status}</span>
            <div style={{ fontSize: '.72rem', color: 'var(--wg)' }}>{fmtDate(s.target_date)}</div>
            <div style={{ fontSize: '.72rem', color: 'var(--mg)' }}>
              {s.tracking_number ?? '—'}
            </div>
          </div>
        ))
      )}

      {selected && (
        <EditPanel
          shipment={selected}
          onClose={() => setSelected(null)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  )
}
