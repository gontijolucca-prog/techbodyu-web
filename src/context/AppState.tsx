import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { writeIntensity } from '../lib/ems-bluetooth'

export type User = { nome: string; email: string; avatar: string }

type State = {
  user: User | null
  setUser: (u: User | null) => void
  logout: () => void
  points: number
  completed: string[]
  calibracoes: Record<string, number>
  suitVals: Record<string, number>
  addPoints: (n:number)=>void
  toggleComplete: (id:string, pts:number)=>void
  setCalib: (k:string, v:number)=>void
  setSuit: (k:string, v:number)=>void
  bleDevice: any
  bleServer: any
  bleName: string
  bleBattery: number | undefined
  bleConnected: boolean
  setBleConnection: (device:any, server:any, name:string, battery?:number)=>void
  clearBle: ()=>void
  demoMode: boolean
  setDemoMode: (v:boolean)=>void
}
const Ctx = createContext<State>(null as any)

function loadUser(): User | null {
  try { const s = localStorage.getItem('tbu:user'); return s ? JSON.parse(s) : null } catch { return null }
}

export function AppStateProvider({children}:{children:ReactNode}){
  const [user, setUserRaw] = useState<User | null>(()=> loadUser())
  const setUser = (u: User | null) => {
    setUserRaw(u)
    if (u) localStorage.setItem('tbu:user', JSON.stringify(u))
    else localStorage.removeItem('tbu:user')
  }
  const logout = () => {
    setUserRaw(null)
    localStorage.removeItem('tbu:user')
  }
  const pointsKey = user ? `tbu:points:${user.email}` : 'tbu:points'
  const completedKey = user ? `tbu:completed:${user.email}` : 'tbu:completed'
  const calibKey = user ? `tbu:calib:${user.email}` : 'tbu:calib'
  const suitKey = user ? `tbu:suit:${user.email}` : 'tbu:suit'

  const [points,setPoints]=useState(()=>{
    const s = localStorage.getItem(pointsKey) || localStorage.getItem('tbu:points')
    return s? parseInt(s): 275
  })
  const [completed,setCompleted]=useState<string[]>(()=>{
    const s = localStorage.getItem(completedKey) || localStorage.getItem('tbu:completed')
    return s? JSON.parse(s): []
  })
  const [calibracoes,setCalibracoes]=useState<Record<string,number>>(()=>{
    const s=localStorage.getItem(calibKey) || localStorage.getItem('tbu:calib')
    return s? JSON.parse(s): {}
  })
  const [suitVals,setSuitVals]=useState<Record<string,number>>(()=>{
    const s=localStorage.getItem(suitKey) || localStorage.getItem('tbu:suit')
    return s? JSON.parse(s): {}
  })
  const [bleDevice,setBleDevice]=useState<any>(null)
  const [bleServer,setBleServer]=useState<any>(null)
  const [bleName,setBleName]=useState('')
  const [bleBattery,setBleBattery]=useState<number|undefined>(undefined)
  const [bleConnected,setBleConnected]=useState(false)
  const [demoMode,setDemoMode]=useState(()=> localStorage.getItem('tbu:ems:demo')==='1')

  useEffect(()=>{ localStorage.setItem(pointsKey, String(points)); if(!user) localStorage.setItem('tbu:points', String(points)) },[points, pointsKey, user])
  useEffect(()=>{ localStorage.setItem(completedKey, JSON.stringify(completed)); if(!user) localStorage.setItem('tbu:completed', JSON.stringify(completed)) },[completed, completedKey, user])
  useEffect(()=>{ localStorage.setItem(calibKey, JSON.stringify(calibracoes)); if(!user) localStorage.setItem('tbu:calib', JSON.stringify(calibracoes)) },[calibracoes, calibKey, user])
  useEffect(()=>{ localStorage.setItem(suitKey, JSON.stringify(suitVals)); if(!user) localStorage.setItem('tbu:suit', JSON.stringify(suitVals)) },[suitVals, suitKey, user])
  useEffect(()=>{ localStorage.setItem('tbu:ems:demo', demoMode ? '1':'0') },[demoMode])

  useEffect(()=>{
    if (user) {
      const sP = localStorage.getItem(`tbu:points:${user.email}`)
      const sC = localStorage.getItem(`tbu:completed:${user.email}`)
      const sCal = localStorage.getItem(`tbu:calib:${user.email}`)
      const sSuit = localStorage.getItem(`tbu:suit:${user.email}`)
      if (sP) setPoints(parseInt(sP))
      else setPoints(275)
      if (sC) setCompleted(JSON.parse(sC))
      else setCompleted([])
      if (sCal) setCalibracoes(JSON.parse(sCal))
      else setCalibracoes({})
      if (sSuit) setSuitVals(JSON.parse(sSuit))
      else setSuitVals({})
    }
  }, [user?.email])

  const addPoints=(n:number)=> setPoints(p=>p+n)
  const toggleComplete=(id:string, pts:number)=>{ if(completed.includes(id)) return; setCompleted(c=>[...c,id]); addPoints(pts) }
  const setCalib=(k:string,v:number)=> {
    const nv=Math.max(0,Math.min(100,v))
    setCalibracoes(s=>({...s,[k]:nv}))
    if(bleConnected && bleServer){ writeIntensity(bleServer, k, nv).catch(()=>{}) }
  }
  const setSuit=(k:string,v:number)=> {
    const nv=Math.max(0,Math.min(100,v))
    setSuitVals(s=>({...s,[k]:nv}))
    if(bleConnected && bleServer){ writeIntensity(bleServer, k, nv).catch(()=>{}) }
  }
  const setBleConnection=(device:any, server:any, name:string, battery?:number)=>{
    setBleDevice(device); setBleServer(server); setBleName(name); setBleBattery(battery); setBleConnected(true); setDemoMode(false)
    if(device){ device.addEventListener('gattserverdisconnected', ()=>{ setBleConnected(false); setBleServer(null); setBleDevice(null) }) }
  }
  const clearBle=()=>{
    try{ bleDevice?.gatt?.disconnect() }catch{}
    setBleConnected(false); setBleDevice(null); setBleServer(null); setBleName(''); setBleBattery(undefined)
  }
  return <Ctx.Provider value={{user,setUser,logout,points,completed,calibracoes,suitVals,addPoints,toggleComplete,setCalib,setSuit,bleDevice,bleServer,bleName,bleBattery,bleConnected,setBleConnection,clearBle,demoMode,setDemoMode}}>{children}</Ctx.Provider>
}
export const useAppState=()=> useContext(Ctx)
