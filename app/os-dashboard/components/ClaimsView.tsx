'use client'
// app/os-dashboard/components/ClaimsView.tsx
import { useState, useRef } from 'react'
import { useSession } from '@/lib/auth-client'
import type { Claim, Project } from '../page'

function badgeClass(s:string){return s==='Resolved'||s==='Closed'?'ok':s==='Open'?'alert':''}

function fileLabel(files: FileList | null | undefined): string {
  if (!files?.length) return 'Upload Photos or Documents (multiple files allowed)'
  if (files.length === 1) return files[0].name
  return `${files.length} files selected`
}

export default function ClaimsView({claims,projects,loading,onRefresh}:{claims:Claim[];projects:Project[];loading:boolean;onRefresh:()=>void}) {
  const { data: session } = useSession()
  const [f,setF]=useState({project_id:'',item_name:'',issue_type:'',description:''})
  const [fileName,setFileName]=useState('')
  const [busy,setBusy]=useState(false)
  const [uploadProgress,setUploadProgress]=useState({n:0,total:0})
  const [msg,setMsg]=useState('')
  const fileRef=useRef<HTMLInputElement>(null)
  const set=(k:string,v:string)=>setF(p=>({...p,[k]:v}))

  async function submit(e:React.FormEvent){
    e.preventDefault()
    const files=fileRef.current?.files
    if(!files?.length){setMsg('Please attach a photo or document.');return}
    if(!session?.user?.id){setMsg('Error: Not authenticated.');return}

    setBusy(true); setMsg('')
    const fileList=Array.from(files)
    const urls:string[]=[]

    try {
      for(let i=0;i<fileList.length;i++){
        setUploadProgress({n:i+1,total:fileList.length})
        const file=fileList[i]
        const uploadFd=new FormData()
        uploadFd.append('file',file)
        uploadFd.append('type','claim')
        uploadFd.append('userId',session.user.id)
        const uploadRes=await fetch('/api/upload',{method:'POST',body:uploadFd})
        if(!uploadRes.ok)throw new Error('Upload failed')
        const {url}=await uploadRes.json()
        urls.push(url)
      }

      const fd=new FormData()
      Object.entries(f).forEach(([k,v])=>{if(v)fd.append(k,v)})
      fd.append('file_url',urls.join(','))

      const r=await fetch('/api/claims',{method:'POST',body:fd})
      if(r.ok){
        setMsg('Claim submitted. AEDIFICIUM will contact you within 48 hours.')
        setF({project_id:'',item_name:'',issue_type:'',description:''})
        setFileName('')
        if(fileRef.current)fileRef.current.value=''
        onRefresh()
      }else{
        const d=await r.json()
        setMsg(`Error: ${d.error}`)
      }
    }catch{
      setMsg('Error: Upload failed.')
    }finally{
      setBusy(false)
      setUploadProgress({n:0,total:0})
    }
  }

  const submitLabel=busy&&uploadProgress.total>0
    ?`Uploading ${uploadProgress.n} of ${uploadProgress.total}...`
    :busy?'Submitting...':'Submit to AEDIFICIUM'

  return (
    <div>
      <div className="os-eyebrow">One-Click Claims</div>
      <h1 className="os-page-title">Resolution Center</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem'}}>
        <div>
          <div style={{fontFamily:'var(--os-fd)',fontSize:'1.3rem',color:'var(--os-white)',marginBottom:'2rem'}}>File a New Claim</div>
          <form onSubmit={submit}>
            <label className="os-input-label">Project</label>
            <select className="os-input" value={f.project_id} onChange={e=>set('project_id',e.target.value)}>
              <option value="">Select Project (optional)</option>
              {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <label className="os-input-label">Brand & Item</label>
            <input className="os-input" placeholder="e.g. Flos Arco Floor Lamp" value={f.item_name} onChange={e=>set('item_name',e.target.value)} required/>
            <label className="os-input-label">Issue Type</label>
            <select className="os-input" value={f.issue_type} onChange={e=>set('issue_type',e.target.value)} required>
              <option value="" disabled>Select issue type</option>
              <option value="Damage on Arrival">Damage on Arrival</option>
              <option value="Missing Parts">Missing Parts / Hardware</option>
              <option value="Warranty Claim">Warranty Claim (Post-Install)</option>
              <option value="Order Modification">Order Modification / Cancellation</option>
            </select>
            <label className="os-input-label">Description</label>
            <input className="os-input" placeholder="Brief description" value={f.description} onChange={e=>set('description',e.target.value)}/>
            <div className="os-dz-wrap">
              <input type="file" id="cl-f" ref={fileRef} accept="image/*,.pdf" multiple required onChange={e=>setFileName(fileLabel(e.target.files))}/>
              <label htmlFor="cl-f" className="os-dz"><div className="os-dz-icon">＋</div><div className="os-dz-text">{fileName||'Upload Photos or Documents (multiple files allowed)'}</div></label>
            </div>
            <button type="submit" className="os-btn-primary" style={{width:'100%'}} disabled={busy}>{submitLabel}</button>
            {msg&&<div style={{marginTop:'1rem',padding:'1rem',border:`1px solid ${msg.startsWith('Error')?'var(--os-danger)':'var(--os-border-gold)'}`,color:msg.startsWith('Error')?'var(--os-danger)':'var(--os-bone)',fontSize:'.78rem',textAlign:'center',lineHeight:1.5}}>{msg}</div>}
          </form>
        </div>
        <div>
          <div style={{fontFamily:'var(--os-fd)',fontSize:'1.3rem',color:'var(--os-white)',marginBottom:'2rem'}}>Active Claims</div>
          {loading
            ? [1,2].map(i=><div key={i} style={{border:'1px solid var(--os-border)',padding:'1.5rem',marginBottom:'1rem'}}><div className="os-sk" style={{height:'1rem',width:'60%',marginBottom:'.75rem'}}/><div className="os-sk" style={{height:'.7rem',width:'40%'}}/></div>)
            : claims.length===0
              ? <p style={{color:'var(--os-mid-gray)',fontSize:'.85rem'}}>No active claims.</p>
              : claims.map(c=>(
                <div key={c.id} style={{border:'1px solid var(--os-border)',padding:'1.5rem',background:'rgba(17,16,9,.3)',marginBottom:'1rem',transition:'border-color .25s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--os-border-gold)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--os-border)'}
                >
                  <div style={{fontFamily:'var(--os-fd)',fontSize:'1rem',color:'var(--os-white)',marginBottom:'.3rem'}}>{c.item_name}</div>
                  <div className="os-row-sub" style={{marginBottom:'.75rem'}}>{c.issue_type}</div>
                  {c.project_name&&<div style={{fontSize:'.7rem',color:'var(--os-warm-gray)',marginBottom:'.75rem'}}>Project: {c.project_name}</div>}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span className={`os-badge ${badgeClass(c.status)}`}>{c.status}</span>
                    <div style={{fontSize:'.65rem',color:'var(--os-mid-gray)'}}>Filed {new Date(c.created_at).toLocaleDateString()}</div>
                  </div>
                  {c.file_url&&<button className="os-btn-link" style={{marginTop:'.75rem',fontSize:'.65rem'}} onClick={()=>window.open(c.file_url!,'_blank')}>View Evidence ↗</button>}
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}
