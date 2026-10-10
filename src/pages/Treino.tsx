import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Minus, Plus, Pause, Play } from 'lucide-react'
import { treinos } from '../data/mock'
import { useAppState } from '../context/AppState'
import SuitModal from '../components/SuitModal'

export default function Treino(){
  const { id } = useParams()
  const nav = useNavigate()
  const { toggleComplete } = useAppState()
  const t = treinos.find(x=>x.id===id) || treinos[0]
  const [suit,setSuit]=useState(false)
  const [intensity,setIntensity]=useState(5)
  const [paused,setPaused]=useState(true)
  const [progress,setProgress]=useState(35)
  const duration = 69
  const intervalRef = useRef<number|null>(null)

  useEffect(()=>{
    if(paused) { if(intervalRef.current) window.clearInterval(intervalRef.current); return }
    intervalRef.current = window.setInterval(()=> setProgress(p=> p>=duration? duration : p+1), 1000)
    return ()=> { if(intervalRef.current) window.clearInterval(intervalRef.current) }
  },[paused, duration])

  const pct = (progress/duration)*100
  const fmt = (s:number)=> `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  return (
    <div className="bg-[#FAFAF8] min-h-full flex flex-col">
      <div className="bg-white border-b border-zinc-200 px-4 py-3 flex items-center gap-3">
        <Link to="/" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600 transition-colors"><ChevronLeft size={18}/></Link>
        <span className="flex-1 text-center text-sm md:text-base font-bold text-[#FF7A1A] tracking-wide">RECOMMENDED</span>
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:grid w-6 h-6 rounded-full bg-zinc-900 text-white text-[11px] place-items-center">🔋</span>
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[11px] grid place-items-center">◉</span>
          <span className="text-xs font-semibold bg-zinc-900 text-white px-2 py-1 rounded-full">{intensity}%</span>
          <span className="text-xs md:text-sm font-mono text-zinc-600">{fmt(progress)}</span>
        </div>
      </div>

      <div className="w-full max-w-[960px] mx-auto">
        <div className="relative bg-black md:rounded-b-2xl overflow-hidden">
          <img src="/assets/images/Video.jpg" alt="treino" className="w-full h-[240px] sm:h-[340px] md:h-[420px] object-cover"/>
          <div className="absolute inset-0">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              <button onClick={()=>setSuit(true)} className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black/50 backdrop-blur border border-white/20 grid place-items-center text-white hover:bg-black/60 transition-colors">◧</button>
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <button onClick={()=>setPaused(v=>!v)} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF7A1A] grid place-items-center shadow-xl text-white hover:scale-105 transition-transform">
                {paused ? <Play size={22} fill="white" className="ml-0.5"/> : <Pause size={22} fill="white"/>}
              </button>
            </div>
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 items-center">
              <button onClick={()=>setIntensity(v=>Math.max(0,v-1))} className="w-9 h-12 sm:w-10 sm:h-12 rounded-xl bg-white/15 backdrop-blur border border-white/20 grid place-items-center text-white hover:bg-white/25 transition-colors"><Minus size={16}/></button>
              <div className="w-9 h-8 sm:w-10 sm:h-9 rounded-xl bg-white/95 grid place-items-center text-zinc-900 text-xs sm:text-sm font-bold">{intensity}%</div>
              <button onClick={()=>setIntensity(v=>Math.min(100,v+1))} className="w-9 h-12 sm:w-10 sm:h-12 rounded-xl bg-white/15 backdrop-blur border border-white/20 grid place-items-center text-white hover:bg-white/25 transition-colors"><Plus size={16}/></button>
            </div>
            <div className="absolute bottom-0 inset-x-0 px-3 sm:px-4 pb-3">
              <div className="flex items-center gap-2 text-white text-xs">
                <span className="font-mono">{fmt(progress)}</span>
                <input type="range" min={0} max={duration} value={progress} onChange={e=>setProgress(parseInt(e.target.value))} className="flex-1 h-1 accent-[#FF7A1A] cursor-pointer" />
                <span className="font-mono">{fmt(duration)}</span>
              </div>
              <div className="mt-2 h-8 rounded-t-xl overflow-hidden relative bg-gradient-to-t from-orange-500/40 to-transparent">
                <div className="absolute inset-0 opacity-60" style={{background: 'linear-gradient(90deg, #000 ' + pct + '%, #FF7A1A ' + pct + '%)', clipPath:'polygon(0 100%, 5% 20%, 15% 80%, 25% 10%, 35% 90%, 45% 5%, 55% 85%, 65% 15%, 75% 70%, 85% 30%, 100% 100%)'}}/>
                <div className="absolute top-0 bottom-0 w-0.5 bg-[#FF7A1A]" style={{left: `${pct}%`}}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 max-w-[960px] mx-auto w-full">
        <h1 className="text-[16px] md:text-lg font-bold text-zinc-900">{t.titulo}</h1>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-xs bg-zinc-100 px-2.5 py-1.5 rounded-full">◎ 25</span>
          <span className="text-xs bg-zinc-100 px-2.5 py-1.5 rounded-full">{t.cal} Cal</span>
          <span className="text-xs bg-zinc-100 px-2.5 py-1.5 rounded-full">{t.nivel}</span>
          <span className="text-xs bg-zinc-100 px-2.5 py-1.5 rounded-full">{t.cat}</span>
          <span className="text-xs bg-[#FF7A1A] text-white px-2.5 py-1.5 rounded-full font-bold">{t.pts} pts</span>
          <span className="text-xs bg-zinc-100 px-2.5 py-1.5 rounded-full hidden sm:inline">Full Body</span>
        </div>
        <p className="text-sm text-zinc-600 mt-4 leading-relaxed">Treino com duas fases onde combina força e potência com electroestimulação para queima calórica, reduz gordura, tonifica e define o corpo, promovendo força rápida e performance.</p>
        <div className="mt-6">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">⚡ Fases do Treino</h3>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-[#E8F5E9] border border-emerald-100 rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-white grid place-items-center text-emerald-600">◧</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-900">Warm Up</div>
                <div className="text-xs text-zinc-500">00:00:00</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-white border grid place-items-center text-zinc-400">◧</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-900">Força</div>
                <div className="text-xs text-zinc-500">00:03:41 • 1 ramp 3× 7s</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <button onClick={()=>setSuit(true)} className="w-full bg-[#FF7A1A] text-white rounded-xl py-3.5 text-sm font-bold hover:bg-orange-600 transition-colors">⚡ Ajustar Fato</button>
          <button onClick={()=>{ toggleComplete(t.id, t.pts); nav('/sucesso') }} className="w-full bg-zinc-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-black transition-colors">Concluir Treino +{t.pts} pts</button>
        </div>
      </div>
      <SuitModal open={suit} onClose={()=>setSuit(false)} />
    </div>
  )
}
