import { NavLink } from 'react-router-dom'
import { Home, BarChart3, Bell, User } from 'lucide-react'
export default function BottomNav(){
  const cls = ({isActive}:{isActive:boolean})=> `flex flex-col items-center justify-center gap-1 text-[11px] ${isActive?'text-[#FF7A1A]':'text-zinc-400'}`
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 h-[64px] bg-white border-t border-zinc-200 flex z-30">
      <NavLink to="/" className={cls} style={{flex:1}}><Home size={20} strokeWidth={2}/><span className="text-[10px]">Home</span></NavLink>
      <NavLink to="/estatisticas" className={cls} style={{flex:1}}><BarChart3 size={20}/><span className="text-[10px]">Stats</span></NavLink>
      <NavLink to="/conquistas" className={cls} style={{flex:1}}><div className="relative"><Bell size={20}/><span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"/></div><span className="text-[10px]">Conq.</span></NavLink>
      <NavLink to="/perfil" className={cls} style={{flex:1}}><User size={20}/><span className="text-[10px]">Perfil</span></NavLink>
    </nav>
  )
}
