import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type State = {
  points: number
  completed: string[]
  calibracoes: Record<string, number>
  suitVals: Record<string, number>
  addPoints: (n:number)=>void
  toggleComplete: (id:string, pts:number)=>void
  setCalib: (k:string, v:number)=>void
  setSuit: (k:string, v:number)=>void
}
const Ctx = createContext<State>(null as any)

export function AppStateProvider({children}:{children:ReactNode}){
  const [points,setPoints]=useState(()=>{ const s=localStorage.getItem('tbu:points'); return s? parseInt(s): 275 })
  const [completed,setCompleted]=useState<string[]>(()=>{ const s=localStorage.getItem('tbu:completed'); return s? JSON.parse(s): ['techpower1'] })
  const [calibracoes,setCalibracoes]=useState<Record<string,number>>(()=>{ const s=localStorage.getItem('tbu:calib'); return s? JSON.parse(s): {} })
  const [suitVals,setSuitVals]=useState<Record<string,number>>(()=>{ const s=localStorage.getItem('tbu:suit'); return s? JSON.parse(s): {} })
  useEffect(()=>{ localStorage.setItem('tbu:points', String(points)) },[points])
  useEffect(()=>{ localStorage.setItem('tbu:completed', JSON.stringify(completed)) },[completed])
  useEffect(()=>{ localStorage.setItem('tbu:calib', JSON.stringify(calibracoes)) },[calibracoes])
  useEffect(()=>{ localStorage.setItem('tbu:suit', JSON.stringify(suitVals)) },[suitVals])
  const addPoints=(n:number)=> setPoints(p=>p+n)
  const toggleComplete=(id:string, pts:number)=>{ if(completed.includes(id)) return; setCompleted(c=>[...c,id]); addPoints(pts) }
  const setCalib=(k:string,v:number)=> setCalibracoes(s=>({...s,[k]:Math.max(0,Math.min(100,v))}))
  const setSuit=(k:string,v:number)=> setSuitVals(s=>({...s,[k]:Math.max(0,Math.min(100,v))}))
  return <Ctx.Provider value={{points,completed,calibracoes,suitVals,addPoints,toggleComplete,setCalib,setSuit}}>{children}</Ctx.Provider>
}
export const useAppState=()=> useContext(Ctx)
