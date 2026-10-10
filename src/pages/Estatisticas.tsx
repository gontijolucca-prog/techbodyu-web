import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { estatisticasMes } from '../data/mock'

const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']

export default function Estatisticas(){
  const [tab,setTab]=useState('Mês Atual')
  const [diaSel,setDiaSel]=useState(11)
  const [mes,setMes]=useState(2)
  const [showCal,setShowCal]=useState(true)
  const tabs=['Dia Atual','Semana','Últimos 15 dias','Mês Atual']
  const filtered = useMemo(()=>{
    if(tab==='Dia Atual') return estatisticasMes.filter(e=> e.data.includes('11 de mar') || e.hora.includes('11:'))
    if(tab==='Semana') return estatisticasMes.slice(2)
    if(tab==='Últimos 15 dias') return estatisticasMes.slice(1)
    return estatisticasMes
  },[tab])
  const stats = {
    treinos: filtered.length || 6,
    tempo: tab==='Dia Atual' ? '29 min' : '76 min',
    cal: tab==='Dia Atual' ? '95 Cal' : '244 Cal',
    pts: tab==='Mês Atual' ? '275 pts' : tab==='Dia Atual' ? '50 pts' : '120 pts'
  }
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3">
        <h1 className="text-center md:text-left text-sm md:text-base font-bold tracking-widest text-[#FF7A1A]">ESTATÍSTICAS</h1>
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`shrink-0 px-3.5 py-2 rounded-full text-xs md:text-sm font-semibold border transition-colors cursor-pointer ${tab===t?'bg-[#FF7A1A] text-white border-[#FF7A1A]':'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 md:p-5 max-w-[720px] mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-900">📅 {meses[mes]} de 2026</span>
            <button onClick={()=>setShowCal(v=>!v)} className="text-xs font-semibold text-[#FF7A1A] hover:underline cursor-pointer">{showCal ? 'Ocultar calendário' : 'Mostrar calendário'}</button>
          </div>
          {showCal && (
            <>
              <div className="flex items-center justify-between mt-3">
                <button onClick={()=>setMes(m=> Math.max(0,m-1))} className="w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center cursor-pointer"><ChevronLeft size={16} className="text-zinc-500"/></button>
                <span className="text-xs text-zinc-500">{tab} • dia {diaSel}</span>
                <button onClick={()=>setMes(m=> Math.min(11,m+1))} className="w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center cursor-pointer"><ChevronRight size={16} className="text-zinc-500"/></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mt-3">
                {['domingo','segunda','terça','quarta','quinta','sexta','sábado'].map(d=><span key={d} className="text-[10px] md:text-xs text-zinc-400 capitalize py-1">{d.slice(0,3)}</span>)}
                {Array.from({length:31},(_,i)=>i+1).map(n=>{
                  const sel=n===diaSel
                  return <button key={n} onClick={()=>setDiaSel(n)} className={`h-8 md:h-9 grid place-items-center text-xs md:text-sm rounded-full transition-colors cursor-pointer ${sel?'bg-[#FF7A1A] text-white font-bold shadow-sm':'text-zinc-700 hover:bg-zinc-100'}`}>{n}</button>
                })}
              </div>
            </>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            <div className="bg-purple-600 text-white rounded-xl p-3 md:p-4">
              <div className="text-[11px] md:text-xs opacity-80">Treinos</div>
              <div className="text-lg md:text-xl font-bold">{stats.treinos}</div>
            </div>
            <div className="bg-emerald-500 text-white rounded-xl p-3 md:p-4">
              <div className="text-[11px] md:text-xs opacity-80">Tempo</div>
              <div className="text-lg md:text-xl font-bold">{stats.tempo}</div>
            </div>
            <div className="bg-red-500 text-white rounded-xl p-3 md:p-4">
              <div className="text-[11px] md:text-xs opacity-80">Calorias</div>
              <div className="text-lg md:text-xl font-bold">{stats.cal}</div>
            </div>
            <div className="bg-sky-500 text-white rounded-xl p-3 md:p-4">
              <div className="text-[11px] md:text-xs opacity-80">Pontos</div>
              <div className="text-lg md:text-xl font-bold">{stats.pts}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 max-w-[720px] mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-bold text-zinc-900">Este mês</h2>
            <span className="text-xs md:text-sm text-[#FF7A1A] font-semibold">{filtered.length} treinos</span>
          </div>
          <div className="mt-3 space-y-2">
            {filtered.map((e,i)=>(
              <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-3 md:p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <CheckCircle size={20} className="text-emerald-500 shrink-0"/>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 truncate">{e.nome}</div>
                  <div className="text-xs text-zinc-500">{e.data} • {e.hora}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-zinc-900">{e.dur}</div>
                  <div className="text-xs text-zinc-500">{e.cal}</div>
                </div>
              </div>
            ))}
            {filtered.length===0 && <div className="text-center text-sm text-zinc-500 py-8">Sem treinos neste período.</div>}
          </div>
          <div className="mt-6 flex justify-center">
            <Link to="/conquistas" className="text-sm font-bold text-[#FF7A1A] hover:underline">Ver Conquistas →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
