import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { colecaoPrimeiros } from '../data/mock'
export default function Colecao(){
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600"><ChevronLeft size={18}/></Link>
          <h1 className="flex-1 text-center md:text-left text-xs md:text-sm font-bold tracking-wide text-[#FF7A1A] leading-tight">PRIMEIROS PASSOS: MOVIMENTO, FORÇA E CONFIANÇA EM 4 SEMANAS</h1>
          <span className="w-8"/>
        </div>
        <div className="mt-3 bg-[#FFF7ED] border border-orange-100 rounded-xl px-3 py-2.5 text-xs md:text-sm text-zinc-600 max-w-[720px]">📋 Plano de Treino Sequencial — Cada treino fica disponível após concluir o anterior</div>
      </div>
      <div className="p-4 md:p-6 max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {colecaoPrimeiros.map(item=>(
          <div key={item.n} className="relative">
            <div className="absolute -left-1.5 -top-1.5 w-6 h-6 rounded-full bg-white border border-zinc-200 text-xs font-bold grid place-items-center z-10 shadow-sm">{item.n}</div>
            <div className={`rounded-2xl overflow-hidden border ${item.downloading?'border-[#FF7A1A]':'border-zinc-200'} bg-white shadow-sm hover:shadow-md transition-shadow ${!item.unlocked && !item.downloading ?'opacity-60':''}`}>
              <div className="h-[130px] md:h-[150px] relative bg-zinc-900">
                <img src={item.thumb} alt={item.titulo} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/30"/>
                {item.unlocked ? <div className="absolute inset-0 grid place-items-center"><div className="w-9 h-9 rounded-full bg-[#FF7A1A] grid place-items-center text-white">▶</div></div> : null}
                {item.downloading ? (
                  <div className="absolute inset-0 grid place-items-center bg-black/60">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-11 h-11 rounded-full border-2 border-white/40 border-t-white grid place-items-center text-white text-xs">{item.downloading}%</div>
                      <span className="text-white text-xs">Downloading…</span>
                      <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full">Cancel</span>
                    </div>
                  </div>
                ) : !item.unlocked ? <div className="absolute inset-0 grid place-items-center p-3"><div className="bg-black/60 text-white text-xs px-3 py-2 rounded-xl text-center">🔒 Conclui o Treino<br/>para desbloquear</div></div> : null}
              </div>
              <div className="p-3">
                <div className="text-xs md:text-sm font-semibold text-zinc-900 leading-tight line-clamp-1">{item.titulo}</div>
                <div className="text-[11px] md:text-xs text-zinc-500">{item.leg}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
