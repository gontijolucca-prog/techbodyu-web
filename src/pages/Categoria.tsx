import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Info, Play } from 'lucide-react'
import { treinos } from '../data/mock'
import { useAppState } from '../context/AppState'

const map: Record<string,string> = {
  'perda-de-peso': 'Weight',
  'forca': 'Strength',
  'saude': 'Recovery',
  'livres': 'Cardio',
  'tematicas': 'Core'
}
export default function Categoria(){
  const { slug } = useParams()
  const { completed } = useAppState()
  const title = slug==='perda-de-peso' ? 'PERDA DE PESO' : slug==='forca' ? 'FORÇA E TONIFICAÇÃO' : slug==='saude' ? 'SAÚDE E BEM ESTAR' : slug==='livres' ? 'TREINOS LIVRES' : slug==='tematicas' ? 'AULAS TEMÁTICAS' : slug?.toUpperCase().replace(/-/g,' ') || 'CATEGORIA'
  const catKey = map[slug || ''] 
  const list = catKey ? treinos.filter(t=> t.cat===catKey) : []
  const show = catKey ? list : treinos.slice(0,4)
  if(catKey && list.length===0) return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3 flex items-center gap-3">
        <Link to="/" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center"><ChevronLeft size={18}/></Link>
        <h1 className="flex-1 text-center text-sm font-bold text-[#FF7A1A]">{title}</h1><span className="w-8"/>
      </div>
      <div className="p-6 text-center max-w-[560px] mx-auto mt-8 bg-white rounded-2xl border border-zinc-200">
        <p className="font-semibold">Sem treinos nesta categoria</p>
        <p className="text-sm text-zinc-500 mt-1">Categoria “{slug}” não tem treinos.</p>
        <Link to="/" className="inline-block mt-4 bg-[#FF7A1A] text-white rounded-full px-5 py-2.5 text-sm font-bold">Ver todos</Link>
      </div>
    </div>
  )
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600 transition-colors"><ChevronLeft size={18}/></Link>
          <h1 className="flex-1 text-center md:text-left text-sm md:text-base font-bold tracking-wide text-[#FF7A1A]">{title}</h1>
          <span className="w-8"/>
        </div>
        <div className="mt-3 flex gap-2 items-center bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 max-w-[720px]">
          <Info size={16} className="text-emerald-600 shrink-0"/>
          <p className="text-xs md:text-sm text-zinc-700 leading-tight">Web • streaming imediato — sem downloads. Toca no treino e começa já.</p>
        </div>
      </div>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
        <p className="text-xs text-zinc-500 mb-3">{show.length} treinos • {catKey || 'todos'} • todos disponíveis</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {show.map(t=>{
            const done = completed.includes(t.id)
            return (
              <Link key={t.id} to={`/treino/${t.id}`} className="block rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all">
                <div className="h-[180px] relative bg-zinc-900">
                  <img src={t.thumb} alt={t.titulo} className="w-full h-full object-cover opacity-95"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1"><Play size={10} fill="white"/> Streaming</div>
                  {done && <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">✓ Concluído</div>}
                  <div className="absolute inset-0 grid place-items-center"><div className="w-11 h-11 rounded-full bg-[#FF7A1A] grid place-items-center shadow-lg text-white group-hover:scale-105 transition-transform">▶</div></div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex gap-1.5 text-xs text-white">
                    <span className="bg-black/40 backdrop-blur px-2 py-1 rounded-full">{t.cal} Cal</span>
                    <span className="bg-black/40 backdrop-blur px-2 py-1 rounded-full">{t.nivel}</span>
                    <span className="bg-black/40 backdrop-blur px-2 py-1 rounded-full hidden sm:inline">{t.cat}</span>
                    <span className="ml-auto bg-[#FF7A1A] px-2 py-1 rounded-full font-bold">{t.pts} pts</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm md:text-[15px] font-semibold text-zinc-900">{t.titulo}</div>
                  <div className="text-xs md:text-sm text-zinc-500 mt-1">{t.dur} • {t.nivel} • {t.cat}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
