import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { useAppState } from '../context/AppState'

const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
const diasSemana = ['dom','seg','ter','qua','qui','sex','sáb']
const sameMonth = (iso:string, y:number, m:number) => { const d = new Date(iso); return d.getFullYear()===y && d.getMonth()===m }
const sameDay = (iso:string, y:number, m:number, d:number) => { const x = new Date(iso); return x.getFullYear()===y && x.getMonth()===m && x.getDate()===d }

export default function Estatisticas(){
  const { completions, treinoById } = useAppState()
  const now = new Date()
  const [tab,setTab]=useState('Mês Atual')
  const [mes,setMes]=useState(now.getMonth())
  const [diaSel,setDiaSel]=useState<number|null>(now.getDate())
  const [showCal,setShowCal]=useState(true)
  const tabs=['Dia Atual','Semana','Últimos 15 dias','Mês Atual']

  const enriched = useMemo(()=> completions.map(c => ({
    ...c,
    title: c.title || treinoById(String(c.workout_id))?.title || `Treino #${c.workout_id}`,
    dur: c.duration_min ?? treinoById(String(c.workout_id))?.duration_min ?? 25,
    cal: c.calories ?? treinoById(String(c.workout_id))?.calories ?? 0,
  })), [completions, treinoById])

  const filtered = useMemo(()=>{
    const nowMs = Date.now()
    if (diaSel !== null) {
      const day = new Date(now.getFullYear(), mes, diaSel)
      if (day.toDateString() === now.toDateString() || mes !== now.getMonth()) {
        return enriched.filter(c => sameDay(c.completed_at, now.getFullYear(), mes, diaSel))
      }
    }
    if(tab==='Dia Atual') return enriched.filter(c => sameDay(c.completed_at, now.getFullYear(), now.getMonth(), now.getDate()))
    if(tab==='Semana') return enriched.filter(c => nowMs - new Date(c.completed_at).getTime() <= 7*864e5)
    if(tab==='Últimos 15 dias') return enriched.filter(c => nowMs - new Date(c.completed_at).getTime() <= 15*864e5)
    return enriched.filter(c => sameMonth(c.completed_at, now.getFullYear(), now.getMonth()))
  },[tab, enriched, diaSel, mes])

  const stats = useMemo(()=>({
    treinos: filtered.length,
    tempo: `${filtered.reduce((a,c)=> a + c.dur, 0)} min`,
    cal: `${filtered.reduce((a,c)=> a + c.cal, 0)} Cal`,
    pts: `${filtered.reduce((a,c)=> a + c.points_awarded, 0)} pts`,
  }),[filtered])

  const firstWeekday = new Date(now.getFullYear(), mes, 1).getDay()
  const daysInMonth = new Date(now.getFullYear(), mes + 1, 0).getDate()
  const activityDays = useMemo(()=> new Set(enriched.filter(c => sameMonth(c.completed_at, now.getFullYear(), mes)).map(c => new Date(c.completed_at).getDate())),[enriched, mes])

  const fmtHora = (iso:string) => new Date(iso).toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'})
  const fmtData = (iso:string) => new Date(iso).toLocaleDateString('pt-PT',{day:'numeric',month:'short'})

  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3">
        <h1 className="text-center md:text-left text-sm md:text-base font-bold tracking-widest text-[#FF7A1A]">ESTATÍSTICAS</h1>
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
          {tabs.map(t=>(
            <button key={t} onClick={()=>{ setTab(t); setDiaSel(null) }} className={`shrink-0 px-3.5 py-2 rounded-full text-xs md:text-sm font-semibold border transition-colors cursor-pointer ${tab===t && diaSel===null ? 'bg-[#FF7A1A] text-white border-[#FF7A1A]':'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 md:p-5 max-w-[720px] mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-900">📅 {meses[mes]} de {now.getFullYear()}{diaSel!==null ? ` • dia ${diaSel}` : ''}</span>
            <button onClick={()=>setShowCal(v=>!v)} className="text-xs font-semibold text-[#FF7A1A] hover:underline cursor-pointer">{showCal ? 'Ocultar calendário' : 'Mostrar calendário'}</button>
          </div>
          {showCal && (
            <>
              <div className="flex items-center justify-between mt-3">
                <button onClick={()=>setMes(m=> Math.max(0,m-1))} className="w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center cursor-pointer"><ChevronLeft size={16} className="text-zinc-500"/></button>
                <span className="text-xs text-zinc-500"><button onClick={()=>setDiaSel(null)} className={diaSel===null?'font-bold text-[#FF7A1A]':'hover:underline'}>todos</button></span>
                <button onClick={()=>setMes(m=> Math.min(11,m+1))} className="w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center cursor-pointer"><ChevronRight size={16} className="text-zinc-500"/></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mt-3">
                {diasSemana.map(d=><span key={d} className="text-[10px] md:text-xs text-zinc-400 capitalize py-1">{d}</span>)}
                {Array.from({length:firstWeekday},(_,i)=><span key={'e'+i}/>)}
                {Array.from({length:daysInMonth},(_,i)=>i+1).map(n=>{
                  const sel = n===diaSel
                  const has = activityDays.has(n)
                  return (
                    <button key={n} onClick={()=>setDiaSel(sel ? null : n)} className={`h-8 md:h-9 grid place-items-center text-xs md:text-sm rounded-full transition-colors cursor-pointer relative ${sel?'bg-[#FF7A1A] text-white font-bold shadow-sm':'text-zinc-700 hover:bg-zinc-100'}`}>
                      {n}
                      {has && !sel && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#FF7A1A]"/>}
                    </button>
                  )
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
            <h2 className="text-sm md:text-base font-bold text-zinc-900">Sessões</h2>
            <span className="text-xs text-zinc-400">{filtered.length}</span>
          </div>
          <div className="mt-3 space-y-2">
            {filtered.length===0 && (
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 text-center">
                <p className="text-sm font-semibold text-zinc-900">Sem sessões neste período</p>
                <p className="text-xs text-zinc-500 mt-1">Faz um treino para aparecer aqui.</p>
              </div>
            )}
            {filtered.map(c=>(
              <div key={c.id} className="bg-white rounded-2xl border border-zinc-200 p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center shrink-0"><CheckCircle size={16}/></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 truncate">{c.title}</div>
                  <div className="text-xs text-zinc-500">{fmtData(c.completed_at)} • Concluído às {fmtHora(c.completed_at)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-zinc-700">{c.dur} min</div>
                  {c.cal > 0 && <div className="text-[11px] text-zinc-400">{c.cal} Cal</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
