import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { writeIntensity } from '../lib/ems-bluetooth'

type State = {
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

export function AppStateProvider({children}:{children:ReactNode}){
  const [points,setPoints]=useState(()=>{ const s=localStorage.getItem('tbu:points'); return s? parseInt(s): 275 })
  const [completed,setCompleted]=useState<string[]>(()=>{ const s=localStorage.getItem('tbu:completed'); return s? JSON.parse(s): ['techpower1'] })
  const [calibracoes,setCalibracoes]=useState<Record<string,number>>(()=>{ const s=localStorage.getItem('tbu:calib'); return s? JSON.parse(s): {} })
  const [suitVals,setSuitVals]=useState<Record<string,number>>(()=>{ const s=localStorage.getItem('tbu:suit'); return s? JSON.parse(s): {} })
  const [bleDevice,setBleDevice]=useState<any>(null)
  const [bleServer,setBleServer]=useState<any>(null)
  const [bleName,setBleName]=useState('')
  const [bleBattery,setBleBattery]=useState<number|undefined>(undefined)
  const [bleConnected,setBleConnected]=useState(false)
  const [demoMode,setDemoMode]=useState(()=> localStorage.getItem('tbu:ems:demo')==='1')
  useEffect(()=>{ localStorage.setItem('tbu:points', String(points)) },[points])
  useEffect(()=>{ localStorage.setItem('tbu:completed', JSON.stringify(completed)) },[completed])
  useEffect(()=>{ localStorage.setItem('tbu:calib', JSON.stringify(calibracoes)) },[calibracoes])
  useEffect(()=>{ localStorage.setItem('tbu:suit', JSON.stringify(suitVals)) },[suitVals])
  useEffect(()=>{ localStorage.setItem('tbu:ems:demo', demoMode ? '1':'0') },[demoMode])
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
  return <Ctx.Provider value={{points,completed,calibracoes,suitVals,addPoints,toggleComplete,setCalib,setSuit,bleDevice,bleServer,bleName,bleBattery,bleConnected,setBleConnection,clearBle,demoMode,setDemoMode}}>{children}</Ctx.Provider>
}
export const useAppState=()=> useContext(Ctx)
