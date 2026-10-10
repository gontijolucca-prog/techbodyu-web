import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Minus, Plus, Bluetooth, Droplets, Power, CheckCircle2, Battery, Unplug, AlertTriangle } from 'lucide-react'
import { useAppState } from '../context/AppState'
import { isBluetoothSupported, requestEMSDevice, requestAnyDevice, connectDevice, readBattery, discoverServices, writeIntensity } from '../lib/ems-bluetooth'

export default function EMSControl(){
  const { calibracoes, setCalib, bleConnected, bleName, bleBattery, bleServer, setBleConnection, clearBle, demoMode, setDemoMode } = useAppState() as any
  const [paused,setPaused]=useState(()=> localStorage.getItem('tbu:ems:paused')==='1')
  const [toast,setToast]=useState<string|null>(null)
  const [scanning,setScanning]=useState(false)
  const [services,setServices]=useState<string[]>([])
  const [btSupported,setBtSupported]=useState<boolean>(true)
  const [error,setError]=useState<string|null>(null)
  const muscles=['Peitoral','Glúteos','Abdómen','Tríceps','Bíceps','Isquiotibiais','Trapézio']
  const [wizard,setWizard]=useState(false)
  const [step,setStep]=useState(0)
  const cur = muscles[step]
  const [intCur,setIntCur]=useState(1)
  const connected = bleConnected || demoMode
  const isDemoOnly = demoMode && !bleConnected

  useEffect(()=> setBtSupported(isBluetoothSupported()),[])
  useEffect(()=> localStorage.setItem('tbu:ems:paused', paused?'1':'0'),[paused])
  useEffect(()=>{
    if(wizard) setIntCur(calibracoes[cur] ?? 1)
  },[wizard, step, cur, calibracoes])
  useEffect(()=>{
    if(toast){ const t=setTimeout(()=>setToast(null),2800); return ()=>clearTimeout(t) }
  },[toast])
  useEffect(()=>{
    if(error){ const t=setTimeout(()=>setError(null),5000); return ()=>clearTimeout(t) }
  },[error])

  const showToast=(m:string)=> setToast(m)

  const handleRealConnect = async (useAny=false)=>{
    setError(null)
    if(!isBluetoothSupported()){
      setError('Bluetooth não suportado. Usa Chrome/Edge atualizado em Android/Desktop via HTTPS. No iPhone, o Web Bluetooth é limitado — usa Chrome iOS 16.4+ ou app nativa. Podes testar em Modo Demo.')
      return
    }
    setScanning(true)
    try{
      const dev = useAny ? await requestAnyDevice() : await requestEMSDevice()
      const name = dev.name || dev.id.slice(0,12)
      showToast(`A ligar a ${name}…`)
      const srv = await connectDevice(dev)
      const b = await readBattery(srv)
      const svcs = await discoverServices(srv)
      setServices(svcs)
      setBleConnection(dev, srv, name, b)
      showToast(`Ligado a ${name} ✓ ${b!==undefined ? '• '+b+'%' : '• BLE'}`)
    }catch(e:any){
      const msg = e?.message || String(e)
      if(msg.includes('Nenhum') || msg.includes('Cancelado')) showToast('Cancelado')
      else if(msg.includes('User cancelled') || msg.includes('NotFoundError')) showToast('Cancelado — não foi selecionado dispositivo')
      else setError(msg)
    }finally{ setScanning(false) }
  }

  const handleIntensityWrite = async (muscle:string, value:number)=>{
    setCalib(muscle, value)
    if(bleConnected && bleServer){
      const ok = await writeIntensity(bleServer, muscle, value)
      if(ok) showToast(`Enviado ${value}% para ${muscle} via BLE`)
    }
  }

  const testIntensity = async ()=>{
    setCalib(cur, intCur)
    if(bleConnected && bleServer){
      const ok = await writeIntensity(bleServer, cur, intCur)
      showToast(ok ? `Teste ${intCur}% enviado para ${cur} ✓ BLE` : `Guardado ${intCur}% (BLE sem confirmação)`)
    } else {
      showToast(`Guardado ${intCur}%` + (isDemoOnly ? ' — Demo' : ''))
    }
  }

  return (
    <div className="pb-6 bg-[#FAFAF8] min-h-full">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-3 flex items-center gap-3">
        <Link to="/perfil" className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center hover:bg-orange-600 transition-colors"><ChevronLeft size={18}/></Link>
        <h1 className="flex-1 text-center md:text-left text-sm md:text-base font-bold text-[#FF7A1A]">My EMS Control</h1>
        <span className="w-8"/>
      </div>

      {!connected ? (
        <div className="p-4 md:p-6 max-w-[640px] mx-auto">
          <div className="bg-white rounded-[20px] border border-zinc-200 p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#FF7A1A] text-sm font-bold"><Bluetooth size={18}/> Como ligar o fato — Bluetooth real</div>
            <p className="text-xs text-zinc-500 mt-1">3 passos — 20s • ligação BLE verdadeira via Web Bluetooth</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3">
                <div className="w-9 h-9 mx-auto rounded-xl bg-white border border-orange-200 grid place-items-center text-[#FF7A1A]"><Droplets size={16}/></div>
                <div className="text-xs font-bold mt-2">1. Veste & humedece</div>
                <div className="text-[11px] text-zinc-500 leading-tight mt-1">Água ou gel nas zonas pretas</div>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3">
                <div className="w-9 h-9 mx-auto rounded-xl bg-zinc-900 text-white grid place-items-center"><Power size={16}/></div>
                <div className="text-xs font-bold mt-2">2. Liga o módulo</div>
                <div className="text-[11px] text-zinc-500 leading-tight mt-1">Botão no peito 3s até LED azul piscar</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-500 text-white grid place-items-center"><Bluetooth size={16}/></div>
                <div className="text-xs font-bold mt-2">3. Emparelha</div>
                <div className="text-[11px] text-zinc-500 leading-tight mt-1">Toca em Ligar — escolhe na lista nativa do sistema</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button onClick={()=>handleRealConnect(false)} disabled={scanning} className="w-full bg-[#FF7A1A] hover:bg-orange-600 disabled:opacity-60 text-white rounded-full py-4 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-colors">
                {scanning ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>{' '}A procurar…</> : <><Bluetooth size={18}/> Ligar Fato via Bluetooth</>}
              </button>
              <button onClick={()=>handleRealConnect(true)} disabled={scanning} className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-full py-3 text-xs font-bold">Procurar todos os dispositivos BLE</button>
              {!btSupported && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex gap-2"><AlertTriangle size={14} className="shrink-0 mt-0.5"/> Este browser não tem Web Bluetooth. Instala Chrome/Edge atualizado em Android/Desktop e abre via HTTPS. No iPhone o suporte é limitado.</div>}
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{error}</div>}
              <p className="text-[11px] text-zinc-400 text-center">Sem hardware? <button onClick={()=>{setDemoMode(true); showToast('Modo Demo ligado — sem BLE real')}} className="underline text-[#FF7A1A] font-bold">Usar Modo Demo</button> (não liga de verdade, só simula)</p>
              <p className="text-[11px] text-zinc-500 text-center leading-relaxed">Requer HTTPS + gesto do utilizador. O sistema operativo mostra a lista real de dispositivos BLE próximos — só aparece o fato se estiver ligado e perto (&lt;1m).</p>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-2xl border border-zinc-200 p-4 flex gap-3">
            <img src="/assets/images/suit-front.png" alt="suit" className="w-20 h-32 object-contain opacity-90"/>
            <div className="flex-1">
              <div className="text-xs font-bold text-zinc-900">Precisas de ajuda?</div>
              <div className="text-xs text-zinc-500 mt-1 leading-relaxed">LED azul intermitente = pronto. Verifica permissões de Bluetooth no sistema e mantém o telemóvel perto.</div>
              <button onClick={()=>showToast('Dica: reinicia o módulo, confirma Bluetooth ativo, aproxima o telemóvel.')} className="mt-2 text-xs font-bold text-[#FF7A1A] hover:underline">Diagnóstico ›</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={`mx-4 md:mx-6 mt-4 text-sm px-4 py-3 rounded-xl border flex items-center justify-between ${!paused ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>
            <span className="flex items-center gap-2">{!paused ? <><CheckCircle2 size={16}/> {isDemoOnly ? 'Modo Demo — sem BLE real' : `Ligado BLE • ${bleName || 'EMS Device'} ${bleBattery!==undefined ? '• '+bleBattery+'%' : ''}`}</> : <>○ Em pausa — sem estímulo</>}</span>
            <span className="flex items-center gap-1.5">{bleBattery!==undefined && <span className="flex items-center gap-1 text-xs font-bold"><Battery size={12}/>{bleBattery}%</span>} <span className={`w-2 h-2 rounded-full ${!paused ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}/></span>
          </div>
          {isDemoOnly && <div className="mx-4 md:mx-6 mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">Demo ativo — não há ligação BLE. Liga o fato para controlo real via Bluetooth.</div>}
          {bleConnected && services.length>0 && <div className="mx-4 md:mx-6 mt-2 text-[11px] text-zinc-500">GATT serviços: {services.slice(0,3).join(', ')}{services.length>3?' …':''}</div>}
          <div className="p-4 md:p-6 max-w-[800px] mx-auto space-y-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-zinc-900">My Device</div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${!paused ? (isDemoOnly ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700') : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>{bleConnected ? '● BLE real' : isDemoOnly ? '● Demo (simulado)' : '○ Pausa'}</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className={`w-11 h-11 rounded-xl grid place-items-center text-white ${paused?'bg-zinc-400': isDemoOnly ? 'bg-amber-500' : 'bg-zinc-900'}`}><Bluetooth size={18}/></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{bleName || (isDemoOnly ? 'EMS Device (Demo)' : 'EMS Device (BLE)')}</div>
                  <div className={`text-xs ${!paused?'text-emerald-600':'text-zinc-500'}`}>{!paused ? (isDemoOnly ? 'Demo • sem hardware • local' : `BLE conectado • ${bleBattery!==undefined? bleBattery+'% • ':''}Web Bluetooth`) : '○ Em pausa • sem estímulo'}</div>
                </div>
                <img src="/assets/images/suit-front.png" alt="suit" className="w-12 h-16 object-contain opacity-80 hidden sm:block"/>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <button onClick={()=>{ setPaused(v=>!v); showToast(!paused ? 'Pausa — BLE mantém ligado' : 'Retomado — pronto para enviar') }} className={`px-4 py-2 rounded-full border text-sm font-semibold ${paused?'bg-emerald-500 text-white border-emerald-500':'border-orange-200 text-orange-600 hover:bg-orange-50'}`}>{paused ? '▶ Retomar' : '⏸ Pausa'}</button>
                {bleConnected ? <button onClick={()=>{ clearBle(); setServices([]); showToast('BLE desligado — volta a Ligar') }} className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 text-sm font-semibold hover:bg-zinc-50"><Unplug size={14} className="inline mr-1"/> Desligar BLE</button> : <button onClick={()=>{setDemoMode(false); showToast('Demo desligado')}} className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 text-sm font-semibold">Sair Demo</button>}
                <button onClick={()=>{ if(bleConnected) clearBle(); setDemoMode(false); setServices([]); showToast('Removido')}} className="ml-auto px-3 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100">Remover</button>
              </div>
              <div className="mt-3 text-[11px] text-zinc-400">Web Bluetooth • HTTPS • Chrome/Edge Android/Desktop • iOS: suporte limitado, prefere Android para treino real com fato.</div>
            </div>

            <button onClick={()=>{ if(paused){ showToast('Em pausa — retoma'); return } setStep(0); setWizard(true)}} className="w-full bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3A] text-white rounded-2xl p-5 text-left flex items-center justify-between hover:shadow-md">
              <div>
                <div className="text-sm md:text-base font-bold">Calibração de Intensidade</div>
                <div className="text-xs md:text-sm opacity-90 mt-0.5">Calibre cada grupo — {bleConnected ? 'envia via BLE real' : isDemoOnly ? 'Demo (não envia BLE)' : 'liga primeiro'}</div>
              </div>
              <span className="text-2xl">›</span>
            </button>

            <div className="bg-white rounded-2xl border border-zinc-200 p-4 md:p-5">
              <div className="text-sm font-bold text-zinc-900">Ajustes — {bleConnected ? 'BLE real' : isDemoOnly ? 'Demo' : 'desligado'}</div>
              <div className="text-xs text-zinc-500 mt-1">± guarda local + tenta enviar via GATT se BLE ligado. Começa em 1, sobe devagar.</div>
              <div className="mt-4 space-y-1">
                {muscles.map(m=>{
                  const v = calibracoes[m] ?? 1
                  return (
                    <div key={m} className="flex items-center gap-2 py-2.5 border-b border-zinc-100 last:border-0">
                      <span className="w-28 md:w-36 text-sm text-zinc-700">{m}</span>
                      <button onClick={()=>handleIntensityWrite(m, v-1)} className="w-8 h-8 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50"><Minus size={14}/></button>
                      <span className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white grid place-items-center text-sm font-bold">{v}</span>
                      <button onClick={()=>handleIntensityWrite(m, v+1)} className="w-8 h-8 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50"><Plus size={14}/></button>
                      <button onClick={async()=>{
                        if(paused){ showToast('Em pausa — retoma'); return }
                        const idx=muscles.indexOf(m); setStep(idx); setIntCur(v); setWizard(true)
                      }} className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full">Calibrar</button>
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
            <p className="text-xs text-zinc-500 text-center mt-1.5">Sinta o estímulo. {bleConnected ? 'Envio BLE real quando confirmado.' : isDemoOnly ? 'Modo Demo — sem BLE.' : 'Sem ligação — guarda local.'}</p>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800">⚠ 5 min aquecimento ou gel condutor.</div>
            <div className="mt-5 border-2 border-[#FF7A1A] rounded-xl p-3 text-center font-bold text-sm md:text-base text-zinc-900">{cur} • {intCur}% {bleConnected && '• BLE'}</div>
            <div className="mt-4 bg-zinc-50 rounded-2xl p-5 text-center">
              <div className="text-sm font-bold text-zinc-700">Ajustar Intensidade</div>
              <div className="flex items-center justify-center gap-5 mt-4">
                <button onClick={()=>setIntCur(v=>Math.max(0,v-1))} className="w-10 h-10 rounded-full bg-white border border-zinc-200 grid place-items-center hover:bg-zinc-50"><Minus size={18}/></button>
                <div className="w-14 h-14 rounded-full bg-[#FF7A1A] text-white grid place-items-center text-xl font-bold">{intCur}</div>
                <button onClick={()=>setIntCur(v=>Math.min(100,v+1))} className="w-10 h-10 rounded-full bg-white border border-zinc-200 grid place-items-center hover:bg-zinc-50"><Plus size={18}/></button>
              </div>
              <div className="text-xs text-zinc-500 mt-3">Progresso: {step+1}/7 • {muscles[step]}</div>
              <button onClick={testIntensity} className="mt-3 text-xs font-bold text-emerald-600 hover:underline">Testar agora — aplicar {intCur}% em {cur} {bleConnected?'via BLE real':''}</button>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setWizard(false)} className="flex-1 border border-zinc-200 rounded-full py-3 text-sm font-semibold hover:bg-zinc-50">Fechar</button>
              <button onClick={async()=>{ await handleIntensityWrite(cur, intCur); if(step<muscles.length-1){ setStep(s=>s+1); setIntCur(calibracoes[muscles[step+1]]??1)} else { showToast('Calibração concluída'+(bleConnected?' • BLE':'')); setWizard(false)}}} className="flex-1 bg-[#FF7A1A] hover:bg-orange-600 text-white rounded-full py-3 text-sm font-bold">→ Seguinte</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-[80px] md:bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg z-50 text-center max-w-[90%]">{toast}</div>}
      {error && <div className="fixed bottom-[80px] md:bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm px-4 py-2.5 rounded-full shadow-lg z-50 text-center max-w-[90%]">{error}</div>}
    </div>
  )
}
