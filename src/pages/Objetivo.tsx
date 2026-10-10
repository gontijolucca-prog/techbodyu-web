import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Check } from 'lucide-react'
import { objetivos } from '../data/mock'
export default function Objetivo(){
  const nav=useNavigate()
  const [sel,setSel]=useState<string>(()=> localStorage.getItem('tbu:objetivo') || 'Tonificar Corpo')
  useEffect(()=>{ localStorage.setItem('tbu:objetivo', sel)},[sel])
  return (
    <div className="pb-6 bg-white min-h-full flex flex-col max-w-[640px] mx-auto w-full">
      <div className="px-4 md:px-6 py-3 flex items-center gap-3">
        <Link to="/perfil" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600"><ChevronLeft size={18}/></Link>
        <span className="w-8"/>
      </div>
      <h1 className="text-center text-sm md:text-base font-bold tracking-widest text-zinc-900">QUAL É O TEU OBJECTIVO?</h1>
      <p className="text-center text-xs text-zinc-500 mt-1">ISTO AJUDA-NOS A CRIAR O TEU PLANO PERSONALIZADO</p>
      <div className="mt-6 px-4 md:px-6 flex-1 space-y-0">
        {objetivos.map(o=>{
          const active = o===sel
          return (
            <button key={o} onClick={()=>setSel(o)} className={`w-full py-3.5 text-sm flex items-center justify-between border-b last:border-0 cursor-pointer px-3 rounded-xl mt-1 ${active?'bg-orange-50 border-orange-200 text-[#FF7A1A] font-bold':'text-zinc-700 font-medium hover:bg-zinc-50 border-zinc-100'}`}>
              <span>{o}</span>
              {active && <span className="w-6 h-6 rounded-full bg-[#FF7A1A] text-white grid place-items-center"><Check size={14}/></span>}
            </button>
          )
        })}
      </div>
      <div className="p-4 md:p-6">
        <button onClick={()=>nav('/')} className="w-full bg-[#FF7A1A] hover:bg-orange-600 text-white rounded-full py-3.5 text-sm font-bold transition-colors">Guardar • {sel}</button>
      </div>
    </div>
  )
}
