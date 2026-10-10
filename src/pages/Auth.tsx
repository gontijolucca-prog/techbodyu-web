import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../context/AppState'

export default function Auth(){
  const { setUser } = useAppState()
  const nav = useNavigate()
  const [mode,setMode]=useState<'login'|'signup'>('signup')
  const [nome,setNome]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState<string|null>(null)


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

  const demoLogin=()=>{
    const u={ nome:'Luiz Santana', email:'demo@techbody.pt', avatar:'/assets/images/fitness-profile.jpg' }
    setUser(u)
    nav('/')
  }

  return (
    <div className="min-h-full bg-[#FAFAF8] flex flex-col">
      <div className="bg-white border-b border-zinc-200 px-4 md:px-6 py-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FF7A1A] grid place-items-center text-white font-black text-sm">T</div>
          <span className="text-sm font-black tracking-tight text-zinc-900">TECHBODY U</span>
          <span className="text-xs text-zinc-400 ml-1">Web</span>
        </div>
      </div>
      <div className="flex-1 flex items-start justify-center px-4 md:px-6 py-6 md:py-10">
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
            <button onClick={demoLogin} className="w-full rounded-xl py-3 text-sm font-semibold border border-zinc-200 hover:bg-zinc-50 transition-colors">Continuar como demo (Luiz)</button>
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
