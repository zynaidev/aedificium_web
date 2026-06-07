'use client'

import { useMemo, useState } from 'react'
import type { Shipment } from '../page'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CalendarView({ shipments }: { shipments: Shipment[] }) {
  const today = new Date()
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const year = cur.getFullYear()
  const month = cur.getMonth()

  const events = useMemo(
    () =>
      shipments
        .filter((s) => s.target_date)
        .map((s) => ({
          date: s.target_date!,
          title: s.shipment_ref,
          wh: s.destination_type?.toLowerCase().includes('warehouse') ?? false,
        })),
    [shipments]
  )

  const offset = (() => {
    const d = new Date(year, month, 1).getDay()
    return d === 0 ? 6 : d - 1
  })()
  const days = new Date(year, month + 1, 0).getDate()

  const eventsFor = (d: number) => {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return events.filter((e) => e.date.slice(0, 10) === ds)
  }

  return (
    <div>
      <div className="os-eyebrow">Site-Sync</div>
      <h1 className="os-page-title">Logistics Calendar</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div style={{ fontFamily: 'var(--os-fd)', fontSize: '2.2rem', color: 'var(--os-white)' }}>
          {MONTHS[month]} {year}
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button
            type="button"
            className="os-btn-ghost"
            style={{ padding: '.5rem 1rem' }}
            onClick={() => setCur(new Date(year, month - 1, 1))}
          >
            ←
          </button>
          <button
            type="button"
            className="os-btn-ghost"
            style={{ padding: '.5rem 1rem' }}
            onClick={() => setCur(new Date(year, month + 1, 1))}
          >
            →
          </button>
        </div>
      </div>
      <div className="os-cal-grid">
        {DAYS.map((d) => (
          <div key={d} className="os-cal-hdr">
            {d}
          </div>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <div
            key={`e${i}`}
            style={{
              minHeight: '110px',
              borderRight: '1px solid var(--os-border)',
              borderBottom: '1px solid var(--os-border)',
              background: 'rgba(17,16,9,.2)',
            }}
          />
        ))}
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
          const evts = eventsFor(d)
          const isToday =
            year === today.getFullYear() &&
            month === today.getMonth() &&
            d === today.getDate()
          return (
            <div
              key={d}
              className={`os-cal-cell${isToday ? ' today' : ''}`}
              style={{ background: isToday ? 'rgba(193,122,74,.04)' : 'transparent' }}
              onMouseEnter={(e) => {
                if (!isToday) e.currentTarget.style.background = 'rgba(17,16,9,.5)'
              }}
              onMouseLeave={(e) => {
                if (!isToday) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span className="os-cal-num">{d}</span>
              {evts.map((ev, i) => (
                <div
                  key={i}
                  className={`os-cal-evt ${ev.wh ? 'wh' : ''}`}
                  title={ev.title}
                >
                  {ev.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
        {[
          { c: 'var(--os-accent)', l: 'Site Delivery' },
          { c: 'var(--os-success)', l: 'Warehouse Receipt' },
        ].map((x) => (
          <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <div
              style={{ width: '12px', height: '3px', background: x.c, borderRadius: '2px' }}
            />
            <span
              style={{
                fontSize: '.65rem',
                color: 'var(--os-warm-gray)',
                textTransform: 'uppercase',
                letterSpacing: '.08em',
              }}
            >
              {x.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
