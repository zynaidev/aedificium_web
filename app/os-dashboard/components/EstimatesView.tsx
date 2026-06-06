'use client'
// app/os-dashboard/components/EstimatesView.tsx
import { useState, useRef } from 'react'
import type { Estimate, QuoteItem } from '../page'

function badgeClass(s:string){ return s==='Action Required: Review Quote'?'alert':s==='Approved'||s==='Invoice Issued'?'ok':s==='Closed'?'neutral':'' }

function LedgerPanel({est,onClose,onApproved}:{est:Estimate;onClose:()=>void;onApproved:()=>void}) {
  const [busy,setBusy]=useState(false)
  const items:QuoteItem[]=est.quote_items??[]
  const rrp=items.reduce((s,i)=>s+i.rrp_eur*i.quantity,0)
  const trade=items.reduce((s,i)=>s+i.unit_price_eur*i.quantity,0)
  const fmt=(n:number)=>n.toLocaleString('en-EU',{minimumFractionDigits:2})

  async function approve(){
    if(!confirm('By approving, you authorise AEDIFICIUM to proceed with execution.'))return
    setBusy(true)
    const r=await fetch('/api/estimates',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:est.id,status:'Approved'})})
    if(r.ok){onApproved();onClose()}
    setBusy(false)
  }

  return (
    <>
      <div className="overlay open" onClick={onClose}/>
      <div className="panel open">
        <div className="panel-hdr">
          <div><div className="eyebrow" style={{marginBottom:'.2rem'}}>Specification Ledger</div><div style={{fontFamily:'var(--fd)',fontSize:'1.4rem',color:'var(--white)'}}>{est.project_name}</div></div>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>
        <div className="panel-body">
          <div style={{display:'grid',gridTemplateColumns:'2fr .6fr 1fr 1fr',gap:'1rem',paddingBottom:'.75rem',borderBottom:'1px solid rgba(185,139,54,.25)',marginBottom:'.5rem'}}>
            {['Item','Qty','RRP','Trade Price'].map(h=><div key={h} style={{fontSize:'.6rem',color:'var(--accent)',textTransform:'uppercase',letterSpacing:'.1em'}}>{h}</div>)}
          </div>
          {items.length===0
            ? <div style={{color:'var(--mg)',fontSize:'.8rem',padding:'2rem 0'}}>Quote items not yet available.</div>
            : items.map(i=>(
              <div key={i.id} style={{display:'grid',gridTemplateColumns:'2fr .6fr 1fr 1fr',gap:'1rem',padding:'.9rem 0',borderBottom:'1px solid var(--border)',fontSize:'.8rem',color:'var(--wg)'}}>
                <div><div style={{color:'var(--bone)',marginBottom:'.2rem',fontWeight:500}}>{i.brand}</div>{i.item_description}{i.lead_time_weeks&&<div style={{fontSize:'.6rem',color:'var(--mg)',marginTop:'.2rem'}}>Lead: {i.lead_time_weeks}w</div>}</div>
                <div style={{color:'var(--bone)'}}>{i.quantity}</div>
                <div style={{textDecoration:'line-through'}}>€{fmt(i.rrp_eur)}</div>
                <div style={{color:'var(--white)'}}>€{fmt(i.unit_price_eur)}</div>
              </div>
            ))
          }
          <div style={{marginTop:'2rem',padding:'1.5rem 2rem',background:'rgba(17,16,9,.6)',border:'1px solid rgba(185,139,54,.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.75rem',fontSize:'.82rem',color:'var(--wg)'}}><span>Total RRP</span><span>€{fmt(rrp)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem',fontSize:'.82rem',color:'var(--accent)'}}><span>Trade Savings</span><span>−€{fmt(rrp-trade)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',paddingTop:'1rem',borderTop:'1px solid rgba(230,226,216,.1)',fontFamily:'var(--fd)',fontSize:'2rem',color:'var(--white)'}}><span>Final Trade Price</span><span>€{fmt(trade)}</span></div>
          </div>
          <div style={{marginTop:'1.5rem'}}>
            {est.status==='Action Required: Review Quote'&&<button className="btn-p" style={{width:'100%'}} disabled={busy} onClick={approve}>{busy?'Approving...':'Approve & Request Invoice'}</button>}
            {est.status==='Approved'&&<div style={{textAlign:'center',padding:'1rem',border:'1px solid var(--wg)',color:'var(--bone)',fontSize:'.75rem',textTransform:'uppercase'}}>Quote Approved — Awaiting Pro-Forma Invoice</div>}
            {est.status==='Invoice Issued'&&est.invoice_url&&<button className="btn-p" style={{width:'100%',background:'var(--bone)',color:'#0a0806'}} onClick={()=>window.open(est.invoice_url!,'_blank')}>Download Pro-Forma Invoice</button>}
          </div>
        </div>
      </div>
    </>
  )
}

