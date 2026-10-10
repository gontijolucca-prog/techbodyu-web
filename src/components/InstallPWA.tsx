import { useEffect, useState } from 'react'
import { Download, Apple, Smartphone } from 'lucide-react'

export default function InstallPWA(){
  const [deferred, setDeferred] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showTip, setShowTip] = useState(false)

  useEffect(()=>{
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1))
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true)
    const handler = (e:any)=>{ e.preventDefault(); setDeferred(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return ()=> window.removeEventListener('beforeinstallprompt', handler)
  },[])

  if(isStandalone) return null

  const handleInstall = async ()=>{
    if(deferred){
      deferred.prompt()
      const choice = await deferred.userChoice
      if(choice.outcome === 'accepted') setDeferred(null)
    } else if(isIOS){
      setShowTip(v=>!v)
    } else {
      setShowTip(v=>!v)
    }
  }

  return (
    <div className="w-full">
      <button onClick={handleInstall} className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white rounded-xl py-3 text-sm font-bold transition-colors">
        <Download size={16}/> Instalar App {isIOS ? 'no iPhone' : ''} — 1 toque
      </button>
      {showTip && (
        <div className="mt-3 bg-white border border-zinc-200 rounded-2xl p-3 text-xs leading-relaxed text-zinc-700 shadow-sm">
          {isIOS ? (
            <>
              <div className="font-bold flex items-center gap-1.5"><Apple size={14}/> iPhone (sem App Store):</div>
              <div className="mt-1">1. Toca em <span className="font-semibold">Partilhar</span> (quadrado com seta ↑) no Safari<br/>2. Escolhe <span className="font-semibold">Adicionar ao Ecrã Principal</span> → <span className="font-semibold">Adicionar</span><br/>3. Fica com ícone TechBody U como app nativa. Updates vêm sozinhos.</div>
              <div className="mt-2 text-[11px] text-zinc-500">Para EMS Bluetooth 100% no iPhone usa a versão nativa via TestFlight (mesmo design) ou browser Bluefy — Safari não permite BLE.</div>
              <a href="/#/download" className="inline-block mt-2 text-xs font-bold text-[#FF7A1A] hover:underline">→ Ver download para iPhone com Bluetooth</a>
            </>
          ) : (
            <>
              <div className="font-bold flex items-center gap-1.5"><Smartphone size={14}/> Android / Desktop:</div>
              <div className="mt-1">Se não apareceu o popup, usa o menu do Chrome → <span className="font-semibold">Instalar app</span> ou <span className="font-semibold">Adicionar ao ecrã principal</span>.</div>
              <div className="mt-1 text-[11px] text-zinc-500">Bluetooth do fato já funciona 100% aqui.</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
