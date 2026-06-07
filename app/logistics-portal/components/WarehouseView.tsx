'use client'

import { useMemo } from 'react'
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
      <div className="os-eyebrow">Storage</div>
      <h1 className="os-page-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
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
                border: '1px solid var(--os-border)',
              }}
            >
              <div className="os-sk" style={{ height: '1rem', width: '70%', marginBottom: '.5rem' }} />
              <div className="os-sk" style={{ height: '.75rem', width: '50%' }} />
            </div>
          ))}
        </div>
      ) : warehouse.length === 0 ? (
        <p style={{ color: 'var(--os-mid-gray)', fontSize: '.875rem' }}>No items currently in warehouse.</p>
      ) : (
        warehouse.map((s) => {
          const selected = selectedShipment?.id === s.id
          return (
            <button
              key={s.id}
              type="button"
              className="os-card"
              onClick={() => onSelectShipment(s)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '1.25rem',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                borderColor: selected ? 'var(--os-border-gold)' : 'var(--os-border)',
              }}
            >
              <div className="os-row-title" style={{ marginBottom: '.35rem' }}>
                {s.shipment_ref}
              </div>
              <div style={{ fontSize: '.72rem', color: 'var(--os-bone)', marginBottom: '.35rem' }}>
                {s.project_name}
              </div>
              <div style={{ fontSize: '.68rem', color: 'var(--os-warm-gray)', marginBottom: '.6rem' }}>
                {s.architect_name}
              </div>
              <span className={`os-badge ${badgeClass(s.status)}`}>{s.status}</span>
            </button>
          )
        })
      )}
    </div>
  )
}
