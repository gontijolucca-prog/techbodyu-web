import { useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import { useAppState } from '../context/AppState'

const zonesFrente = [
  { id:'peito-esq', label:'5%', top:'24%', left:'36%' },
  { id:'peito-dir', label:'5%', top:'24%', left:'58%' },
  { id:'braco-esq', label:'5%', top:'36%', left:'20%' },
  { id:'braco-dir', label:'5%', top:'36%', left:'77%' },
  { id:'abdo-esq', label:'5%', top:'48%', left:'42%' },
  { id:'abdo-dir', label:'5%', top:'48%', left:'56%' },
  { id:'coxa-esq', label:'5%', top:'74%', left:'37%' },
  { id:'coxa-dir', label:'5%', top:'74%', left:'60%' },
]
const zonesCostas = [
  { id:'trap-esq', label:'5%', top:'24%', left:'39%' },
  { id:'trap-dir', label:'5%', top:'24%', left:'58%' },
  { id:'braco-esq', label:'5%', top:'38%', left:'22%' },
  { id:'braco-dir', label:'5%', top:'38%', left:'75%' },
  { id:'dorsal-esq', label:'5%', top:'48%', left:'42%' },
  { id:'dorsal-dir', label:'5%', top:'48%', left:'56%' },
  { id:'lombar-esq', label:'5%', top:'58%', left:'40%' },
  { id:'lombar-dir', label:'5%', top:'58%', left:'58%' },
  { id:'gluteo-esq', label:'5%', top:'73%', left:'37%' },
  { id:'gluteo-dir', label:'5%', top:'73%', left:'60%' },
]
export default function SuitModal({open,onClose}:{open:boolean,onClose:()=>void}){
  const [tab,setTab]=useState<'Frente'|'Costas'>('Frente')
  const { suitVals, setSuit } = useAppState()
  const zones = tab==='Frente'? zonesFrente: zonesCostas
  const img = tab==='Frente'? '/assets/images/suit-front.png' : '/assets/images/suit-back.png'
  const geral = Math.max(5, Math.round(Object.values(suitVals).reduce((a,b)=>a+b,0)/Math.max(1,Object.keys(suitVals).length)) || 5)
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] w-full max-w-[420px] max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <span className="text-sm font-bold text-[#FF7A1A] flex items-center gap-2">⚡ Intensidade do Fato</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 grid place-items-center transition-colors"><X size={16}/></button>
        </div>
        <p className="px-5 pt-3 text-xs text-zinc-500">Toca numa zona do corpo para ajustar</p>
        <div className="flex justify-center gap-2 mt-3 px-5">
          <button onClick={()=>setTab('Frente')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${tab==='Frente'?'bg-[#FF7A1A] text-white':'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Frente</button>
          <button onClick={()=>setTab('Costas')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${tab==='Costas'?'bg-[#FF7A1A] text-white':'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>Costas</button>
        </div>
        <div className="flex-1 flex flex-col items-center overflow-y-auto">
          <div className="relative w-[260px] h-[400px] mt-4">
            <img src={img} alt="fato" className="w-full h-full object-contain" />
            {zones.map(z=>{
              const v = suitVals[z.id] ?? 5
              return (
                <button key={z.id} onClick={()=>setSuit(z.id, v+1)} title={z.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-[46px] h-[28px] rounded-full bg-white border-2 shadow text-xs font-bold transition-colors ${v>5?'border-[#FF7A1A] text-[#FF7A1A] bg-orange-50':'border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                  style={{top:z.top, left:z.left}}
                >{v}%</button>
              )
            })}
          </div>
          <div className="pb-6 pt-3 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <button onClick={()=>{ const k=zones[0].id; setSuit(k, (suitVals[k]??5)-1)}} className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 grid place-items-center transition-colors"><Minus size={16}/></button>
              <span className="text-base font-bold w-14 text-center">{geral}%</span>
              <button onClick={()=>{ const k=zones[0].id; setSuit(k, (suitVals[k]??5)+1)}} className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 grid place-items-center transition-colors"><Plus size={16}/></button>
            </div>
            <span className="text-xs text-zinc-400">Intensidade geral • {geral}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
