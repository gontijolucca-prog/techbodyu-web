import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useAppState } from '../context/AppState'

export default function Perfil(){
  const { points } = useAppState()
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white p-4 md:p-6 flex items-center gap-4 border-b border-zinc-200">
        <img src="/assets/images/fitness-profile.jpg" className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover" alt="avatar"/>
        <div className="flex-1">
          <div className="text-sm md:text-base font-bold text-zinc-900">LUIZ SANTANA</div>
          <div className="text-xs md:text-sm text-zinc-500">Membro desde Março 2026 • Subscrição</div>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5">
          <span className="w-6 h-6 rounded-full bg-[#FF7A1A] grid place-items-center text-white text-xs">🏅</span>
          <span className="text-sm font-bold text-[#FF7A1A]">{points}</span>
          <span className="text-xs text-zinc-500">points</span>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto space-y-4">
        <Link to="/objetivo" className="block bg-white rounded-2xl border border-zinc-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
          <span className="text-sm font-semibold text-zinc-900">🎯 Perfil de Condição Física</span><ChevronRight size={18} className="text-zinc-400"/>
        </Link>
        <div className="block bg-white rounded-2xl border border-zinc-200 p-4 flex items-center justify-between opacity-60">
          <span className="text-sm font-semibold text-zinc-900">📋 Guia de Preparação Inicial</span><ChevronRight size={18} className="text-zinc-400"/>
        </div>

        <div className="text-xs font-bold text-zinc-500 tracking-widest mt-2">Dispositivos</div>
        <Link to="/ems" className="block bg-white rounded-2xl border border-[#FF7A1A] p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
          <span className="text-sm font-semibold text-[#FF7A1A]">📱 My EMS Control</span><ChevronRight size={18} className="text-[#FF7A1A]"/>
        </Link>

        <div className="text-xs font-bold text-zinc-500 tracking-widest mt-4">Suporte</div>
        <div className="block bg-white rounded-2xl border border-zinc-200 p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900">❓ Centro de Ajuda</span><ChevronRight size={18} className="text-zinc-400"/>
        </div>

        <div className="text-xs font-bold text-zinc-500 tracking-widest mt-4">Aplicação</div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900">🔒 Login Biométrico</span>
          <div className="w-11 h-6 rounded-full bg-[#FF7A1A] p-0.5 flex justify-end"><div className="w-5 h-5 rounded-full bg-white"/></div>
        </div>
      </div>
    </div>
  )
}
