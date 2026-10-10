import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { objetivos } from '../data/mock'
export default function Objetivo(){
  const [sel,setSel]=useState<string>('Tonificar Corpo')
  const nav=useNavigate()
  return (
    <div className="pb-[72px] bg-white min-h-full flex flex-col">
      <div className="px-3 py-3 flex items-center gap-3">
        <Link to="/perfil" className="w-7 h-7 rounded-full bg-[#FF7A1A] text-white grid place-items-center"><ChevronLeft size={16}/></Link>
        <span className="w-7"/>
      </div>
      <h1 className="text-center text-sm font-bold tracking-widest text-zinc-900">QUAL É O TEU OBJECTIVO?</h1>
      <p className="text-center text-[11px] text-zinc-500 mt-1">ISTO AJUDA-NOS A CRIAR O TEU PLANO PERSONALIZADO</p>
      <div className="mt-6 px-6 flex-1">
        {objetivos.map(o=>{
          const active = o===sel
          return (
            <button key={o} onClick={()=>setSel(o)} className={`w-full py-2.5 text-sm ${active?'text-[#FF7A1A] font-bold border-b border-[#FF7A1A]':'text-zinc-700 font-medium'} ${o==='Tonificar Corpo' || o==='Melhorar Resistência' || o==='Aumentar Força' ? 'border-b border-orange-200':''} `}>{o}</button>
          )
        })}
      </div>
      <div className="p-4">
        <button onClick={()=>nav('/')} className="w-full bg-[#FF7A1A] text-white rounded-full py-3 text-sm font-bold">Guardar</button>
      </div>
    </div>
  )
}
