'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import type { OSUser } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import AccessRequestsView from './components/AccessRequestsView'
import UsersView from './components/UsersView'
import ProjectsView from './components/ProjectsView'
import EstimatesView from './components/EstimatesView'
import ClaimsView from './components/ClaimsView'
import ShipmentsView from './components/ShipmentsView'
import OverviewView from './components/OverviewView'

type Tab =
  | 'overview'
  | 'access-requests'
  | 'users'
  | 'projects'
  | 'estimates'
  | 'claims'
  | 'shipments'

const NAV: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'access-requests', label: 'Access Requests' },
  { id: 'users', label: 'Users' },
  { id: 'projects', label: 'Projects' },
  { id: 'estimates', label: 'Estimates & Quotes' },
  { id: 'claims', label: 'Claims' },
  { id: 'shipments', label: 'Shipments' },
]

const TAB_PLACEHOLDER: Record<Tab, string> = {
  overview: 'Overview — coming soon',
  'access-requests': 'Access Requests — coming soon',
  users: 'Users — coming soon',
  projects: 'Projects — coming soon',
  estimates: 'Estimates & Quotes — coming soon',
  claims: 'Claims — coming soon',
  shipments: 'Shipments — coming soon',
}

export default function AdminPortal() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    if (isPending) return
    if (!session) {
      router.replace('/os-login')
      return
    }
    const user = session.user as unknown as OSUser
    if (user.role !== 'admin') {
      if (user.role === 'logistics') router.replace('/logistics-portal')
      else router.replace('/os-dashboard')
      return
    }
    if (user.is_active === false) {
      router.replace('/os-login')
      return
    }
  }, [session, isPending, router])

  const user = session?.user as unknown as OSUser | undefined
  const isAdmin = user?.role === 'admin'

  if (isPending || !session || !isAdmin) {
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
            {NAV.map((item, idx) => (
              <button
                key={item.id}
                className={`aed-nav-btn${activeTab === item.id ? ' active' : ''}${idx === 6 ? ' sep' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {activeTab === item.id && <span className="dot" />}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="aed-user">
            <div className="aed-user-studio">Admin</div>
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
          {activeTab === 'overview' ? (
            <OverviewView />
          ) : activeTab === 'access-requests' ? (
            <AccessRequestsView />
          ) : activeTab === 'users' ? (
            <UsersView />
          ) : activeTab === 'projects' ? (
            <ProjectsView />
          ) : activeTab === 'estimates' ? (
            <EstimatesView />
          ) : activeTab === 'claims' ? (
            <ClaimsView />
          ) : activeTab === 'shipments' ? (
            <ShipmentsView />
          ) : (
            <div className="admin-placeholder">{TAB_PLACEHOLDER[activeTab]}</div>
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
.aed-nav-btn.sep{margin-top:1.25rem;padding-top:1.5rem;border-top:1px solid var(--border)}
.aed-user{border-top:1px solid var(--border);padding-top:1.5rem;margin-top:1.5rem}
.aed-user-studio{font-family:var(--fd);font-size:1rem;color:var(--white);margin-bottom:0.3rem}
.aed-user-email{font-size:0.62rem;color:var(--mg);margin-bottom:1rem;word-break:break-all}
.aed-logout{background:none;border:none;color:var(--danger);font-family:var(--fu);font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;padding:0;transition:opacity .2s}
.aed-logout:hover{opacity:.7}
.aed-main{flex:1;padding:4rem 5rem;overflow-x:hidden;min-width:0}
.admin-placeholder{display:flex;align-items:center;justify-content:center;min-height:50vh;font-family:var(--fd);font-size:1.75rem;font-weight:300;color:var(--wg);letter-spacing:0.02em}
/* Shared */
.eyebrow{font-size:0.62rem;color:var(--accent);letter-spacing:0.22em;text-transform:uppercase;margin-bottom:0.75rem}
.title{font-family:var(--fd);font-size:2.8rem;font-weight:300;color:var(--white);line-height:1.1;margin-bottom:3.5rem}
.card{background:rgba(17,16,9,.5);border:1px solid var(--border);padding:2.5rem 2rem;transition:transform .3s var(--ease),border-color .3s}
.card:hover{transform:translateY(-3px);border-color:var(--border-g)}
.card-num{font-size:0.65rem;color:var(--accent);letter-spacing:.15em;margin-bottom:1.25rem}
.card-title{font-family:var(--fd);font-size:1.3rem;color:var(--white);margin-bottom:.75rem}
.card-desc{font-size:.8rem;color:var(--mg);line-height:1.65}
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
@media(max-width:1100px){.aed-main{padding:3rem 2.5rem}}
@media(max-width:768px){
  .aed-wrap{flex-direction:column}
  .aed-sidebar{width:100%;min-width:0;height:auto;position:static;padding:1.25rem 1.5rem}
  .aed-nav{flex-direction:row;flex-wrap:wrap;gap:.5rem}
  .aed-nav-btn{font-size:.6rem;padding:.4rem .6rem}
  .aed-main{padding:2rem 1.25rem}
  .title{font-size:2rem}
}
`
