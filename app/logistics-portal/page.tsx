'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import type { OSUser } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import QueueView from './components/QueueView'
import WarehouseView from './components/WarehouseView'
import CalendarView from './components/CalendarView'
import MessagesView from './components/MessagesView'

export type Shipment = {
  id: string
  shipment_ref: string
  status: string
  destination_type: string | null
  destination_address: string | null
  contact_name: string | null
  target_date: string | null
  tracking_number: string | null
  cbm: number | null
  weight_kg: number | null
  pallet_count: number | null
  package_dimensions: string | null
  notes: string | null
  created_at: string
  project_name: string
  ref_number: string
  architect_name: string
  architect_email: string
}

type Tab = 'queue' | 'warehouse' | 'calendar' | 'messages'

const NAV: { id: Tab; label: string }[] = [
  { id: 'queue', label: 'Active Queue' },
  { id: 'warehouse', label: 'Warehouse' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'messages', label: 'Messages' },
]

const STATUS_OPTIONS = [
  'Pending',
  'On Hold',
  'Processing',
  'In transit',
  'Out for Delivery',
  'Warehouse (AEDIFICIUM)',
  'Delivered',
]

type Msg = {
  id: string
  sender_name: string
  sender_role: string
  message_body: string
  created_at: string
}

function ShipmentDetailPanel({
  shipment,
  onRefresh,
}: {
  shipment: Shipment | null
  onRefresh: () => Promise<Shipment[]>
}) {
  const [cbm, setCbm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [palletCount, setPalletCount] = useState('')
  const [packageDimensions, setPackageDimensions] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [status, setStatus] = useState('')
  const [savingCargo, setSavingCargo] = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)
  const [cargoMsg, setCargoMsg] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [err, setErr] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [msgsLoading, setMsgsLoading] = useState(false)
  const [chatText, setChatText] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shipment) return
    setCbm(shipment.cbm?.toString() ?? '')
    setWeightKg(shipment.weight_kg?.toString() ?? '')
    setPalletCount(shipment.pallet_count?.toString() ?? '')
    setPackageDimensions(shipment.package_dimensions ?? '')
    setDestinationAddress(shipment.destination_address ?? '')
    setContactName(shipment.contact_name ?? '')
    setStatus(shipment.status)
    setCargoMsg('')
    setStatusMsg('')
    setErr('')
  }, [shipment])

  useEffect(() => {
    if (!shipment) {
      setMsgs([])
      return
    }
    async function load() {
      setMsgsLoading(true)
      const res = await fetch(`/api/messages?shipment_id=${shipment!.id}`)
      if (res.ok) setMsgs(await res.json())
      setMsgsLoading(false)
    }
    load()
  }, [shipment?.id])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  async function saveCargo() {
    if (!shipment) return
    setSavingCargo(true)
    setErr('')
    setCargoMsg('')
    try {
      const res = await fetch('/api/admin/shipments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: shipment.id,
          cbm: cbm ? Number(cbm) : null,
          weight_kg: weightKg ? Number(weightKg) : null,
          pallet_count: palletCount ? Number(palletCount) : null,
          package_dimensions: packageDimensions || null,
          destination_address: destinationAddress || null,
          contact_name: contactName || null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setCargoMsg('Cargo updates saved.')
      await onRefresh()
    } catch {
      setErr('Failed to save cargo updates.')
    } finally {
      setSavingCargo(false)
    }
  }

  async function updateStatus() {
    if (!shipment) return
    setSavingStatus(true)
    setErr('')
    setStatusMsg('')
    try {
      const res = await fetch('/api/admin/shipments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: shipment.id, status }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatusMsg('Status updated.')
      await onRefresh()
    } catch {
      setErr('Failed to update status.')
    } finally {
      setSavingStatus(false)
    }
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault()
    if (!shipment || !chatText.trim() || sending) return
    setSending(true)
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipment_id: shipment.id, message_body: chatText }),
    })
    if (res.ok) {
      const msg = await res.json()
      setMsgs((p) => [...p, msg])
      setChatText('')
    }
    setSending(false)
  }

  if (!shipment) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            color: 'var(--os-mid-gray)',
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textAlign: 'center',
          }}
        >
          Select a manifest from the queue to view secure details.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="os-eyebrow" style={{ marginBottom: '0.5rem' }}>
        {shipment.destination_type ?? 'Shipment'}
      </div>
      <h2
        style={{
          fontFamily: 'var(--os-fd)',
          fontSize: '2.5rem',
          fontWeight: 300,
          color: 'var(--os-white)',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
        }}
      >
        {shipment.shipment_ref}
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--os-warm-gray)', marginBottom: '2.5rem' }}>
        {shipment.project_name} · {shipment.ref_number}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2.5rem',
          marginBottom: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--os-border)',
        }}
      >
        <div>
          <div className="os-input-label" style={{ marginBottom: '1rem' }}>
            Cargo Specs
          </div>
          <label className="os-input-label">CBM</label>
          <input
            className="os-input"
            type="number"
            step="0.01"
            min="0"
            value={cbm}
            onChange={(e) => setCbm(e.target.value)}
          />
          <label className="os-input-label">Weight kg</label>
          <input
            className="os-input"
            type="number"
            step="0.01"
            min="0"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
          <label className="os-input-label">Pallet Count</label>
          <input
            className="os-input"
            type="number"
            min="0"
            value={palletCount}
            onChange={(e) => setPalletCount(e.target.value)}
          />
          <label className="os-input-label">Package Dimensions</label>
          <input
            className="os-input"
            value={packageDimensions}
            onChange={(e) => setPackageDimensions(e.target.value)}
            placeholder="L × W × H"
          />
        </div>
        <div>
          <div className="os-input-label" style={{ marginBottom: '1rem' }}>
            Routing &amp; Access
          </div>
          <label className="os-input-label">Destination Address</label>
          <input
            className="os-input"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
          />
          <label className="os-input-label">Contact Name</label>
          <input
            className="os-input"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        className="os-btn-ghost"
        disabled={savingCargo || savingStatus}
        onClick={saveCargo}
        style={{ marginBottom: '2.5rem' }}
      >
        {savingCargo ? 'Saving...' : 'Save Cargo Updates'}
      </button>

      {cargoMsg && (
        <p style={{ color: 'var(--os-success)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {cargoMsg}
        </p>
      )}

      <div
        style={{
          marginBottom: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid var(--os-border)',
        }}
      >
        <div className="os-input-label" style={{ marginBottom: '0.75rem' }}>
          Current Status
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--os-bone)', marginBottom: '1rem' }}>
          {shipment.status}
        </p>
        <label className="os-input-label">Update Status</label>
        <select className="os-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="os-btn-primary"
          disabled={savingStatus || savingCargo}
          onClick={updateStatus}
        >
          {savingStatus ? 'Updating...' : 'Update Shipment Status'}
        </button>
        {statusMsg && (
          <p style={{ color: 'var(--os-success)', fontSize: '.85rem', marginTop: '1rem' }}>
            {statusMsg}
          </p>
        )}
      </div>

      {err && (
        <p style={{ color: 'var(--os-danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {err}
        </p>
      )}

      <div className="os-eyebrow" style={{ marginBottom: '1rem' }}>
        Logistics Chat
      </div>
      <div className="os-chat">
        <div className="os-chat-msgs">
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
        <form className="os-chat-form" onSubmit={sendChat}>
          <input
            className="os-chat-input"
            placeholder="Message architect..."
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            required
          />
          <button type="submit" className="os-chat-send" disabled={sending}>
            {sending ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LogisticsPortal() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('queue')
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const isSplitTab = activeTab === 'queue' || activeTab === 'warehouse'

  const fetchShipments = useCallback(async () => {
    const res = await fetch('/api/admin/shipments')
    if (!res.ok) throw new Error('Failed to load')
    const data = await res.json()
    setShipments(data)
    setSelectedShipment((prev) => {
      if (!prev) return null
      return data.find((s: Shipment) => s.id === prev.id) ?? null
    })
    return data as Shipment[]
  }, [])

  useEffect(() => {
    if (isPending) return
    if (!session) {
      router.replace('/os-login')
      return
    }
    const user = session.user as unknown as OSUser
    if (user.role !== 'logistics' && user.role !== 'admin') {
      router.replace('/os-dashboard')
      return
    }
    if (user.is_active === false) {
      router.replace('/os-login')
      return
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (isPending || !session) return
    const user = session.user as unknown as OSUser
    if (user.role !== 'logistics' && user.role !== 'admin') return
    if (user.is_active === false) return

    setLoading(true)
    fetchShipments()
      .catch(() => setShipments([]))
      .finally(() => setLoading(false))
  }, [isPending, session, fetchShipments])

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    if (tab !== 'queue' && tab !== 'warehouse') {
      setSelectedShipment(null)
    }
  }

  const user = session?.user as unknown as OSUser | undefined
  const allowed = user?.role === 'logistics' || user?.role === 'admin'

  if (isPending || !session || !allowed) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--os-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--os-accent)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Authenticating Identity...
      </div>
    )
  }

  const listProps = {
    shipments,
    loading,
    selectedShipment,
    onSelectShipment: setSelectedShipment,
    onRefresh: fetchShipments,
  }

  return (
    <div className="os-wrap">
      <aside className="os-sidebar">
        <div className="os-sidebar-logo">
          <span className="os-wordmark-aedificium">AEDIFICIUM</span>{' '}
          <span className="os-wordmark-os">OS</span>
        </div>
        <nav className="os-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`os-nav-btn${activeTab === item.id ? ' active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              {activeTab === item.id && <span className="os-nav-dot" />}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="os-user-block">
          <div className="os-user-studio">Logistics</div>
          <div className="os-user-email">{user.email}</div>
          <button
            className="os-logout"
            onClick={async () => {
              await signOut()
              router.replace('/os-login')
            }}
          >
            Log Out
          </button>
        </div>
      </aside>

      <main
        className="os-main"
        style={
          isSplitTab
            ? { padding: 0, overflow: 'hidden', height: '100svh', minHeight: 0 }
            : undefined
        }
      >
        {isSplitTab ? (
          <div className="os-split-layout">
            <div className="os-split-left">
              {activeTab === 'queue' ? (
                <QueueView {...listProps} />
              ) : (
                <WarehouseView {...listProps} />
              )}
            </div>
            <div className="os-split-right">
              <ShipmentDetailPanel
                shipment={selectedShipment}
                onRefresh={fetchShipments}
              />
            </div>
          </div>
        ) : activeTab === 'calendar' ? (
          <CalendarView shipments={shipments} />
        ) : (
          <MessagesView />
        )}
      </main>
    </div>
  )
}
