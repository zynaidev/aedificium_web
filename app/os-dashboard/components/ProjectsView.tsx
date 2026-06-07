'use client'
// app/os-dashboard/components/ProjectsView.tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import type { Project, Shipment } from '../page'

type Msg = { id:string; sender_name:string; sender_role:string; message_body:string; created_at:string }

function badgeClass(s:string){ return s.includes('Delivered')||s==='Processing'?'ok':s==='On Hold'?'alert':s.includes('transit')||s.includes('Delivery')?'':'neutral' }

function ShipmentModal({projectId,onClose,onDone}:{projectId:string;onClose:()=>void;onDone:()=>void}) {
  const [f,setF]=useState({shipment_ref:'',destination_type:'Site',destination_address:'',contact_name:'',target_date:''})
  const [saving,setSaving]=useState(false)
  const [err,setErr]=useState('')
  const set=(k:string,v:string)=>setF(p=>({...p,[k]:v}))

  async function submit(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setErr('')
    const r=await fetch('/api/shipments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({project_id:projectId,...f})})
    if(r.ok){onDone();onClose()}else{const d=await r.json();setErr(d.error)}
    setSaving(false)
  }

  return (
    <div className="os-overlay open" onClick={onClose}>
      <div className="os-panel open" style={{width:'520px'}} onClick={e=>e.stopPropagation()}>
        <div className="os-panel-header">
          <div><div className="os-eyebrow" style={{marginBottom:'.2rem'}}>Logistics Request</div><div style={{fontFamily:'var(--os-fd)',fontSize:'1.6rem',color:'var(--os-white)'}}>Create Shipment</div></div>
          <button className="os-panel-close" onClick={onClose}>×</button>
        </div>
        <div className="os-panel-body">
          <form onSubmit={submit}>
            <label className="os-input-label">Shipment Reference / Name</label>
            <input className="os-input" placeholder="e.g. Phase 1: Lighting" value={f.shipment_ref} onChange={e=>set('shipment_ref',e.target.value)} required/>
            <label className="os-input-label">Destination Type</label>
            <select className="os-input" value={f.destination_type} onChange={e=>set('destination_type',e.target.value)}>
              <option value="Site">Construction Site</option>
              <option value="Warehouse (AEDIFICIUM)">Hold in AEDIFICIUM Warehouse</option>
              <option value="Warehouse (private)">Hold in Private Warehouse</option>
            </select>
            <label className="os-input-label">Delivery Address</label>
            <input className="os-input" placeholder="Full site address" value={f.destination_address} onChange={e=>set('destination_address',e.target.value)} required/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
              <div><label className="os-input-label">Target Delivery Date</label><input type="date" className="os-input" style={{colorScheme:'dark'}} value={f.target_date} onChange={e=>set('target_date',e.target.value)}/></div>
              <div><label className="os-input-label">Site Contact</label><input className="os-input" placeholder="Name & phone" value={f.contact_name} onChange={e=>set('contact_name',e.target.value)} required/></div>
            </div>
            {err&&<div style={{color:'var(--os-danger)',fontSize:'.75rem',marginBottom:'1rem'}}>{err}</div>}
            <button type="submit" className="os-btn-primary" style={{width:'100%'}} disabled={saving}>{saving?'Submitting...':'Submit Shipment Request'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

function ChatPanel({shipment,onClose}:{shipment:Shipment;onClose:()=>void}) {
  const [msgs,setMsgs]=useState<Msg[]>([])
  const [loading,setLoading]=useState(true)
  const [text,setText]=useState('')
  const [sending,setSending]=useState(false)
  const endRef=useRef<HTMLDivElement>(null)

  const load=useCallback(async ()=>{
    setLoading(true)
    const r=await fetch(`/api/messages?shipment_id=${shipment.id}`)
    if(r.ok)setMsgs(await r.json())
    setLoading(false)
  },[shipment.id])
  useEffect(()=>{load()},[load])
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[msgs])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    const r = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipment_id: shipment.id, message_body: text })
    })
    if (r.ok) {
      const msg = await r.json()
      setMsgs(p => [...p, msg])
      setText('')
    }
    setSending(false)
  }

  return (
    <>
      <div className="os-overlay open" onClick={onClose}/>
      <div className="os-panel open">
        <div className="os-panel-header">
          <div><div className="os-eyebrow" style={{marginBottom:'.2rem'}}>Shipment Details</div><div style={{fontFamily:'var(--os-fd)',fontSize:'1.4rem',color:'var(--os-white)'}}>{shipment.shipment_ref}</div></div>
          <button className="os-panel-close" onClick={onClose}>×</button>
        </div>
        <div className="os-panel-body">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'2rem',paddingBottom:'2rem',borderBottom:'1px solid var(--os-border)'}}>
            {[['Status',shipment.status],['Target Date',shipment.target_date??'TBD'],['Volume',shipment.cbm?`${shipment.cbm} CBM`:'TBD'],['Pallets',shipment.pallet_count??'TBD']].map(([l,v])=>(
              <div key={l}><div className="os-input-label">{l}</div><div style={{fontSize:'.85rem',color:'var(--os-accent)',marginTop:'.3rem'}}>{v}</div></div>
            ))}
          </div>
          <div className="os-eyebrow" style={{marginBottom:'1rem'}}>Logistics Chat</div>
          <div className="os-chat">
            <div className="os-chat-msgs">
              {loading
                ? <div style={{color:'var(--os-mid-gray)',fontSize:'.75rem',textAlign:'center',marginTop:'2rem'}}>Loading messages...</div>
                : msgs.length===0
                  ? <div style={{color:'var(--os-mid-gray)',fontSize:'.75rem',textAlign:'center',marginTop:'2rem'}}>No messages yet.</div>
                  : msgs.map(m=>(
                    <div key={m.id} className={`os-msg ${m.sender_role==='designer'?'os-msg-me':'os-msg-other'}`}>
                      <div>{m.message_body}</div>
                      <div className="os-msg-meta">{m.sender_name} · {new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                    </div>
                  ))
              }
              <div ref={endRef}/>
            </div>
            <form className="os-chat-form" onSubmit={send}>
              <input className="os-chat-input" placeholder="Message Logistics..." value={text} onChange={e=>setText(e.target.value)} required/>
              <button type="submit" className="os-chat-send" disabled={sending}>{sending?'...':'Send'}</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ProjectsView({projects,loading,onRefresh}:{projects:Project[];loading:boolean;onRefresh:()=>void}) {
  const [modal,setModal]=useState<string|null>(null)
  const [panel,setPanel]=useState<Shipment|null>(null)

  if(loading) return (
    <div>
      <div className="os-eyebrow">Project Tracking</div>
      <h1 className="os-page-title">Active Projects</h1>
      {[1,2].map(i=><div key={i} style={{background:'var(--os-bg-raised)',border:'1px solid var(--os-border)',padding:'2rem',marginBottom:'1.5rem'}}><div className="os-sk" style={{height:'1.2rem',width:'40%',marginBottom:'.75rem'}}/><div className="os-sk" style={{height:'.8rem',width:'20%'}}/></div>)}
    </div>
  )

  return (
    <div>
      <div className="os-eyebrow">Project Tracking</div>
      <h1 className="os-page-title">Active Projects</h1>

      <p style={{fontSize:'0.78rem',color:'var(--os-warm-gray)',fontStyle:'italic',marginBottom:'2rem'}}>
        To start a new project, upload a BOQ in Estimates & Quotes — your AEDIFICIUM contact will create the project once the specification is reviewed.
      </p>

      {projects.length===0
        ? <p style={{color:'var(--os-mid-gray)',fontSize:'.88rem'}}>No active projects yet. Your AEDIFICIUM contact will create a project once your first specification is approved.</p>
        : projects.map(p=>(
          <div key={p.id} style={{background:'rgba(17,16,9,.4)',border:'1px solid var(--os-border)',padding:'2rem',marginBottom:'1.5rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--os-border)',paddingBottom:'1.5rem',marginBottom:'1.5rem'}}>
              <div>
                <div style={{fontFamily:'var(--os-fd)',fontSize:'1.5rem',color:'var(--os-white)',marginBottom:'.3rem'}}>{p.name}</div>
                <div className="os-row-sub">Ref: {p.ref_number}</div>
              </div>
              <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
                <span className={`os-badge ${badgeClass(p.status)}`}>{p.status}</span>
                <button className="os-btn-primary" style={{padding:'.6rem 1.2rem'}} onClick={()=>setModal(p.id)}>+ Shipment</button>
              </div>
            </div>
            {p.shipments.length===0
              ? <div style={{fontSize:'.75rem',color:'var(--os-mid-gray)'}}>No shipments requested yet.</div>
              : p.shipments.map(s=>(
                <div key={s.id} style={{display:'grid',gridTemplateColumns:'2fr 1.5fr 1fr auto',alignItems:'center',gap:'1rem',padding:'1rem',background:'var(--os-bg)',border:'1px solid var(--os-border)',marginBottom:'.5rem',transition:'border-color .25s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(193,122,74,.35)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--os-border)'}
                >
                  <div><div style={{fontSize:'.88rem',color:'var(--os-bone)',marginBottom:'.2rem'}}>{s.shipment_ref}</div><div className="os-row-sub">{s.destination_type??'—'}</div></div>
                  <span className={`os-badge ${badgeClass(s.status)}`} style={{fontSize:'.55rem'}}>{s.status}</span>
                  <div style={{fontSize:'.75rem',color:'var(--os-bone)'}}>{s.target_date??'TBD'}</div>
                  <button className="os-btn-link" onClick={()=>setPanel(s)}>Details & Chat</button>
                </div>
              ))
            }
          </div>
        ))
      }

      {modal && <ShipmentModal projectId={modal} onClose={()=>setModal(null)} onDone={()=>{onRefresh();setModal(null)}}/>}
      {panel && <ChatPanel shipment={panel} onClose={()=>setPanel(null)}/>}
    </div>
  )
}
