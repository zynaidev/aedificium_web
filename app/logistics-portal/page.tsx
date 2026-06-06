'use client'

import { useCallback, useEffect, useState } from 'react'
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

type Tab = 'queue' | 'warehouse' | 'calendar' | 'messages'

const NAV: { id: Tab; label: string }[] = [
  { id: 'queue', label: 'Active Queue' },
  { id: 'warehouse', label: 'Warehouse' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'messages', label: 'Messages' },
]

export default function LogisticsPortal() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('queue')
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchShipments = useCallback(async () => {
    const res = await fetch('/api/admin/shipments')
    if (!res.ok) throw new Error('Failed to load')
    const data = await res.json()
    setShipments(data)
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
                onClick={() => setActiveTab(item.id)}
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

        <main className="aed-main">
          {activeTab === 'queue' ? (
            <QueueView
              shipments={shipments}
              loading={loading}
              onRefresh={fetchShipments}
            />
          ) : activeTab === 'warehouse' ? (
            <WarehouseView
              shipments={shipments}
              loading={loading}
              onRefresh={fetchShipments}
            />
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
  --white:#f4f1ea;--bone:#e6e2d8;--wg:#9e9484;--mg:#6b6357;
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
.btn-l{background:none;border:none;color:var(--bone);font-family:var(--fu);font-size:.72rem;cursor:pointer;text-decoration:underline;text-decoration-color:var(--accent);text-underline-offset:3px;padding:0;transition:color .2s}
.btn-l:hover{color:var(--accent)}
.inp{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(230,226,216,.18);padding:.75rem 0;font-family:var(--fu);font-size:.88rem;color:var(--bone);margin-bottom:1.5rem;transition:border-color .25s;outline:none}
.inp:focus{border-color:var(--accent)}
.inp::placeholder{color:var(--mg)}
select.inp option{background:#111009;color:var(--bone)}
.lbl{display:block;font-size:.58rem;color:var(--wg);text-transform:uppercase;letter-spacing:.12em;margin-bottom:.2rem}
.row{display:grid;align-items:center;gap:1.5rem;padding:1.5rem 0;border-bottom:1px solid var(--border)}
.row-title{font-family:var(--fd);font-size:1.1rem;color:var(--white);margin-bottom:.2rem}
.row-sub{font-size:.62rem;color:var(--wg);text-transform:uppercase;letter-spacing:.06em}
.overlay{position:fixed;inset:0;background:rgba(10,8,6,.75);backdrop-filter:blur(4px);z-index:100;opacity:0;pointer-events:none;transition:opacity .3s}
.overlay.open{opacity:1;pointer-events:all}
.panel{position:fixed;top:0;right:-640px;width:600px;max-width:100vw;height:100svh;background:var(--bg-r);border-left:1px solid var(--border-g);z-index:101;display:flex;flex-direction:column;transition:right .4s var(--ease);box-shadow:-20px 0 60px rgba(0,0,0,.6)}
.panel.open{right:0}
.panel-hdr{padding:2rem 2rem 1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;flex-shrink:0}
.panel-body{flex:1;padding:2rem;overflow-y:auto}
.panel-close{background:none;border:none;color:var(--wg);font-size:1.4rem;cursor:pointer;line-height:1;transition:color .2s;padding:0}
.panel-close:hover{color:var(--accent)}
.chat{display:flex;flex-direction:column;height:360px;margin-top:1.5rem}
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
@keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);border-top:1px solid var(--border);border-left:1px solid var(--border)}
.cal-hdr{padding:.75rem;font-size:.6rem;color:var(--wg);text-transform:uppercase;letter-spacing:.1em;text-align:right;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg-r)}
.cal-cell{min-height:110px;padding:.5rem;border-right:1px solid var(--border);border-bottom:1px solid var(--border);position:relative}
.cal-num{display:block;text-align:right;margin-bottom:.4rem;font-size:.75rem;color:var(--mg)}
.cal-cell.today .cal-num{color:var(--accent);font-weight:600}
.cal-evt{border-left:2px solid var(--accent);padding:.3rem .4rem;font-size:.6rem;color:var(--bone);margin-bottom:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cal-evt.wh{border-left-color:var(--ok);background:rgba(74,124,89,.1)}
.cal-evt.site{background:rgba(193,122,74,.1)}
@media(max-width:1100px){.aed-main{padding:3rem 2.5rem}}
@media(max-width:768px){
  .aed-wrap{flex-direction:column}
  .aed-sidebar{width:100%;min-width:0;height:auto;position:static;padding:1.25rem 1.5rem}
  .aed-nav{flex-direction:row;flex-wrap:wrap;gap:.5rem}
  .aed-nav-btn{font-size:.6rem;padding:.4rem .6rem}
  .aed-main{padding:2rem 1.25rem}
  .title{font-size:2rem}
  .panel{width:100%;right:-100%}
}
`
