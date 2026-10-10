import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Minus, Plus, Bluetooth, Zap, Droplets, Power, CheckCircle2 } from 'lucide-react'
import { useAppState } from '../context/AppState'

export default function EMSControl(){
  const { calibracoes, setCalib } = useAppState()
  const [mockConnected,setMock]=useState(()=>{
    const s=localStorage.getItem('tbu:ems:connected')
    return s ? s==='1' : false
  })
  const [desligado,setDesligado]=useState(()=>{
    return localStorage.getItem('tbu:ems:paused')==='1'
  })
  const [toast,setToast]=useState<string|null>(null)
  const [scanning,setScanning]=useState(false)
  const [found,setFound]=useState<string[]>([])
  const muscles=['Peitoral','Glúteos','Abdómen','Tríceps','Bíceps','Isquiotibiais','Trapézio']
  const [wizard,setWizard]=useState(false)
  const [step,setStep]=useState(0)
  const cur = muscles[step]
  const [intCur,setIntCur]=useState(1)
  useEffect(()=> localStorage.setItem('tbu:ems:connected', mockConnected?'1':'0'),[mockConnected])
  useEffect(()=> localStorage.setItem('tbu:ems:paused', desligado?'1':'0'),[desligado])
  useEffect(()=>{
    if(wizard) setIntCur(calibracoes[cur] ?? 1)
  },[wizard, step, cur, calibracoes])
  useEffect(()=>{
    if(toast){ const t=setTimeout(()=>setToast(null),2400); return ()=>clearTimeout(t) }
  },[toast])
  const showToast=(m:string)=> setToast(m)

  const startScan=()=>{
    setScanning(true); setFound([])
    showToast('A procurar fato via Bluetooth…')
    setTimeout(()=> setFound(['EMS-TechBody-A3F9','EMS-Suit-2841']),1200)
    setTimeout(()=> setScanning(false),1600)
  }
  const connect=(id:string)=>{
    setMock(true); setDesligado(false); showToast(`Ligado a ${id} ✓`)
  }

  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3 flex items-center gap-3">
        <Link to="/perfil" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600 transition-colors"><ChevronLeft size={18}/></Link>
        <h1 className="flex-1 text-center md:text-left text-sm md:text-base font-bold text-[#FF7A1A]">My EMS Control</h1>
        <span className="w-8"/>
      </div>

      {!mockConnected ? (
        <div className="p-4 md:p-6 max-w-[640px] mx-auto">
          <div className="bg-white rounded-[20px] border border-zinc-200 p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#FF7A1A] text-sm font-bold"><Bluetooth size={18}/> Como ligar o fato</div>
            <p className="text-xs text-zinc-500 mt-1">3 passos — demora 20 segundos</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3">
                <div className="w-9 h-9 mx-auto rounded-xl bg-white border border-orange-200 grid place-items-center text-[#FF7A1A]"><Droplets size={16}/></div>
                <div className="text-xs font-bold mt-2">1. Veste & humedece</div>
                <div className="text-[11px] text-zinc-500 leading-tight mt-1">Água ou gel nas zonas pretas do fato</div>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3">
                <div className="w-9 h-9 mx-auto rounded-xl bg-zinc-900 text-white grid place-items-center"><Power size={16}/></div>
                <div className="text-xs font-bold mt-2">2. Liga o módulo</div>
                <div className="text-[11px] text-zinc-500 leading-tight mt-1">Botão no peito 3s até LED azul piscar</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-500 text-white grid place-items-center"><Bluetooth size={16}/></div>
                <div className="text-xs font-bold mt-2">3. Emparelha</div>
                <div className="text-[11px] text-zinc-500 leading-tight mt-1">Toca abaixo em Ligar Fato</div>
              </div>
            </div>

            <div className="mt-6">
              {!scanning && found.length===0 && (
                <button onClick={startScan} className="w-full bg-[#FF7A1A] hover:bg-orange-600 text-white rounded-full py-4 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-colors">
                  <Bluetooth size={18}/> Ligar Fato via Bluetooth
                </button>
              )}
              {scanning && (
                <div className="w-full border-2 border-dashed border-orange-200 rounded-2xl p-5 text-center bg-orange-50/50">
                  <div className="w-10 h-10 mx-auto rounded-full border-2 border-orange-300 border-t-[#FF7A1A] animate-spin"/>
                  <div className="text-sm font-bold mt-3 text-zinc-900">A procurar…</div>
                  <div className="text-xs text-zinc-500">Mantém o telemóvel perto do módulo (≤1m) • Bluetooth ligado</div>
                </div>
              )}
              {found.length>0 && !scanning && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-700">Dispositivos encontrados — toca para ligar:</div>
                  {found.map(id=>(
                    <button key={id} onClick={()=>connect(id)} className="w-full bg-white border-2 border-[#FF7A1A] rounded-2xl p-3.5 flex items-center justify-between hover:bg-orange-50 transition-colors text-left">
                      <span className="flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-zinc-900 text-white grid place-items-center"><Zap size={14}/></span><span className="text-sm font-bold text-zinc-900">{id}</span></span>
                      <span className="text-xs font-bold text-[#FF7A1A]">Ligar ›</span>
                    </button>
                  ))}
                  <button onClick={startScan} className="w-full text-xs text-zinc-500 hover:text-zinc-700 py-2">↻ Procurar novamente</button>
                </div>
              )}
              <p className="text-[11px] text-zinc-400 text-center mt-3">Sem o fato? Usa <span className="font-bold text-zinc-600">Modo Demo</span> — <button onClick={()=>{setMock(true); showToast('Modo Demo ligado')}} className="underline text-[#FF7A1A]">ligar demo</button></p>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-2xl border border-zinc-200 p-4 flex gap-3">
            <img src="/assets/images/suit-front.png" alt="suit" className="w-20 h-32 object-contain opacity-90"/>
            <div className="flex-1">
              <div className="text-xs font-bold text-zinc-900">Precisas de ajuda?</div>
              <div className="text-xs text-zinc-500 mt-1 leading-relaxed">Vídeo de 45s: como vestir e apertar. O gel melhora o contacto — sem dor.</div>
              <button onClick={()=>showToast('Vídeo: em breve — verás no YouTube TechBody')} className="mt-2 text-xs font-bold text-[#FF7A1A] hover:underline">Ver vídeo ›</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={`mx-4 md:mx-6 mt-4 text-sm px-4 py-3 rounded-xl border flex items-center justify-between ${!desligado ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>
            <span className="flex items-center gap-2">{!desligado ? <><CheckCircle2 size={16}/> Fato ligado • sincronizado • 99%</> : <>○ Em pausa — sem estímulo</>}</span>
            <span className={`w-2 h-2 rounded-full ${!desligado ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}/>
          </div>
          <div className="p-4 md:p-6 max-w-[800px] mx-auto space-y-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-zinc-900">My Device</div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${!desligado ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>{!desligado ? '● Ligado' : '○ Pausa'}</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className={`w-11 h-11 rounded-xl grid place-items-center text-white ${desligado?'bg-zinc-400':'bg-zinc-900'}`}><Bluetooth size={18}/></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{!desligado ? 'EMS-TechBody-A3F9' : 'EMS Device (Pausa)'}</div>
                  <div className={`text-xs ${!desligado?'text-emerald-600':'text-zinc-500'}`}>{!desligado ? '● Ligado • 99% • Bluetooth 5.0' : '○ Em pausa • toca em Ligar'}</div>
                </div>
                <img src="/assets/images/suit-front.png" alt="suit" className="w-12 h-16 object-contain opacity-80 hidden sm:block"/>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={()=>{
                  setDesligado(v=>!v); showToast(!desligado ? 'Dispositivo em pausa' : 'Dispositivo ligado')
                }} className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors cursor-pointer ${desligado?'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600':'border-orange-200 text-orange-600 hover:bg-orange-50'}`}>{desligado ? '▶ Ligar' : '⏸ Pausa'}</button>
                <button onClick={()=>{ setMock(false); setDesligado(false); showToast('Dispositivo desligado — volta a ligar em 3 passos')}} className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 text-sm font-semibold hover:bg-zinc-50 cursor-pointer">Desconectar</button>
                <button onClick={()=>{ setMock(false); setDesligado(false); showToast('Removido')}} className="ml-auto px-3 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100">Remover</button>
              </div>
              <div className="mt-3 text-[11px] text-zinc-400">Dica: mantém o módulo carregado • LED azul = pronto • vermelho = a carregar</div>
            </div>

            <button onClick={()=>{ if(desligado){ showToast('Fato em pausa — liga primeiro'); return } setStep(0); setWizard(true)}} className="w-full bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3A] text-white rounded-2xl p-5 text-left flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
              <div>
                <div className="text-sm md:text-base font-bold">Calibração de Intensidade</div>
                <div className="text-xs md:text-sm opacity-90 mt-0.5">Calibre a intensidade ideal para cada grupo muscular</div>
              </div>
              <span className="text-2xl">›</span>
            </button>

            <div className="bg-white rounded-2xl border border-zinc-200 p-4 md:p-5">
              <div className="text-sm font-bold text-zinc-900">Ajustes rápidos — toca Calibrar para sentir</div>
              <div className="text-xs text-zinc-500 mt-1">Cada zona guarda o seu nível — começa em 1 e sobe devagar.</div>
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
                        if(desligado){ showToast('Fato em pausa — liga primeiro'); return }
                        const idx=muscles.indexOf(m); setStep(idx); setIntCur(v); setWizard(true)
                      }} className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer">Calibrar</button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}

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
      {toast && <div className="fixed bottom-[80px] md:bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg z-50 text-center max-w-[90%]">{toast}</div>}
    </div>
  )
}
