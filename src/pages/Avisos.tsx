import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Megaphone } from 'lucide-react'
import { useAppState } from '../context/AppState'

export default function Avisos(){
  const { notifications, markNotificationsSeen } = useAppState()
  useEffect(()=>{ markNotificationsSeen() },[])
  const fmt = (iso:string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-PT', { day:'numeric', month:'short' }) + ' • ' + d.toLocaleTimeString('pt-PT', { hour:'2-digit', minute:'2-digit' })
  }
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3 flex items-center gap-3">
        <Link to="/" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600"><ChevronLeft size={18}/></Link>
        <h1 className="flex-1 text-center md:text-left text-sm md:text-base font-bold tracking-widest text-[#FF7A1A]">AVISOS</h1>
        <span className="w-8"/>
      </div>
      <div className="p-4 md:p-6 max-w-[800px] mx-auto space-y-2">
        {notifications.length===0 && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 text-center">
            <p className="text-sm font-semibold text-zinc-900">Sem avisos por agora</p>
            <p className="text-xs text-zinc-500 mt-1">As novidades da equipa aparecem aqui.</p>
          </div>
        )}
        {notifications.map(n=>(
          <div key={n.id} className="bg-white rounded-2xl border border-zinc-200 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-[#FF7A1A] grid place-items-center shrink-0"><Megaphone size={16}/></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-zinc-900">{n.title}</div>
              {n.body && <div className="text-sm text-zinc-600 mt-1 whitespace-pre-wrap">{n.body}</div>}
              <div className="text-[11px] text-zinc-400 mt-1">{fmt(n.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
