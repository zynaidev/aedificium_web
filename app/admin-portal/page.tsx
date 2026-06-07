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

  return (
    <div className="os-wrap">
      <aside className="os-sidebar">
        <div className="os-sidebar-logo">
          AEDIFICIUM <span style={{ color: 'var(--os-accent)' }}>HQ</span>
        </div>
        <nav className="os-nav">
          {NAV.map((item, idx) => (
            <button
              key={item.id}
              className={`os-nav-btn${activeTab === item.id ? ' active' : ''}${idx === 6 ? ' os-nav-sep' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {activeTab === item.id && <span className="os-nav-dot" />}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="os-user-block">
          <div className="os-user-studio">Admin</div>
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

      <main className="os-main">
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              fontFamily: 'var(--os-fd)',
              fontSize: '1.75rem',
              fontWeight: 300,
              color: 'var(--os-warm-gray)',
              letterSpacing: '0.02em',
            }}
          >
            {TAB_PLACEHOLDER[activeTab]}
          </div>
        )}
      </main>
    </div>
  )
}
