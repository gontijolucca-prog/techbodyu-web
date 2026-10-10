import { NavLink } from 'react-router-dom'
import { Home, BarChart3, Bell, User } from 'lucide-react'
export default function BottomNav(){
  const cls = ({isActive}:{isActive:boolean})=> `flex flex-col items-center justify-center gap-0.5 text-[11px] relative flex-1 py-2 ${isActive?'text-[#FF7A1A]':'text-zinc-400 active:text-zinc-600'}`
  const dot = "absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-zinc-200/70 flex pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
      <NavLink to="/" className={cls} style={{ WebkitTapHighlightColor: 'transparent' }} onClick={()=>{ try{navigator.vibrate(10)}catch{}}}>
        {({isActive})=> <><Home size={22} strokeWidth={isActive?2.4:1.9} className={isActive?'fill-orange-50':''}/><span className={`text-[10px] tracking-wide ${isActive?'font-bold':'font-medium'}`}>Home</span>{isActive && <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF7A1A] rounded-full"/>}</>}
      </NavLink>
      <NavLink to="/estatisticas" className={cls} onClick={()=>{ try{navigator.vibrate(10)}catch{}}}>
        {({isActive})=> <><BarChart3 size={22} strokeWidth={isActive?2.4:1.9}/><span className={`text-[10px] ${isActive?'font-bold':'font-medium'}`}>Stats</span>{isActive && <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF7A1A] rounded-full"/>}</>}
      </NavLink>
      <NavLink to="/conquistas" className={cls} onClick={()=>{ try{navigator.vibrate(10)}catch{}}}>
        {({isActive})=> <><div className="relative"><Bell size={22} strokeWidth={isActive?2.4:1.9}/><span className={dot}/></div><span className={`text-[10px] ${isActive?'font-bold':'font-medium'}`}>Conq.</span>{isActive && <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF7A1A] rounded-full"/>}</>}
      </NavLink>
      <NavLink to="/perfil" className={cls} onClick={()=>{ try{navigator.vibrate(10)}catch{}}}>
        {({isActive})=> <><User size={22} strokeWidth={isActive?2.4:1.9}/><span className={`text-[10px] ${isActive?'font-bold':'font-medium'}`}>Perfil</span>{isActive && <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF7A1A] rounded-full"/>}</>}
      </NavLink>
    </nav>
  )
}
