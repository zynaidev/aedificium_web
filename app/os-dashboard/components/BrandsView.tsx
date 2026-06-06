'use client'
// app/os-dashboard/components/BrandsView.tsx
import { useEffect, useState } from 'react'

type Brand = { id:number; name:string; category:string; url:string|null }

type Filter = { label: string; value: string }

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function BrandsView() {
  const [brands,setBrands]=useState<Brand[]>([])
  const [filters,setFilters]=useState<Filter[]>([{label:'All',value:'all'}])
  const [filter,setFilter]=useState('all')
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')

  useEffect(()=>{
    fetch('/api/brands').then(r=>r.json()).then(d=>{setBrands(d);setLoading(false)}).catch(()=>{setError('Failed to load brand network.');setLoading(false)})
    fetch('/api/brands?categories=true')
      .then(r=>r.json())
      .then((cats:string[])=>{
        setFilters([
          {label:'All',value:'all'},
          ...cats.map((cat)=>({label:toTitleCase(cat),value:cat})),
        ])
      })
      .catch(()=>{})
  },[])

  const filtered=filter==='all'?brands:brands.filter(b=>b.category===filter)

  return (
    <div>
      <div className="eyebrow">Specification Network</div>
      <h1 className="title">Brand Library</h1>

      <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem 2rem',paddingBottom:'1.5rem',marginBottom:'2.5rem',borderBottom:'1px solid var(--border)'}}>
        {filters.map(f=>(
          <button key={f.value} onClick={()=>setFilter(f.value)} style={{background:'none',border:'none',padding:'0 0 .5rem 0',fontFamily:'var(--fu)',fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:filter===f.value?'var(--bone)':'var(--wg)',cursor:'pointer',transition:'color .25s',position:'relative'}}>
            {f.label}
            {filter===f.value&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,var(--accent),var(--gold))'}}/>}
          </button>
        ))}
      </div>

      {loading
        ? <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1.25rem'}}>{Array.from({length:24}).map((_,i)=><div key={i} className="sk" style={{height:'90px'}}/>)}</div>
        : error
          ? <div style={{color:'var(--danger)',fontSize:'.85rem'}}>{error}</div>
          : filtered.length===0
            ? <div style={{color:'var(--mg)',fontSize:'.85rem'}}>No brands in this category.</div>
            : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1.25rem'}}>
                {filtered.map((b,idx)=>{
                  const span:React.CSSProperties=idx%11===0?{gridColumn:'span 2',gridRow:'span 2'}:idx%7===0?{gridColumn:'span 2'}:idx%5===0?{gridRow:'span 2'}:{}
                  return (
                    <div key={`brand-${b.id}-${idx}`} style={{...span,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid var(--border)',background:'rgba(17,16,9,.4)',padding:'2rem 1.5rem',textAlign:'center',transition:'all .3s var(--ease)',cursor:b.url?'pointer':'default',minHeight:'88px'}}
                      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='rgba(193,122,74,.4)';e.currentTarget.style.background='rgba(17,16,9,.8)'}}
                      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='rgba(17,16,9,.4)'}}
                      onClick={()=>b.url&&window.open(b.url,'_blank')}
                    >
                      <span style={{fontFamily:'var(--fu)',fontSize:idx%11===0?'1.1rem':'.82rem',color:'var(--wg)',fontWeight:300,letterSpacing:'.1em',textTransform:'uppercase',transition:'color .25s',lineHeight:1.4}}>{b.name}</span>
                    </div>
                  )
                })}
              </div>
      }

      {!loading&&!error&&(
        <div style={{marginTop:'2.5rem',paddingTop:'1.5rem',borderTop:'1px solid var(--border)',fontSize:'.65rem',color:'var(--mg)',letterSpacing:'.1em',textTransform:'uppercase'}}>
          {filtered.length} brand{filtered.length!==1?'s':''} in network{filter!=='all'&&` · ${filters.find(f=>f.value===filter)?.label}`}
        </div>
      )}
    </div>
  )
}
