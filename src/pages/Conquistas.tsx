import { Link } from 'react-router-dom'
import { ChevronLeft, Trophy } from 'lucide-react'
import { useAppState } from '../context/AppState'
import { conquistas as conquistasMock } from '../data/mock'

export default function Conquistas(){
  const { points, completed } = useAppState()
  const totalKcal = completed.length * 245
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3 flex items-center gap-3">
        <Link to="/estatisticas" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600"><ChevronLeft size={18}/></Link>
        <h1 className="flex-1 text-center md:text-left text-sm md:text-base font-bold tracking-widest text-[#FF7A1A]">CONQUISTAS</h1>
        <span className="w-8"/>
      </div>
      <div className="p-4 md:p-6 max-w-[800px] mx-auto">
        <div className="bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3A] rounded-2xl p-5 md:p-6 text-white flex items-center justify-between">
          <div>
            <div className="text-xs md:text-sm opacity-90">TOTAL PONTOS</div>
            <div className="text-2xl md:text-3xl font-extrabold">{points} <span className="text-sm md:text-base font-semibold">pts</span></div>
            <div className="text-xs md:text-sm opacity-90 mt-1">{completed.length} treinos concluídos</div>
          </div>
          <div className="text-right">
            <div className="text-xs md:text-sm opacity-90">CALORIAS GASTAS</div>
            <div className="text-2xl md:text-3xl font-extrabold">{totalKcal} <span className="text-sm md:text-base font-semibold">kcal</span></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {conquistasMock.slice(0, Math.max(completed.length,3)).map((c,i)=>(
            <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center"><Trophy size={16}/></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-900 truncate">{c.titulo}</div>
                <div className="text-xs text-zinc-500">{c.data}</div>
              </div>
              <span className="text-sm font-bold text-emerald-600">{c.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
