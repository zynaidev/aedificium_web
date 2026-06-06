'use client'
// app/os-dashboard/components/ClaimsView.tsx
import { useState, useRef } from 'react'
import type { Claim, Project } from '../page'

function badgeClass(s:string){return s==='Resolved'||s==='Closed'?'ok':s==='Open'?'alert':''}

export default function ClaimsView({claims,projects,loading,onRefresh}:{claims:Claim[];projects:Project[];loading:boolean;onRefresh:()=>void}) {
  const [f,setF]=useState({project_id:'',item_name:'',issue_type:'',description:''})
  const [fileName,setFileName]=useState('')
  const [busy,setBusy]=useState(false)
  const [msg,setMsg]=useState('')
  const fileRef=useRef<HTMLInputElement>(null)
  const set=(k:string,v:string)=>setF(p=>({...p,[k]:v}))

  async function submit(e:React.FormEvent){
    e.preventDefault()
    if(!fileRef.current?.files?.[0]){setMsg('Please attach a photo or document.');return}
    setBusy(true); setMsg('')
    const fd=new FormData()
    Object.entries(f).forEach(([k,v])=>{if(v)fd.append(k,v)})
    fd.append('file',fileRef.current.files[0])
    const r=await fetch('/api/claims',{method:'POST',body:fd})
    if(r.ok){setMsg('Claim submitted. AEDIFICIUM will contact you within 48 hours.');setF({project_id:'',item_name:'',issue_type:'',description:''});setFileName('');if(fileRef.current)fileRef.current.value='';onRefresh()}
    else{const d=await r.json();setMsg(`Error: ${d.error}`)}
    setBusy(false)
  }

  return (
    <div>
      <div className="eyebrow">One-Click Claims</div>
      <h1 className="title">Resolution Center</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem'}}>
        <div>
          <div style={{fontFamily:'var(--fd)',fontSize:'1.3rem',color:'var(--white)',marginBottom:'2rem'}}>File a New Claim</div>
          <form onSubmit={submit}>
            <label className="lbl">Project</label>
            <select className="inp" value={f.project_id} onChange={e=>set('project_id',e.target.value)}>
              <option value="">Select Project (optional)</option>
              {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <label className="lbl">Brand & Item</label>
            <input className="inp" placeholder="e.g. Flos Arco Floor Lamp" value={f.item_name} onChange={e=>set('item_name',e.target.value)} required/>
            <label className="lbl">Issue Type</label>
            <select className="inp" value={f.issue_type} onChange={e=>set('issue_type',e.target.value)} required>
              <option value="" disabled>Select issue type</option>
              <option value="Damage on Arrival">Damage on Arrival</option>
              <option value="Missing Parts">Missing Parts / Hardware</option>
              <option value="Warranty Claim">Warranty Claim (Post-Install)</option>
              <option value="Order Modification">Order Modification / Cancellation</option>
            </select>
            <label className="lbl">Description</label>
            <input className="inp" placeholder="Brief description" value={f.description} onChange={e=>set('description',e.target.value)}/>
            <div className="dz-wrap">
              <input type="file" id="cl-f" ref={fileRef} accept="image/*,.pdf" required onChange={e=>setFileName(e.target.files?.[0]?.name??'')}/>
              <label htmlFor="cl-f" className="dz"><div className="dz-icon">＋</div><div className="dz-text">{fileName||'Upload Photo or PDF (max 5MB)'}</div></label>
            </div>
            <button type="submit" className="btn-p" style={{width:'100%'}} disabled={busy}>{busy?'Submitting...':'Submit to AEDIFICIUM'}</button>
            {msg&&<div style={{marginTop:'1rem',padding:'1rem',border:`1px solid ${msg.startsWith('Error')?'var(--danger)':'var(--border-g)'}`,color:msg.startsWith('Error')?'var(--danger)':'var(--bone)',fontSize:'.78rem',textAlign:'center',lineHeight:1.5}}>{msg}</div>}
          </form>
        </div>
        <div>
          <div style={{fontFamily:'var(--fd)',fontSize:'1.3rem',color:'var(--white)',marginBottom:'2rem'}}>Active Claims</div>
          {loading
            ? [1,2].map(i=><div key={i} style={{border:'1px solid var(--border)',padding:'1.5rem',marginBottom:'1rem'}}><div className="sk" style={{height:'1rem',width:'60%',marginBottom:'.75rem'}}/><div className="sk" style={{height:'.7rem',width:'40%'}}/></div>)
            : claims.length===0
              ? <p style={{color:'var(--mg)',fontSize:'.85rem'}}>No active claims.</p>
              : claims.map(c=>(
                <div key={c.id} style={{border:'1px solid var(--border)',padding:'1.5rem',background:'rgba(17,16,9,.3)',marginBottom:'1rem',transition:'border-color .25s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-g)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
                >
                  <div style={{fontFamily:'var(--fd)',fontSize:'1rem',color:'var(--white)',marginBottom:'.3rem'}}>{c.item_name}</div>
                  <div className="row-sub" style={{marginBottom:'.75rem'}}>{c.issue_type}</div>
                  {c.project_name&&<div style={{fontSize:'.7rem',color:'var(--wg)',marginBottom:'.75rem'}}>Project: {c.project_name}</div>}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span className={`badge ${badgeClass(c.status)}`}>{c.status}</span>
                    <div style={{fontSize:'.65rem',color:'var(--mg)'}}>Filed {new Date(c.created_at).toLocaleDateString()}</div>
                  </div>
                  {c.file_url&&<button className="btn-l" style={{marginTop:'.75rem',fontSize:'.65rem'}} onClick={()=>window.open(c.file_url!,'_blank')}>View Evidence ↗</button>}
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}
