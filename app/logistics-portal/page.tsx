'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
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
            color: 'var(--mid-gray)',
            fontSize: '0.82rem',
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
      <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>
        {shipment.destination_type ?? 'Shipment'}
      </div>
      <h2
        style={{
          fontFamily: 'var(--fd)',
          fontSize: '2.5rem',
          fontWeight: 300,
          color: 'var(--white)',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
        }}
      >
        {shipment.shipment_ref}
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--wg)', marginBottom: '2.5rem' }}>
        {shipment.project_name} · {shipment.ref_number}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2.5rem',
          marginBottom: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <div className="lbl" style={{ marginBottom: '1rem' }}>
            Cargo Specs
          </div>
          <label className="lbl">CBM</label>
          <input
            className="inp"
            type="number"
            step="0.01"
            min="0"
            value={cbm}
            onChange={(e) => setCbm(e.target.value)}
          />
          <label className="lbl">Weight kg</label>
          <input
            className="inp"
            type="number"
            step="0.01"
            min="0"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
          <label className="lbl">Pallet Count</label>
          <input
            className="inp"
            type="number"
            min="0"
            value={palletCount}
            onChange={(e) => setPalletCount(e.target.value)}
          />
          <label className="lbl">Package Dimensions</label>
          <input
            className="inp"
            value={packageDimensions}
            onChange={(e) => setPackageDimensions(e.target.value)}
            placeholder="L × W × H"
          />
        </div>
        <div>
          <div className="lbl" style={{ marginBottom: '1rem' }}>
            Routing &amp; Access
          </div>
          <label className="lbl">Destination Address</label>
          <input
            className="inp"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
          />
          <label className="lbl">Contact Name</label>
          <input
            className="inp"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        className="btn-g"
        disabled={savingCargo || savingStatus}
        onClick={saveCargo}
        style={{ marginBottom: '2.5rem' }}
      >
        {savingCargo ? 'Saving...' : 'Save Cargo Updates'}
      </button>

      {cargoMsg && (
        <p style={{ color: 'var(--ok)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {cargoMsg}
        </p>
      )}

      <div
        style={{
          marginBottom: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="lbl" style={{ marginBottom: '0.75rem' }}>
          Current Status
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--bone)', marginBottom: '1rem' }}>
          {shipment.status}
        </p>
        <label className="lbl">Update Status</label>
        <select className="inp" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-p"
          disabled={savingStatus || savingCargo}
          onClick={updateStatus}
        >
          {savingStatus ? 'Updating...' : 'Update Shipment Status'}
        </button>
        {statusMsg && (
          <p style={{ color: 'var(--ok)', fontSize: '.85rem', marginTop: '1rem' }}>
            {statusMsg}
          </p>
        )}
      </div>

      {err && (
        <p style={{ color: 'var(--danger)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
          {err}
        </p>
      )}

      <div className="eyebrow" style={{ marginBottom: '1rem' }}>
        Logistics Chat
      </div>
      <div className="chat">
        <div className="chat-msgs">
          {msgsLoading ? (
            <div
              style={{
                color: 'var(--mg)',
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
                color: 'var(--mg)',
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
                className={`msg ${m.sender_role === 'logistics' ? 'msg-me' : 'msg-other'}`}
              >
                <div>{m.message_body}</div>
                <div className="msg-meta">
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
        <form className="chat-form" onSubmit={sendChat}>
          <input
            className="chat-inp"
            placeholder="Message architect..."
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            required
          />
          <button type="submit" className="chat-send" disabled={sending}>
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
    const role = (session.user as { role?: string }).role
    if (role !== 'logistics' && role !== 'admin') {
      router.replace('/os-dashboard')
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (isPending || !session) return
    const role = (session.user as { role?: string }).role
    if (role !== 'logistics' && role !== 'admin') return

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

  const user = session?.user as { email: string; role?: string } | undefined
  const allowed = user?.role === 'logistics' || user?.role === 'admin'

  if (isPending || !session || !allowed) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0a0806',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#c17a4a',
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
    <>
      <style>{STYLES}</style>
      <div className="aed-wrap">
        <aside className="aed-sidebar">
          <div className="aed-logo">AEDIFICIUM OS</div>
          <nav className="aed-nav">
            {NAV.map((item) => (
              <button
                key={item.id}
                className={`aed-nav-btn${activeTab === item.id ? ' active' : ''}`}
                onClick={() => handleTabChange(item.id)}
              >
                {activeTab === item.id && <span className="dot" />}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="aed-user">
            <div className="aed-user-studio">Logistics</div>
            <div className="aed-user-email">{user.email}</div>
            <button
              className="aed-logout"
              onClick={async () => {
                await signOut()
                router.replace('/os-login')
              }}
            >
              Log Out
            </button>
          </div>
        </aside>

        <main className={isSplitTab ? 'aed-main aed-main-split' : 'aed-main'}>
          {isSplitTab ? (
            <div className="split-layout">
              <div className="split-left">
                {activeTab === 'queue' ? (
                  <QueueView {...listProps} />
                ) : (
                  <WarehouseView {...listProps} />
                )}
              </div>
              <div className="split-right">
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
    </>
  )
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0806;--bg-r:#111009;--bg-s:#1a1410;
  --border:rgba(230,226,216,0.07);--border-g:rgba(185,139,54,0.22);
  --accent:#c17a4a;--gold:#b98b36;
  --white:#f4f1ea;--bone:#e6e2d8;--wg:#9e9484;--mg:#6b6357;--mid-gray:#6b6357;
  --danger:#a8365a;--ok:#4a7c59;
  --fd:'Cormorant Garamond',Georgia,serif;
  --fu:'Inter',system-ui,sans-serif;
  --ease:cubic-bezier(0.16,1,0.3,1);
}
body{background:var(--bg);color:var(--bone);font-family:var(--fu)}
.aed-wrap{display:flex;min-height:100svh}
.aed-sidebar{width:256px;min-width:256px;background:var(--bg-r);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:2.5rem 1.75rem;position:sticky;top:0;height:100svh;overflow-y:auto}
.aed-logo{font-size:0.68rem;letter-spacing:0.34em;color:var(--white);text-transform:uppercase;margin-bottom:3.5rem}
.aed-nav{display:flex;flex-direction:column;gap:0.2rem;flex:1}
.aed-nav-btn{background:none;border:none;padding:0.6rem 0;color:var(--mg);font-family:var(--fu);font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:color .25s var(--ease);display:flex;align-items:center;gap:0.7rem;text-align:left}
.aed-nav-btn:hover{color:var(--bone)}
.aed-nav-btn.active{color:var(--white)}
.aed-nav-btn .dot{width:3px;height:3px;border-radius:50%;background:var(--accent);flex-shrink:0}
.aed-user{border-top:1px solid var(--border);padding-top:1.5rem;margin-top:1.5rem}
.aed-user-studio{font-family:var(--fd);font-size:1rem;color:var(--white);margin-bottom:0.3rem}
.aed-user-email{font-size:0.62rem;color:var(--mg);margin-bottom:1rem;word-break:break-all}
.aed-logout{background:none;border:none;color:var(--danger);font-family:var(--fu);font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;padding:0;transition:opacity .2s}
.aed-logout:hover{opacity:.7}
.aed-main{flex:1;padding:4rem 5rem;overflow-x:hidden;min-width:0}
.aed-main-split{padding:0;overflow:hidden;height:100svh;min-height:0}
.split-layout{display:grid;grid-template-columns:380px 1fr;height:100%;overflow:hidden}
.split-left{overflow-y:auto;border-right:1px solid var(--border);padding:1.5rem}
.split-right{overflow-y:auto;padding:2.5rem 3rem;background:var(--bg)}
.eyebrow{font-size:0.62rem;color:var(--accent);letter-spacing:0.22em;text-transform:uppercase;margin-bottom:0.75rem}
.title{font-family:var(--fd);font-size:2.8rem;font-weight:300;color:var(--white);line-height:1.1;margin-bottom:3.5rem}
.badge{display:inline-block;padding:.3rem .7rem;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;border-radius:20px;border:1px solid var(--accent);color:var(--accent)}
.badge.ok{border-color:var(--ok);color:var(--ok)}
.badge.alert{border-color:var(--danger);color:var(--danger)}
.badge.neutral{border-color:var(--mg);color:var(--mg)}
.btn-p{background:linear-gradient(135deg,var(--accent),var(--gold));color:#0a0806;border:none;padding:.85rem 1.75rem;font-family:var(--fu);font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;cursor:pointer;transition:opacity .25s;border-radius:2px}
.btn-p:hover{opacity:.82}
.btn-p:disabled{opacity:.4;cursor:not-allowed}
.btn-g{background:none;border:1px solid var(--border-g);color:var(--bone);padding:.7rem 1.4rem;font-family:var(--fu);font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;cursor:pointer;transition:all .25s;border-radius:2px}
.btn-g:hover{border-color:var(--accent);color:var(--accent)}
.btn-g:disabled{opacity:.4;cursor:not-allowed}
.btn-l{background:none;border:none;color:var(--bone);font-family:var(--fu);font-size:.72rem;cursor:pointer;text-decoration:underline;text-decoration-color:var(--accent);text-underline-offset:3px;padding:0;transition:color .2s}
.btn-l:hover{color:var(--accent)}
.inp{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(230,226,216,.18);padding:.75rem 0;font-family:var(--fu);font-size:.88rem;color:var(--bone);margin-bottom:1.5rem;transition:border-color .25s;outline:none}
.inp:focus{border-color:var(--accent)}
.inp::placeholder{color:var(--mg)}
select.inp option{background:#111009;color:var(--bone)}
.lbl{display:block;font-size:.58rem;color:var(--wg);text-transform:uppercase;letter-spacing:.12em;margin-bottom:.2rem}
.row-title{font-family:var(--fd);font-size:1.1rem;color:var(--white);margin-bottom:.2rem}
.chat{display:flex;flex-direction:column;height:360px;margin-top:0}
.chat-msgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:.75rem;padding-bottom:.5rem}
.chat-msgs::-webkit-scrollbar{width:3px}
.chat-msgs::-webkit-scrollbar-thumb{background:var(--mg);border-radius:2px}
.msg{max-width:85%;padding:.75rem 1rem;font-size:.82rem;line-height:1.5;border-radius:2px}
.msg-me{background:rgba(193,122,74,.1);border-right:2px solid var(--accent);align-self:flex-end;color:var(--white)}
.msg-other{background:rgba(230,226,216,.05);border-left:2px solid var(--wg);align-self:flex-start;color:var(--bone)}
.msg-meta{font-size:.52rem;color:var(--mg);margin-top:.35rem;text-transform:uppercase;letter-spacing:.06em}
.chat-form{display:flex;border:1px solid rgba(230,226,216,.15);margin-top:1rem;flex-shrink:0}
.chat-inp{flex:1;background:transparent;border:none;padding:.9rem 1rem;color:var(--bone);font-family:var(--fu);font-size:.82rem;outline:none}
.chat-send{background:var(--accent);color:#0a0806;border:none;padding:0 1.25rem;font-family:var(--fu);font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;cursor:pointer;transition:opacity .2s;flex-shrink:0}
.chat-send:hover{opacity:.8}
.sk{background:linear-gradient(90deg,var(--bg-s) 25%,rgba(255,255,255,.04) 50%,var(--bg-s) 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:2px}
@keyframes sk{0%{background-position:200% 0}100%{background-position:-100% 0}}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);border-top:1px solid var(--border);border-left:1px solid var(--border)}
.cal-hdr{padding:.75rem;font-size:.6rem;color:var(--wg);text-transform:uppercase;letter-spacing:.1em;text-align:right;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg-r)}
.cal-cell{min-height:110px;padding:.5rem;border-right:1px solid var(--border);border-bottom:1px solid var(--border);position:relative}
.cal-num{display:block;text-align:right;margin-bottom:.4rem;font-size:.75rem;color:var(--mg)}
.cal-cell.today .cal-num{color:var(--accent);font-weight:600}
.cal-evt{border-left:2px solid var(--accent);padding:.3rem .4rem;font-size:.6rem;color:var(--bone);margin-bottom:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cal-evt.wh{border-left-color:var(--ok);background:rgba(74,124,89,.1)}
.cal-evt.site{background:rgba(193,122,74,.1)}
@media(max-width:1100px){.aed-main{padding:3rem 2.5rem}.aed-main-split{padding:0}}
@media(max-width:768px){
  .aed-wrap{flex-direction:column}
  .aed-sidebar{width:100%;min-width:0;height:auto;position:static;padding:1.25rem 1.5rem}
  .aed-nav{flex-direction:row;flex-wrap:wrap;gap:.5rem}
  .aed-nav-btn{font-size:.6rem;padding:.4rem .6rem}
  .aed-main{padding:2rem 1.25rem}
  .title{font-size:2rem}
  .split-layout{grid-template-columns:1fr;grid-template-rows:auto 1fr}
}
`
