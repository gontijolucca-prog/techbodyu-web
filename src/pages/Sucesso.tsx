import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
export default function Sucesso(){
  return (
    <div className="min-h-full bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-[340px] p-6 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-100 rounded-full opacity-60"/>
        <div className="mx-auto w-8 h-8 rounded-full bg-orange-100 text-[#FF7A1A] grid place-items-center text-sm">🎉</div>
        <p className="text-[11px] text-zinc-500 mt-2">Parabéns! Concluíste este treino com sucesso.</p>
        <div className="mx-auto mt-3 w-12 h-12 rounded-full bg-orange-50 grid place-items-center text-[#FF7A1A]"><Trophy size={22}/></div>
        <div className="mt-3 inline-flex items-center gap-1 bg-[#FFF7ED] border border-orange-200 text-[#FF7A1A] text-xs font-bold px-3 py-1.5 rounded-full">🏅 +50 pontos</div>
        <div className="flex gap-2 mt-4">
          <div className="flex-1 bg-sky-50 border border-sky-100 rounded-xl p-3">
            <div className="text-sky-600 text-xs">⏱</div><div className="text-sm font-bold text-zinc-900">29 min</div><div className="text-[11px] text-zinc-500">Tempo</div>
          </div>
          <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-3">
            <div className="text-red-500 text-xs">🔥</div><div className="text-sm font-bold text-zinc-900">233 kcal</div><div className="text-[11px] text-zinc-500">Calorias</div>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-xs font-bold text-zinc-900">Como foi o treino?</div>
          <p className="text-[11px] text-zinc-500">Partilha a tua experiência sobre esta sessão</p>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-red-500">❤ Gostou do treino?</div>
            <div className="flex justify-center gap-1 mt-1 text-zinc-300 text-lg">
              {Array.from({length:5}).map((_,i)=><span key={i}>☆</span>)}
            </div>
            <div className="text-[11px] font-semibold text-zinc-700 mt-3">⚡ Este treino foi…</div>
            <div className="flex justify-center gap-2 mt-2">
              {['Muito fácil','Leve','Moderado','Cansativo','Exausto'].map(l=>(
                <span key={l} className="text-[10px] leading-tight text-center text-zinc-500 w-12">{l}<br/>😐</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Link to="/" className="flex-1 border border-orange-200 text-orange-600 rounded-full py-2.5 text-sm font-bold">Pular</Link>
          <Link to="/" className="flex-1 bg-[#FF7A1A] text-white rounded-full py-2.5 text-sm font-bold">Salvar</Link>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1 opacity-40">
          {['🎉','✨','🎊'].map((e,i)=><span key={i}>{e}</span>)}
        </div>
      </div>
    </div>
  )
}
