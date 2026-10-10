import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../context/AppState'
import { Download, Apple, Smartphone, Bluetooth, RefreshCw } from 'lucide-react'

export default function Auth(){
  const { setUser } = useAppState()
  const nav = useNavigate()
  const [mode,setMode]=useState<'login'|'signup'>('signup')
  const [nome,setNome]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState<string|null>(null)
  const [deferred,setDeferred]=useState<any>(null)
  const [,setIsIOS]=useState(false)
  const [showAndroidTip,setShowAndroidTip]=useState(false)
  const [showIOSInfo,setShowIOSInfo]=useState(false)

  useEffect(()=>{
    try{
      const u = JSON.parse(localStorage.getItem('tbu:user')||'null')
      if(u && u.email==='demo@techbody.pt'){
        localStorage.removeItem('tbu:user')
        const users = JSON.parse(localStorage.getItem('tbu:users')||'{}')
        if(users['demo@techbody.pt']) { delete users['demo@techbody.pt']; localStorage.setItem('tbu:users', JSON.stringify(users)) }
        setError('Conta demo desativada — cria a tua conta')
        setTimeout(()=>setError(null),3000)
      }
    }catch{}
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && (navigator as any).maxTouchPoints>1))
    const h = (e:any)=>{ e.preventDefault(); setDeferred(e) }
    window.addEventListener('beforeinstallprompt', h)
    return ()=> window.removeEventListener('beforeinstallprompt', h)
  },[])

  const validate=()=>{
    if(!email.trim() || !email.includes('@')) return 'Email inválido'
    if(password.length < 4) return 'Password mínima 4 caracteres'
    if(mode==='signup' && nome.trim().length < 2) return 'Nome obrigatório'
    return null
  }

  const handle=()=>{
    const e=validate()
    if(e){ setError(e); setTimeout(()=>setError(null),2500); return }
    const stored = (()=>{ try{ return JSON.parse(localStorage.getItem('tbu:users')||'{}') }catch{return{}} })()
    const key=email.trim().toLowerCase()
    if(key==='demo@techbody.pt'){ setError('Conta demo desativada — cria nova conta'); setTimeout(()=>setError(null),2500); return }
    if(mode==='signup'){
      stored[key]={ nome: nome.trim() || email.split('@')[0], email:key, password, avatar:'/assets/images/fitness-profile.jpg' }
      localStorage.setItem('tbu:users', JSON.stringify(stored))
      const u={ nome: stored[key].nome, email:key, avatar: stored[key].avatar }
      setUser(u)
      nav('/')
    } else {
      const acc=stored[key]
      if(!acc){ setError('Conta não encontrada. Cria conta.'); setTimeout(()=>setError(null),2500); return }
      if(acc.password!==password){ setError('Password incorreta'); setTimeout(()=>setError(null),2500); return }
      const u={ nome: acc.nome, email:key, avatar: acc.avatar }
      setUser(u)
      nav('/')
    }
  }

  const handleAndroidInstall = async ()=>{
    if(deferred){
      deferred.prompt()
      const c = await deferred.userChoice
      if(c.outcome==='accepted') setDeferred(null)
    } else {
      setShowAndroidTip(v=>!v)
    }
  }

  return (
    <div className="min-h-full bg-[#FAFAF8] flex flex-col">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <img src="/assets/images/applogo.png" alt="TechBody U" className="w-8 h-8 rounded-xl object-cover shadow-sm" />
          <span className="text-sm font-black tracking-tight text-zinc-900">TECHBODY U</span>
          <span className="text-xs text-zinc-400 ml-1">Web</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 md:px-6 py-6 md:py-8 gap-6">
        <div className="w-full max-w-[640px] bg-white rounded-[20px] border border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-5 md:p-6">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2"><Download size={18} className="text-[#FF7A1A]"/> Instalar TechBody U — funciona como app</h2>
          <p className="text-xs text-zinc-500 mt-1">Instala em 1 toque. Depois funciona offline e updates vêm sozinhos.</p>
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50">
              <div className="text-sm font-bold text-zinc-900 flex items-center gap-1.5"><Apple size={14}/> iPhone — funciona já</div>
              <p className="text-xs text-zinc-600 mt-1">PWA 100% funcional agora — 1 toque, sem App Store.</p>
              <div className="mt-3 space-y-2">
                <button onClick={()=>setShowIOSInfo(v=>!v)} className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white rounded-xl py-2.5 text-sm font-bold transition-colors"><Apple size={14}/> Instalar no iPhone — 1 toque</button>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 justify-center"><Bluetooth size={12}/> Treino 100% aqui • BLE via Bluefy/TestFlight opcional</div>
                <button onClick={()=>setShowIOSInfo(v=>!v)} className="w-full text-xs font-semibold text-[#FF7A1A] hover:underline">Ver instruções iPhone →</button>
              </div>
              {showIOSInfo && <div className="mt-3 bg-white border border-zinc-200 rounded-xl p-3 text-xs leading-relaxed text-zinc-700 space-y-2">
                <div className="font-bold flex items-center gap-1"><Apple size={12}/> PWA já funcional (recomendado):</div>
                <div>1. No Safari toca em <span className="font-semibold">Partilhar ↑</span> → <span className="font-semibold">Adicionar ao Ecrã Principal</span> → <span className="font-semibold">Adicionar</span><br/>2. Abre pelo ícone TechBody U — fica como app nativa, offline e com updates automáticos.</div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg px-2.5 py-2 text-[11px]">
                  <span className="font-bold flex items-center gap-1"><Bluetooth size={10}/> Bluetooth EMS no iPhone:</span> Safari bloqueia BLE. Para 100% com fato usa <a href="https://apps.apple.com/app/bluefy/id1492822055" target="_blank" rel="noopener" className="underline font-semibold text-[#007AFF]">Bluefy browser</a> (grátis) e abre o mesmo link, ou aguarda TestFlight nativo.
                </div>
                <div className="bg-zinc-50 rounded-lg px-2.5 py-2 text-[11px] text-zinc-600">
                  <span className="font-bold">TestFlight / .ipa UE:</span> em preparação — precisa Apple Developer ($99/ano, sem review App Store). Já configurado via Capacitor + Capgo OTA. Assim que o Team ID estiver ativo, os botões ficam com links reais e updates sem loja: <code className="bg-white px-1 rounded border">npx @capgo/cli bundle upload</code>.
                </div>
                <div className="flex gap-2">
                  <a href="https://apps.apple.com/app/bluefy/id1492822055" target="_blank" rel="noopener" className="flex-1 text-center bg-[#007AFF] hover:bg-blue-600 text-white rounded-xl py-2 text-xs font-bold">Abrir Bluefy</a>
                  <span className="flex-1 text-center bg-zinc-100 text-zinc-500 rounded-xl py-2 text-xs font-semibold border border-zinc-200">TestFlight em breve</span>
                </div>
                <div className="text-[11px] text-zinc-500">Updates: <span className="font-semibold">Cloudflare Pages</span> para web/PWA + <span className="font-semibold">Capgo OTA</span> para nativo — sem App Store.</div>
                <a href="/#/download" className="inline-block text-xs font-bold text-[#FF7A1A] hover:underline">→ Ver página /download completa</a>
              </div>}
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4 bg-white">
              <div className="text-sm font-bold text-zinc-900 flex items-center gap-1.5"><Smartphone size={14}/> Android / Desktop</div>
              <p className="text-xs text-zinc-600 mt-1">PWA 100% com BLE direto.</p>
              <div className="mt-3 space-y-2">
                <button onClick={handleAndroidInstall} className="w-full flex items-center justify-center gap-2 bg-[#FF7A1A] hover:bg-orange-600 text-white rounded-xl py-2.5 text-sm font-bold transition-colors"><Download size={14}/> Instalar no Android</button>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 justify-center"><Bluetooth size={12}/> Bluetooth EMS já funciona aqui</div>
                <button onClick={()=>setShowAndroidTip(v=>!v)} className="w-full text-xs font-semibold text-zinc-600 hover:underline">Não apareceu popup?</button>
              </div>
              {showAndroidTip && <div className="mt-3 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs leading-relaxed text-zinc-700">Chrome → menu ⋮ → <span className="font-semibold">Instalar app</span> ou <span className="font-semibold">Adicionar ao ecrã principal</span>. Depois abre pelo ícone.</div>}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500"><RefreshCw size={12}/> Updates automáticos via Cloudflare + Capgo — sem App Store.</div>
        </div>

        <div className="w-full max-w-[420px] bg-white rounded-[20px] border border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-5 md:p-6">
          <h1 className="text-[18px] font-bold text-zinc-900">{mode==='signup' ? 'Criar conta' : 'Entrar'}</h1>
          <p className="text-xs text-zinc-500 mt-1">{mode==='signup' ? 'Conta real — fica guardada neste browser (tbu:user). Depois entras com o mesmo email/pass.' : 'Entra com o email e password que criaste.'}</p>
          <div className="mt-4 flex bg-zinc-100 rounded-full p-1">
            <button onClick={()=>setMode('signup')} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${mode==='signup'?'bg-[#FF7A1A] text-white shadow':'text-zinc-600 hover:text-zinc-900'}`}>Criar conta</button>
            <button onClick={()=>setMode('login')} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${mode==='login'?'bg-zinc-900 text-white shadow':'text-zinc-600 hover:text-zinc-900'}`}>Entrar</button>
          </div>
          <div className="mt-5 space-y-3">
            {mode==='signup' && (
              <div>
                <label className="text-xs font-semibold text-zinc-700">Nome</label>
                <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex: Joana Silva" className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF7A1A] focus:ring-2 focus:ring-orange-100" />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-zinc-700">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.pt" type="email" className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF7A1A] focus:ring-2 focus:ring-orange-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="mín. 4 caracteres" type="password" className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF7A1A] focus:ring-2 focus:ring-orange-100" />
            </div>
            <button onClick={handle} className={`w-full rounded-xl py-3 text-sm font-bold text-white transition-colors mt-2 ${mode==='signup'?'bg-[#FF7A1A] hover:bg-orange-600':'bg-zinc-900 hover:bg-black'}`}>{mode==='signup' ? 'Criar conta e entrar' : 'Entrar'}</button>
            <p className="text-[11px] text-zinc-400 text-center">Ao criares conta aceitas os Termos • dados ficam só neste dispositivo (localStorage). Depois podes terminar sessão no Perfil.</p>
          </div>
          <div className="mt-4 text-center text-xs text-zinc-500">
            {mode==='signup' ? <span>Já tens conta? <button onClick={()=>setMode('login')} className="text-[#FF7A1A] font-semibold hover:underline">Entrar</button></span> : <span>Sem conta? <button onClick={()=>setMode('signup')} className="text-[#FF7A1A] font-semibold hover:underline">Criar conta</button></span>}
          </div>
        </div>
      </div>
      {error && <div className="fixed bottom-[90px] md:bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm px-4 py-2.5 rounded-full shadow-lg z-50">{error}</div>}
    </div>
  )
}