export default function EstimatesView({estimates,loading,onRefresh}:{estimates:Estimate[];loading:boolean;onRefresh:()=>void}) {
  const [sel,setSel]=useState<Estimate|null>(null)
  const [fileName,setFileName]=useState('')
  const [projName,setProjName]=useState('')
  const [busy,setBusy]=useState(false)
  const [msg,setMsg]=useState('')
  const fileRef=useRef<HTMLInputElement>(null)

  async function upload(e:React.FormEvent){
    e.preventDefault(); if(!fileRef.current?.files?.[0]||!projName)return
    setBusy(true); setMsg('')
    const fd=new FormData(); fd.append('project_name',projName); fd.append('file',fileRef.current.files[0])
    const r=await fetch('/api/estimates',{method:'POST',body:fd})
    if(r.ok){setMsg('BOQ submitted. Our team will return a consolidated quotation shortly.');setProjName('');setFileName('');if(fileRef.current)fileRef.current.value='';onRefresh()}
    else{const d=await r.json();setMsg(`Error: ${d.error}`)}
    setBusy(false)
  }

  return (
    <div>
      <div className="eyebrow">Sourcing</div>
      <h1 className="title">Estimates & Quotes</h1>

      <div style={{background:'rgba(17,16,9,.5)',border:'1px solid rgba(185,139,54,.2)',padding:'3rem',marginBottom:'4rem'}}>
        <div style={{fontFamily:'var(--fd)',fontSize:'1.6rem',color:'var(--white)',marginBottom:'.75rem'}}>Request New Estimate</div>
        <p style={{fontSize:'.8rem',color:'var(--mg)',lineHeight:1.65,marginBottom:'2rem'}}>Upload your Bill of Quantities (Excel/PDF). Our team will audit the specification, verify lead times across all brands, and return a consolidated trade quotation.</p>
        <form onSubmit={upload}>
          <input className="inp" placeholder="Project Name (e.g. Balaton Villa)" value={projName} onChange={e=>setProjName(e.target.value)} required/>
          <div className="dz-wrap">
            <input type="file" id="boq-f" ref={fileRef} accept=".pdf,.xls,.xlsx,.csv" required onChange={e=>setFileName(e.target.files?.[0]?.name??'')}/>
            <label htmlFor="boq-f" className="dz"><div className="dz-icon">＋</div><div className="dz-text">{fileName||'Click to browse or drag BOQ file here (PDF / Excel)'}</div></label>
          </div>
          <button type="submit" className="btn-p" style={{width:'100%'}} disabled={busy}>{busy?'Uploading...':'Upload Specification File'}</button>
          {msg&&<div style={{marginTop:'1rem',padding:'1rem',border:`1px solid ${msg.startsWith('Error')?'var(--danger)':'var(--border-g)'}`,color:msg.startsWith('Error')?'var(--danger)':'var(--bone)',fontSize:'.8rem',textAlign:'center'}}>{msg}</div>}
        </form>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1.5rem',paddingBottom:'1rem',borderBottom:'1px solid var(--border)'}}>
        <div className="row-sub">Recent Requests</div><div className="row-sub">Status</div>
      </div>

      {loading
        ? [1,2,3].map(i=><div key={i} className="row" style={{gridTemplateColumns:'2fr 1.5fr 1fr'}}><div className="sk" style={{height:'1rem',width:'60%'}}/><div className="sk" style={{height:'1.2rem',width:'40%'}}/><div className="sk" style={{height:'1rem',width:'30%'}}/></div>)
        : estimates.length===0
          ? <p style={{color:'var(--mg)',fontSize:'.88rem'}}>No estimates requested yet.</p>
          : estimates.map(e=>{
            const action=e.status==='Action Required: Review Quote'
            return (
              <div key={e.id} className="row" style={{gridTemplateColumns:'2fr 1.5fr 1fr auto'}}>
                <div><div className="row-title">{e.project_name}</div><div className="row-sub">Submitted: {new Date(e.created_at).toLocaleDateString()}</div></div>
                <span className={`badge ${badgeClass(e.status)}`}>{e.status}</span>
                <div style={{fontSize:'.8rem',color:e.total_value_eur?'var(--bone)':'var(--mg)'}}>{e.total_value_eur?`€${e.total_value_eur.toLocaleString()}`:'—'}</div>
                <button className="btn-l" style={{color:action?'var(--danger)':'var(--bone)',fontWeight:action?500:400}} onClick={()=>setSel(e)}>{action?'Review Quote ↗':'View Ledger'}</button>
              </div>
            )
          })
      }
      {sel&&<LedgerPanel est={sel} onClose={()=>setSel(null)} onApproved={onRefresh}/>}
    </div>
  )
}
