import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Minus, Plus } from 'lucide-react'
import { useAppState } from '../context/AppState'

export default function EMSControl(){
  const { calibracoes, setCalib } = useAppState()
  const [mockConnected,setMock]=useState(true)
  const [desligado,setDesligado]=useState(false)
  const [toast,setToast]=useState<string|null>(null)
  const muscles=['Peitoral','Glúteos','Abdómen','Tríceps','Bíceps','Isquiotibiais','Trapézio']
  const [wizard,setWizard]=useState(false)
  const [step,setStep]=useState(0)
  const cur = muscles[step]
  const [intCur,setIntCur]=useState(1)
  useEffect(()=>{
    if(wizard) setIntCur(calibracoes[cur] ?? 1)
  },[wizard, step, cur, calibracoes])
  useEffect(()=>{
    if(toast){ const t=setTimeout(()=>setToast(null),2200); return ()=>clearTimeout(t) }
  },[toast])
  const showToast=(m:string)=> setToast(m)
  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3 flex items-center gap-3">
        <Link to="/perfil" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600 transition-colors"><ChevronLeft size={18}/></Link>
        <h1 className="flex-1 text-center md:text-left text-sm md:text-base font-bold text-[#FF7A1A]">My EMS Control</h1>
        <span className="w-8"/>
      </div>
      {(mockConnected && !desligado) && <div className="mx-4 md:mx-6 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-xl">✓ Mock Connected — O fato está sincronizado ( Mock 99% )</div>}
      {desligado && mockConnected && <div className="mx-4 md:mx-6 mt-4 bg-zinc-100 border border-zinc-200 text-zinc-600 text-sm px-4 py-2.5 rounded-xl">○ Desligado — O fato está em pausa</div>}
      {!mockConnected && <div className="mx-4 md:mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl flex items-center justify-between">✕ Dispositivo removido <button onClick={()=>{setMock(true); setDesligado(false); showToast('Dispositivo reconectado')}} className="text-xs font-bold bg-white border border-red-200 px-3 py-1 rounded-full hover:bg-red-50">Reconectar</button></div>}
      <div className="p-4 md:p-6 max-w-[800px] mx-auto space-y-4">
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 md:p-5">
          <div className="text-sm font-bold text-zinc-900">My Device</div>
          <div className="flex items-center gap-3 mt-3">
            <div className={`w-11 h-11 rounded-xl grid place-items-center text-white ${desligado||!mockConnected?'bg-zinc-400':'bg-zinc-900'}`}>📱</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{mockConnected && !desligado ? 'EMS Device (Mock)' : mockConnected && desligado ? 'EMS Device (Pausa)' : 'Sem dispositivo'}</div>
              <div className={`text-xs ${mockConnected && !desligado?'text-emerald-600': mockConnected && desligado?'text-zinc-500':'text-red-500'}`}>{mockConnected && !desligado ? '● Ligado • 99%' : mockConnected && desligado ? '○ Em pausa' : '● Desconectado'}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={()=>{
              if(!mockConnected) return showToast('Sem dispositivo')
              setDesligado(v=>!v); showToast(desligado ? 'Dispositivo ligado' : 'Dispositivo em pausa')
            }} className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors cursor-pointer ${desligado?'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600':'border-orange-200 text-orange-600 hover:bg-orange-50'}`}>{desligado ? '▶ Ligar' : '⏸ Desligar'}</button>
            <button onClick={()=>{ setMock(false); setDesligado(false); showToast('Dispositivo removido')}} className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 cursor-pointer">🗑 Remover</button>
            {!mockConnected && <button onClick={()=>{setMock(true); showToast('Dispositivo reconectado')}} className="px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-black cursor-pointer">↻ Reconectar</button>}
          </div>
        </div>

        <button onClick={()=>{ if(!mockConnected){ showToast('Conecta o fato primeiro') } else { setStep(0); setWizard(true)}}} className="w-full bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3A] text-white rounded-2xl p-5 text-left flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div>
            <div className="text-sm md:text-base font-bold">Calibração de Intensidade</div>
            <div className="text-xs md:text-sm opacity-90 mt-0.5">Calibre a intensidade ideal para cada grupo muscular</div>
          </div>
          <span className="text-2xl">›</span>
        </button>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 md:p-5">
          <div className="text-sm font-bold text-zinc-900">Ajustes de Calibração</div>
          <div className="text-xs text-zinc-500 mt-1">Clique em “Calibrar” para activar o estímulo e ajuste com +/− — os valores guardam em memória.</div>
          <div className="mt-4 space-y-1">
            {muscles.map(m=>{
              const v = calibracoes[m] ?? 1
              return (
                <div key={m} className="flex items-center gap-2 py-2.5 border-b border-zinc-100 last:border-0">
                  <span className="w-28 md:w-36 text-sm text-zinc-700">{m}</span>
                  <button onClick={()=>setCalib(m, v-1)} className="w-8 h-8 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 cursor-pointer"><Minus size={14}/></button>
                  <span className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center text-sm font-bold">{v}</span>
                  <button onClick={()=>setCalib(m, v+1)} className="w-8 h-8 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 cursor-pointer"><Plus size={14}/></button>
                  <button onClick={()=>{
                    if(!mockConnected){ showToast('Sem dispositivo') ; return }
                    if(desligado){ showToast('Fato em pausa — liga primeiro'); return }
                    const idx=muscles.indexOf(m); setStep(idx); setIntCur(v); setWizard(true)
                  }} className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer">Calibrar</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {wizard && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[440px] p-5 md:p-6 shadow-2xl">
            <h2 className="text-sm md:text-base font-bold text-[#FF7A1A] text-center">CALIBRAÇÃO DE INTENSIDADE</h2>
            <p className="text-xs text-zinc-500 text-center mt-1.5">Sinta o estímulo e ajuste ao seu nível de conforto.</p>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800">⚠ Pelo menos 5 min de aquecimento ou gel condutor nas zonas de contacto.</div>
            <div className="mt-5 border-2 border-[#FF7A1A] rounded-xl p-3 text-center font-bold text-sm md:text-base text-zinc-900">{cur} • {intCur}%</div>
            <div className="mt-4 bg-zinc-50 rounded-2xl p-5 text-center">
              <div className="text-sm font-bold text-zinc-700">Ajustar Intensidade</div>
              <div className="flex items-center justify-center gap-5 mt-4">
                <button onClick={()=>setIntCur(v=>Math.max(0,v-1))} className="w-10 h-10 rounded-full bg-white border border-zinc-200 grid place-items-center hover:bg-zinc-50 cursor-pointer"><Minus size={18}/></button>
                <div className="w-14 h-14 rounded-full bg-[#FF7A1A] text-white grid place-items-center text-xl font-bold">{intCur}</div>
                <button onClick={()=>setIntCur(v=>Math.min(100,v+1))} className="w-10 h-10 rounded-full bg-white border border-zinc-200 grid place-items-center hover:bg-zinc-50 cursor-pointer"><Plus size={18}/></button>
              </div>
              <div className="text-xs text-zinc-500 mt-3">Progresso: {step+1}/7 • {muscles[step]}</div>
              <button onClick={()=>{ const prev=muscles[step]; if(intCur===0) showToast('Intensidade 0 — sem estímulo'); setCalib(prev,intCur)}} className="mt-3 text-xs font-bold text-emerald-600 hover:underline cursor-pointer">Testar agora — aplicar {intCur}% em {cur}</button>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setWizard(false)} className="flex-1 border border-zinc-200 rounded-full py-3 text-sm font-semibold hover:bg-zinc-50 cursor-pointer">Fechar</button>
              <button onClick={()=>{ setCalib(cur, intCur); if(step<muscles.length-1){ setStep(s=>s+1); setIntCur(calibracoes[muscles[step+1]]??1)} else { showToast('Calibração concluída'); setWizard(false)}}} className="flex-1 bg-[#FF7A1A] hover:bg-orange-600 text-white rounded-full py-3 text-sm font-bold transition-colors cursor-pointer">→ Seguinte</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-[80px] md:bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg z-50">{toast}</div>}
    </div>
  )
}
