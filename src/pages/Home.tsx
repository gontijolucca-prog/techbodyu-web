import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { colecoes, categorias, treinos } from '../data/mock'
import { useAppState } from '../context/AppState'

export default function Home(){
  const { points, completed } = useAppState()
  const [q,setQ]=useState('')
  const term = q.toLowerCase().trim()
  const { fTreinos, fColecoes, fCategorias } = useMemo(()=>{
    if(!term) return { fTreinos: treinos, fColecoes: colecoes, fCategorias: categorias }
    return {
      fTreinos: treinos.filter(x=> x.titulo.toLowerCase().includes(term) || x.cat.toLowerCase().includes(term) || x.nivel.toLowerCase().includes(term)),
      fColecoes: colecoes.filter(x=> x.titulo.toLowerCase().includes(term)),
      fCategorias: categorias.filter(x=> x.titulo.toLowerCase().includes(term))
    }
  },[term])
  const hasResults = fTreinos.length + fColecoes.length + fCategorias.length > 0
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white px-4 md:px-6 pt-4 md:pt-6 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/images/fitness-profile.jpg" className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover" alt="avatar"/>
            <div>
              <div className="text-[11px] md:text-xs text-zinc-500 leading-none">Boa tarde,</div>
              <div className="text-[13px] md:text-[15px] font-extrabold tracking-wide text-zinc-900 -mt-0.5">LUIZ SANTANA</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1.5">
            <div className="w-6 h-6 rounded-full bg-[#FF7A1A] grid place-items-center text-white text-[11px]">🏅</div>
            <span className="text-sm font-bold text-[#FF7A1A]">{points}</span>
            <span className="text-[11px] text-zinc-500">points</span>
          </div>
        </div>
        <div className="mt-4 relative max-w-[640px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Pesquisar treinos, coleções…" className="w-full bg-zinc-100 rounded-full pl-10 pr-10 py-3 text-[14px] placeholder:text-zinc-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#FF7A1A]/20 focus:border-[#FF7A1A] border border-transparent"/>
          {q && <button onClick={()=>setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-200 grid place-items-center hover:bg-zinc-300"><X size={14}/></button>}
        </div>
      </div>

      {!hasResults ? <div className="px-4 md:px-6 mt-8"><div className="text-center py-12 bg-white rounded-2xl border border-zinc-200"><p className="text-zinc-900 font-semibold">Nenhum resultado para "{q}"</p><p className="text-sm text-zinc-500 mt-1">Tenta "TechPower", "Recovery" ou "Strength"</p><button onClick={()=>setQ('')} className="mt-4 px-5 py-2 rounded-full bg-[#FF7A1A] text-white text-sm font-bold">Limpar pesquisa</button></div></div> : <>
      <div className="px-4 md:px-6 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] md:text-base font-bold text-zinc-900">Recomendados</h2>
          <span className="text-xs text-zinc-400">{fTreinos.length} treinos</span>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {fTreinos.slice(0,8).map(t=>{
            const done = completed.includes(t.id)
            return (
              <Link key={t.id} to={`/treino/${t.id}`} className="rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group cursor-pointer">
                <div className="h-[140px] md:h-[160px] relative bg-zinc-900">
                  <img src={t.thumb} alt={t.titulo} className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur text-white text-[11px] px-2 py-1 rounded-full">◎ 25</div>
                  {done && <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">✓ Completed</div>}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#FF7A1A] grid place-items-center shadow-lg text-white group-hover:scale-110 transition-transform">▶</div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 text-[10px] md:text-[11px] text-white">
                    <span className="bg-black/40 backdrop-blur px-2 py-0.5 rounded-full">{t.cal} Cal</span>
                    <span className="bg-black/40 backdrop-blur px-2 py-0.5 rounded-full hidden sm:inline">{t.nivel}</span>
                    <span className="bg-black/40 backdrop-blur px-2 py-0.5 rounded-full">{t.cat}</span>
                    <span className="ml-auto bg-[#FF7A1A] px-2 py-0.5 rounded-full font-bold">{t.pts}</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-[13px] md:text-sm font-semibold text-zinc-900 leading-tight line-clamp-1 group-hover:text-[#FF7A1A] transition-colors">{t.titulo}</div>
                  <div className="text-[11px] md:text-xs text-zinc-500 mt-0.5">{t.dur} • {t.cat}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="px-4 md:px-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] md:text-base font-bold text-zinc-900">Coleções</h2>
          <span className="text-xs text-zinc-400">{fColecoes.length}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {fColecoes.map(c=>(
            <Link key={c.id} to={`/colecao/${c.id}`} className="rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer">
              <div className="h-[130px] md:h-[150px] relative">
                <img src={c.thumb} alt={c.titulo} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
              </div>
              <div className="p-3">
                <div className="text-[12px] md:text-[13px] font-semibold leading-tight line-clamp-2 text-zinc-900">{c.titulo}</div>
                <div className="text-[11px] md:text-xs text-zinc-500 mt-1">{c.qtd}</div>
              </div>
            </Link>
          ))}
        </div>
        {fColecoes.length===0 && <p className="text-xs text-zinc-500 mt-2">Nenhuma coleção corresponde.</p>}
      </div>

      <div className="px-4 md:px-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] md:text-base font-bold text-zinc-900">Categorias</h2>
          <span className="text-xs text-zinc-400">{fCategorias.length}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {fCategorias.map(cat=>(
            <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="rounded-2xl overflow-hidden h-[120px] md:h-[140px] relative border border-zinc-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group cursor-pointer">
              <img src={cat.thumb} alt={cat.titulo} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
              <div className="absolute bottom-2.5 left-3 right-3 text-white text-[12px] md:text-[13px] font-semibold leading-tight">{cat.titulo}</div>
            </Link>
          ))}
        </div>
        {fCategorias.length===0 && <p className="text-xs text-zinc-500 mt-2">Nenhuma categoria corresponde.</p>}
      </div>

      <div className="px-4 md:px-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] md:text-base font-bold text-zinc-900">Treinos Recentes</h2>
          <Link to="/estatisticas" className="text-sm text-[#FF7A1A] font-semibold hover:underline cursor-pointer">Ver tudo</Link>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {fTreinos.slice(0,5).map(t=>{
            const done = completed.includes(t.id)
            return (
              <Link key={t.id+"r"} to={`/treino/${t.id}`} className="rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="h-[100px] md:h-[110px] relative bg-zinc-900">
                  <img src={t.thumb} alt={t.titulo} className="w-full h-full object-cover opacity-90"/>
                  <div className="absolute inset-0 grid place-items-center"><div className="w-8 h-8 rounded-full bg-[#FF7A1A] grid place-items-center text-white text-xs">▶</div></div>
                  {done && <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓</span>}
                </div>
                <div className="p-2.5">
                  <div className="text-[11px] md:text-xs font-semibold line-clamp-1 text-zinc-900">{t.titulo}</div>
                  <div className="text-[10px] md:text-[11px] text-zinc-500">{t.dur} • {t.pts} pts</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      </>}
    </div>
  )
}
