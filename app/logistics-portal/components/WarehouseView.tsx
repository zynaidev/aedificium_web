'use client'

import { useMemo } from 'react'
import type { Shipment } from '../page'
import type { ListViewProps } from './QueueView'

function badgeClass(status: string) {
  if (status === 'Delivered') return 'ok'
  if (status === 'On Hold') return 'alert'
  if (status === 'Pending') return 'neutral'
  return ''
}

export default function WarehouseView({
  shipments,
  loading,
  selectedShipment,
  onSelectShipment,
}: ListViewProps) {
  const warehouse = useMemo(
    () => shipments.filter((s) => s.status === 'Warehouse (AEDIFICIUM)'),
    [shipments]
  )

  return (
    <div>
      <div className="eyebrow">Storage</div>
      <h1 className="title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        Warehouse
      </h1>

      {loading ? (
        <div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                padding: '1.25rem',
                marginBottom: '0.75rem',
                border: '1px solid var(--border)',
              }}
            >
              <div className="sk" style={{ height: '1rem', width: '70%', marginBottom: '.5rem' }} />
              <div className="sk" style={{ height: '.75rem', width: '50%' }} />
            </div>
          ))}
        </div>
      ) : warehouse.length === 0 ? (
        <p style={{ color: 'var(--mg)', fontSize: '.85rem' }}>No items currently in warehouse.</p>
      ) : (
        warehouse.map((s) => {
          const selected = selectedShipment?.id === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectShipment(s)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '1.25rem',
                marginBottom: '0.75rem',
                background: selected ? 'rgba(193,122,74,0.06)' : 'rgba(17,16,9,0.35)',
                border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'border-color 0.25s, background 0.25s',
              }}
            >
              <div className="row-title" style={{ marginBottom: '.35rem' }}>
                {s.shipment_ref}
              </div>
              <div style={{ fontSize: '.72rem', color: 'var(--bone)', marginBottom: '.35rem' }}>
                {s.project_name}
              </div>
              <div style={{ fontSize: '.68rem', color: 'var(--wg)', marginBottom: '.6rem' }}>
                {s.architect_name}
              </div>
              <span className={`badge ${badgeClass(s.status)}`}>{s.status}</span>
            </button>
          )
        })
      )}
    </div>
  )
}
