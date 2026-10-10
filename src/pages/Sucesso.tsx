import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Star } from 'lucide-react'
export default function Sucesso(){
  const [stars,setStars]=useState(0)
  const [efeito,setEfeito]=useState<string|null>(null)
  return (
    <div className="min-h-full bg-gradient-to-b from-black/80 to-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-[400px] p-6 md:p-7 text-center relative overflow-hidden shadow-2xl">
        <div className="mx-auto w-9 h-9 rounded-full bg-orange-100 text-[#FF7A1A] grid place-items-center">🎉</div>
        <p className="text-xs text-zinc-500 mt-2">Parabéns! Concluíste este treino com sucesso.</p>
        <div className="mx-auto mt-3 w-14 h-14 rounded-full bg-orange-50 grid place-items-center text-[#FF7A1A]"><Trophy size={24}/></div>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-[#FFF7ED] border border-orange-200 text-[#FF7A1A] text-sm font-bold px-4 py-2 rounded-full">🏅 +50 pontos</div>
        <div className="flex gap-3 mt-5">
          <div className="flex-1 bg-sky-50 border border-sky-100 rounded-xl p-3">
            <div className="text-sky-600 text-xs">⏱</div><div className="text-base font-bold text-zinc-900">29 min</div><div className="text-xs text-zinc-500">Tempo</div>
          </div>
          <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-3">
            <div className="text-red-500 text-xs">🔥</div><div className="text-base font-bold text-zinc-900">233 kcal</div><div className="text-xs text-zinc-500">Calorias</div>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-sm font-bold text-zinc-900">Como foi o treino?</div>
          <p className="text-xs text-zinc-500">Partilha a tua experiência sobre esta sessão</p>
          <div className="mt-4">
            <div className="text-xs font-semibold text-zinc-700">❤ Gostou do treino?</div>
            <div className="flex justify-center gap-1 mt-2">
              {Array.from({length:5}).map((_,i)=>(
                <button key={i} onClick={()=>setStars(i+1)} className="p-1 cursor-pointer">
                  <Star size={26} className={i < stars ? 'fill-[#FF7A1A] text-[#FF7A1A]' : 'text-zinc-300'}/>
                </button>
              ))}
            </div>
            <div className="text-xs font-semibold text-zinc-700 mt-4">⚡ Este treino foi…</div>
            <div className="flex justify-center gap-1.5 mt-2">
              {[
                {l:'Muito fácil',e:'😊'},
                {l:'Leve',e:'🙂'},
                {l:'Moderado',e:'😐'},
                {l:'Cansativo',e:'😤'},
                {l:'Exausto',e:'🥵'},
              ].map(o=>(
                <button key={o.l} onClick={()=>setEfeito(o.l)} className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${efeito===o.l?'bg-[#FF7A1A] text-white border-[#FF7A1A]':'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-white'}`}>
                  <div className="text-base">{o.e}</div>{o.l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Link to="/" className="flex-1 border border-zinc-200 text-zinc-700 rounded-full py-3 text-sm font-bold hover:bg-zinc-50 text-center">Pular</Link>
          <Link to="/" className="flex-1 bg-[#FF7A1A] hover:bg-orange-600 text-white rounded-full py-3 text-sm font-bold text-center">Salvar</Link>
        </div>
      </div>
    </div>
  )
}
