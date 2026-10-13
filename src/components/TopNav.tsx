import { NavLink } from 'react-router-dom'
import { Home, BarChart3, Bell, User, Megaphone } from 'lucide-react'
import { useAppState } from '../context/AppState'
export default function TopNav(){
  const { unread } = useAppState()
  const cls=({isActive}:{isActive:boolean})=> `text-sm font-semibold px-3 py-2 rounded-full ${isActive?'bg-[#FF7A1A] text-white':'text-zinc-600 hover:bg-zinc-100'}`
  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3 bg-white border-b border-zinc-200 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <img src="/assets/images/applogo.png" alt="TechBody" className="h-7 w-auto object-contain" />
        <span className="font-extrabold tracking-tight text-zinc-900">TechBody U</span>
      </div>
      <nav className="flex items-center gap-1">
        <NavLink to="/" className={cls}><span className="inline-flex items-center gap-1"><Home size={16}/> Home</span></NavLink>
        <NavLink to="/estatisticas" className={cls}><span className="inline-flex items-center gap-1"><BarChart3 size={16}/> Estatísticas</span></NavLink>
        <NavLink to="/conquistas" className={cls}><span className="inline-flex items-center gap-1"><Bell size={16}/> Conquistas</span></NavLink>
        <NavLink to="/avisos" className={cls}><span className="inline-flex items-center gap-1 relative"><Megaphone size={16}/> Avisos{unread>0 && <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] grid place-items-center">{unread}</span>}</span></NavLink>
        <NavLink to="/perfil" className={cls}><span className="inline-flex items-center gap-1"><User size={16}/> Perfil</span></NavLink>
      </nav>
    </header>
  )
}
