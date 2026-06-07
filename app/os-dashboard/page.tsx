'use client'
// app/os-dashboard/page.tsx

import { useEffect, useState, useCallback } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import type { OSUser } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import OverviewView from './components/OverviewView'
import ProjectsView from './components/ProjectsView'
import EstimatesView from './components/EstimatesView'
import LogisticsView from './components/LogisticsView'
import ClaimsView from './components/ClaimsView'
import BrandsView from './components/BrandsView'

export type Shipment = {
  id: string
  project_id: string
  shipment_ref: string
  status: string
  destination_type: string | null
  destination_address: string | null
  contact_name: string | null
  target_date: string | null
  cbm: number | null
  pallet_count: number | null
  tracking_number: string | null
}

export type Project = {
  id: string
  name: string
  ref_number: string
  status: string
  studio_name: string | null
  eta_date: string | null
  shipments: Shipment[]
}

export type QuoteItem = {
  id: string
  brand: string
  item_description: string
  quantity: number
  rrp_eur: number
  unit_price_eur: number
  lead_time_weeks: number | null
}

export type Estimate = {
  id: string
  project_name: string
  status: string
  file_url: string | null
  invoice_url: string | null
  total_value_eur: number | null
  created_at: string
  quote_items: QuoteItem[]
}

export type Claim = {
  id: string
  project_id: string | null
  project_name: string | null
  item_name: string
  issue_type: string
  description: string | null
  file_url: string | null
  status: string
  created_at: string
}

type Tab = 'overview' | 'projects' | 'estimates' | 'logistics' | 'claims' | 'brands'

const NAV: { id: Tab; label: string }[] = [
  { id: 'overview',  label: 'Overview' },
  { id: 'projects',  label: 'Active Projects' },
  { id: 'estimates', label: 'Estimates & Quotes' },
  { id: 'logistics', label: 'Logistics Calendar' },
  { id: 'claims',    label: 'Resolution Center' },
  { id: 'brands',    label: 'Brand Library' },
]

export default function OSDashboard() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [projects,  setProjects]  = useState<Project[]>([])
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [claims,    setClaims]    = useState<Claim[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (!isPending && !session) router.replace('/os-login')
  }, [session, isPending, router])

  useEffect(() => {
    if (isPending || !session) return
    const user = session.user as unknown as OSUser
    if (user.role === 'admin') {
      router.replace('/admin-portal')
      return
    }
    if (user.role === 'logistics') {
      router.replace('/logistics-portal')
      return
    }
    if (user.is_active === false) {
      router.replace('/os-login')
      return
    }
  }, [session, isPending, router])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [p, e, c] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/estimates'),
        fetch('/api/claims'),
      ])
      if (p.ok) setProjects(await p.json())
      if (e.ok) setEstimates(await e.json())
      if (c.ok) setClaims(await c.json())
    } catch (err) {
      console.error('Dashboard fetch error', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session) fetchAll()
  }, [session, fetchAll])

  if (isPending || !session) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'var(--os-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--os-accent)', fontSize: '0.75rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: 'Inter, sans-serif',
      }}>
        Authenticating Identity...
      </div>
    )
  }

  const user = session.user as unknown as OSUser

  return (
    <div className="os-wrap">

      {/* Sidebar */}
      <aside className="os-sidebar">
        <div className="os-sidebar-logo">
          <span className="os-wordmark-aedificium">AEDIFICIUM</span>{' '}
          <span className="os-wordmark-os">OS</span>
        </div>
        <nav className="os-nav">
          {NAV.map((item, idx) => (
            <button
              key={item.id}
              className={`os-nav-btn${activeTab === item.id ? ' active' : ''}${idx === 5 ? ' os-nav-sep' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {activeTab === item.id && <span className="os-nav-dot" />}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="os-user-block">
          <div className="os-user-studio">{user.studio_name ?? 'Studio'}</div>
          <div className="os-user-email">{user.email}</div>
          <button className="os-logout" onClick={async () => { await signOut(); router.replace('/os-login') }}>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="os-main">
        {activeTab === 'overview'  && <OverviewView  projects={projects} estimates={estimates} claims={claims} loading={loading} onNavigate={setActiveTab} />}
        {activeTab === 'projects'  && <ProjectsView  projects={projects} loading={loading} onRefresh={fetchAll} />}
        {activeTab === 'estimates' && <EstimatesView estimates={estimates} loading={loading} onRefresh={fetchAll} />}
        {activeTab === 'logistics' && <LogisticsView projects={projects} />}
        {activeTab === 'claims'    && <ClaimsView    claims={claims} projects={projects} loading={loading} onRefresh={fetchAll} />}
        {activeTab === 'brands'    && <BrandsView />}
      </main>

    </div>
  )
}
