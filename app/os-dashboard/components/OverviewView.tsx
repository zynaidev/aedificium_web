'use client'
// app/os-dashboard/components/OverviewView.tsx
import type { Project, Estimate, Claim } from '../page'

type Props = {
  projects: Project[]; estimates: Estimate[]; claims: Claim[]
  loading: boolean; onNavigate: (t: 'projects'|'estimates'|'claims') => void
}

export default function OverviewView({ projects, estimates, claims, loading, onNavigate }: Props) {
  const active   = projects.filter(p => p.status === 'active').length
  const transit  = projects.flatMap(p => p.shipments).filter(s => s.status.includes('transit')).length
  const quotes   = estimates.filter(e => e.status === 'Action Required: Review Quote').length
  const openCl   = claims.filter(c => c.status === 'Open').length

  return (
    <div>
      <div className="eyebrow">Project Intelligence</div>
      <h1 className="title">Welcome to the<br />Infrastructure.</h1>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'rgba(185,139,54,.12)',border:'1px solid rgba(185,139,54,.12)',marginBottom:'3.5rem'}}>
        {[
          {label:'Active Projects', val:active,  alert:false},
          {label:'In Transit',      val:transit, alert:false},
          {label:'Quotes to Review',val:quotes,  alert:quotes>0},
          {label:'Open Claims',     val:openCl,  alert:openCl>0},
        ].map(s => (
          <div key={s.label} style={{background:'var(--bg-r)',padding:'2rem',textAlign:'center'}}>
            {loading
              ? <div className="sk" style={{height:'2.5rem',width:'3rem',margin:'0 auto .5rem'}}/>
              : <div style={{fontFamily:'var(--fd)',fontSize:'3rem',fontWeight:300,color:s.alert?'var(--danger)':'var(--white)',lineHeight:1,marginBottom:'.5rem'}}>{s.val}</div>
            }
            <div style={{fontSize:'.6rem',color:'var(--wg)',textTransform:'uppercase',letterSpacing:'.12em'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}}>
        {[
          {n:'01',title:'New Specification',desc:'Upload a Bill of Quantities to begin sourcing and securing consolidated trade estimates.',btn:'Upload BOQ',tab:'estimates' as const},
          {n:'02',title:'Active Logistics',  desc:'Track the consolidation and delivery timeline of your currently approved specifications.',btn:'View Projects',tab:'projects' as const},
          {n:'03',title:'Claims & Warranties',desc:'Report damages or missing parts. We handle cross-border resolution with the manufacturer.',btn:'Open Claim',tab:'claims' as const},
        ].map(c => (
          <div key={c.n} className="card">
            <div className="card-num">{c.n}</div>
            <h3 className="card-title">{c.title}</h3>
            <p className="card-desc">{c.desc}</p>
            <button className="btn-g" style={{marginTop:'2rem',width:'100%'}} onClick={() => onNavigate(c.tab)}>{c.btn}</button>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {!loading && quotes > 0 && (
        <div style={{marginTop:'3rem',padding:'1.5rem 2rem',background:'rgba(168,54,90,.06)',border:'1px solid rgba(168,54,90,.25)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
          <div>
            <div style={{fontSize:'.65rem',color:'var(--danger)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.3rem'}}>Action Required</div>
            <div style={{fontSize:'.9rem',color:'var(--white)'}}>You have {quotes} quote{quotes>1?'s':''} awaiting review and approval.</div>
          </div>
          <button className="btn-p" onClick={() => onNavigate('estimates')}>Review Now</button>
        </div>
      )}
    </div>
  )
}
