import { Link } from 'react-router-dom'
import { ChevronLeft, Lock } from 'lucide-react'
import { colecaoPrimeiros } from '../data/mock'
import { useAppState } from '../context/AppState'
import { useState, useEffect } from 'react'

const treinoMap = ['techpower1','recuperacao','massagem','core1','circuito1','hiit','perda-peso','techpower1']

export default function Colecao(){
  const { completed } = useAppState()
  const [toast,setToast]=useState<string|null>(null)
  useEffect(()=>{ if(toast){ const t=setTimeout(()=>setToast(null),2200); return ()=>clearTimeout(t)}},[toast])
  const isUnlocked=(idx:number)=>{
    if(idx===0) return true
    return completed.includes(treinoMap[idx-1])
  }
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600"><ChevronLeft size={18}/></Link>
          <h1 className="flex-1 text-center md:text-left text-xs md:text-sm font-bold tracking-wide text-[#FF7A1A] leading-tight">PRIMEIROS PASSOS: MOVIMENTO, FORÇA E CONFIANÇA EM 4 SEMANAS</h1>
          <span className="w-8"/>
        </div>
        <div className="mt-3 bg-[#FFF7ED] border border-orange-100 rounded-xl px-3 py-2.5 text-xs md:text-sm text-zinc-600 max-w-[720px]">Web • streaming imediato — sem downloads. Completa um treino para desbloquear o próximo.</div>
      </div>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {colecaoPrimeiros.map((item, idx)=>{
          const unlocked = isUnlocked(idx)
          const treinoId = treinoMap[idx] || 'techpower1'
          const done = completed.includes(treinoId)
          const card = (
            <div className={`rounded-2xl overflow-hidden border bg-white shadow-sm transition-all ${unlocked ? 'border-zinc-200 hover:shadow-md hover:border-orange-200' : 'border-zinc-200 opacity-70'}`}>
              <div className="h-[130px] md:h-[150px] relative bg-zinc-900">
                <img src={item.thumb} alt={item.titulo} className={`w-full h-full object-cover ${!unlocked ? 'grayscale brightness-75' : ''}`}/>
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors"/>
                <div className="absolute inset-0 grid place-items-center">
                  {unlocked ? (
                    <div className="w-9 h-9 rounded-full bg-[#FF7A1A] grid place-items-center text-white shadow-lg group-hover:scale-110 transition-transform">▶</div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white/90 grid place-items-center text-zinc-600 shadow-lg"><Lock size={16}/></div>
                  )}
                </div>
                {done && unlocked && <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓</span>}
                {!unlocked && <span className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-full text-center">Bloqueado</span>}
              </div>
              <div className="p-3">
                <div className="text-xs md:text-sm font-semibold text-zinc-900 leading-tight line-clamp-1 group-hover:text-[#FF7A1A] transition-colors">{item.titulo}</div>
                <div className="text-[11px] md:text-xs text-zinc-500">{item.leg}</div>
                {!unlocked && <div className="text-[10px] text-orange-600 font-semibold mt-1">Completa o anterior</div>}
                {unlocked && <div className="text-[10px] text-emerald-600 font-medium mt-1">Web • streaming imediato</div>}
              </div>
            </div>
          )
          return unlocked ? (
            <Link key={item.n} to={`/treino/${treinoId}`} className="relative group block">
              <div className="absolute -left-1.5 -top-1.5 w-6 h-6 rounded-full bg-white border border-zinc-200 text-xs font-bold grid place-items-center z-10 shadow-sm">{item.n}</div>
              {card}
            </Link>
          ) : (
            <div key={item.n} onClick={()=>setToast(`Completa o treino ${idx} para desbloquear`)} className="relative group block cursor-pointer">
              <div className="absolute -left-1.5 -top-1.5 w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold grid place-items-center z-10 shadow-sm text-zinc-400">{item.n}</div>
              {card}
            </div>
          )
        })}
      </div>
      {toast && <div className="fixed bottom-[80px] md:bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg z-50 text-center max-w-[90%]">{toast}</div>}
    </div>
  )
}
