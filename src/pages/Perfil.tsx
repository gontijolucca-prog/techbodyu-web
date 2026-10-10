import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, LogOut } from 'lucide-react'
import { useAppState } from '../context/AppState'

export default function Perfil(){
  const { points, user, logout } = useAppState()
  const nav = useNavigate()
  const [bio,setBio]=useState(()=> localStorage.getItem('tbu:bio') === '1')
  const [toast,setToast]=useState<string|null>(null)
  useEffect(()=>{ localStorage.setItem('tbu:bio', bio ? '1':'0') },[bio])
  useEffect(()=>{ if(toast){ const t=setTimeout(()=>setToast(null),2200); return ()=>clearTimeout(t)}},[toast])
  const show=(m:string)=> setToast(m)
  const nome = user?.nome || 'Utilizador'
  const email = user?.email || ''
  const avatar = user?.avatar || '/assets/images/fitness-profile.jpg'
  const handleLogout=()=>{
    logout()
    nav('/auth')
  }
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white p-4 md:p-6 flex items-center gap-4 border-b border-zinc-200">
        <img src={avatar} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-zinc-200" alt="avatar"/>
        <div className="flex-1 min-w-0">
          <div className="text-sm md:text-base font-bold text-zinc-900 truncate">{nome.toUpperCase()}</div>
          <div className="text-xs md:text-sm text-zinc-500 truncate">{email ? email + ' • Membro desde Março 2026' : 'Membro desde Março 2026'} • Subscrição</div>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5 shrink-0">
          <span className="w-6 h-6 rounded-full bg-[#FF7A1A] grid place-items-center text-white text-xs">🏅</span>
          <span className="text-sm font-bold text-[#FF7A1A]">{points}</span>
          <span className="text-xs text-zinc-500">points</span>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto space-y-4">
        <Link to="/objetivo" className="block bg-white rounded-2xl border border-zinc-200 p-4 flex items-center justify-between hover:shadow-sm hover:border-orange-200 transition-all cursor-pointer">
          <span className="text-sm font-semibold text-zinc-900">🎯 Perfil de Condição Física</span><ChevronRight size={18} className="text-zinc-400"/>
        </Link>
        <button onClick={()=>show('Guia: aquece 5 min • hidrata • usa gel condutor • começa em intensidade 1')} className="w-full text-left bg-white rounded-2xl border border-zinc-200 p-4 flex items-center justify-between hover:shadow-sm hover:border-orange-200 transition-all cursor-pointer">
          <span className="text-sm font-semibold text-zinc-900">📋 Guia de Preparação Inicial</span><ChevronRight size={18} className="text-zinc-400"/>
        </button>

        <div className="text-xs font-bold text-zinc-500 tracking-widest mt-2">Dispositivos</div>
        <Link to="/ems" className="block bg-white rounded-2xl border border-[#FF7A1A] p-4 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer">
          <span className="text-sm font-semibold text-[#FF7A1A]">📱 My EMS Control</span><ChevronRight size={18} className="text-[#FF7A1A]"/>
        </Link>

        <div className="text-xs font-bold text-zinc-500 tracking-widest mt-4">Suporte</div>
        <button onClick={()=>show('Centro de Ajuda: escreve para suporte@techbody.pt • WhatsApp disponível no site')} className="w-full text-left bg-white rounded-2xl border border-zinc-200 p-4 flex items-center justify-between hover:shadow-sm hover:border-orange-200 transition-all cursor-pointer">
          <span className="text-sm font-semibold text-zinc-900">❓ Centro de Ajuda</span><ChevronRight size={18} className="text-zinc-400"/>
        </button>

        <div className="text-xs font-bold text-zinc-500 tracking-widest mt-4">Aplicação</div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900">🔒 Login Biométrico</span>
          <button onClick={()=>{ setBio(v=>!v); show(!bio ? 'Login biométrico activado' : 'Login biométrico desactivado')}} className={`w-11 h-6 rounded-full p-0.5 flex transition-colors cursor-pointer ${bio?'bg-[#FF7A1A] justify-end':'bg-zinc-300 justify-start'}`}>
            <div className="w-5 h-5 rounded-full bg-white shadow"/>
          </button>
        </div>
        <p className="text-xs text-zinc-400 px-1">O interruptor guarda em <code className="bg-zinc-100 px-1 rounded">tbu:bio</code> e funciona mesmo offline.</p>

        <div className="text-xs font-bold text-zinc-500 tracking-widest mt-4">Conta</div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-4">
          <div className="text-sm font-semibold text-zinc-900">{nome}</div>
          <div className="text-xs text-zinc-500 mt-1 break-all">{email}</div>
          <button onClick={handleLogout} className="mt-4 w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl py-2.5 text-sm font-bold transition-colors cursor-pointer"><LogOut size={16}/> Terminar sessão</button>
          <p className="text-[11px] text-zinc-400 mt-2 text-center">Ao terminar sais da app web e voltas ao login. Progresso fica guardado para este email.</p>
        </div>
      </div>
      {toast && <div className="fixed bottom-[80px] md:bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg z-50 text-center max-w-[90%]">{toast}</div>}
    </div>
  )
}
