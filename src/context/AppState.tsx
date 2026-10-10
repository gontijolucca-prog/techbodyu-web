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

const safeGet=(k:string, fb:any)=>{ try{ const s=localStorage.getItem(k); return s? JSON.parse(s): fb }catch{ return fb } }
const safeGetStr=(k:string, fb:string)=>{ try{ return localStorage.getItem(k) ?? fb }catch{ return fb } }
export function AppStateProvider({children}:{children:ReactNode}){
  const [points,setPoints]=useState(()=>{ const s=safeGetStr('tbu:points',''); return s? parseInt(s): 275 })
  const [completed,setCompleted]=useState<string[]>(()=> safeGet('tbu:completed',['techpower1']))
  const [calibracoes,setCalibracoes]=useState<Record<string,number>>(()=> safeGet('tbu:calib',{}))
  const [suitVals,setSuitVals]=useState<Record<string,number>>(()=> safeGet('tbu:suit',{}))
  useEffect(()=>{ try{ localStorage.setItem('tbu:points', String(points)) }catch{} },[points])
  useEffect(()=>{ try{ localStorage.setItem('tbu:completed', JSON.stringify(completed)) }catch{} },[completed])
  useEffect(()=>{ try{ localStorage.setItem('tbu:calib', JSON.stringify(calibracoes)) }catch{} },[calibracoes])
  useEffect(()=>{ try{ localStorage.setItem('tbu:suit', JSON.stringify(suitVals)) }catch{} },[suitVals])
  const addPoints=(n:number)=> setPoints(p=>p+n)
  const toggleComplete=(id:string, pts:number)=>{ if(completed.includes(id)) return; setCompleted(c=>[...c,id]); addPoints(pts) }
  const setCalib=(k:string,v:number)=> setCalibracoes(s=>({...s,[k]:Math.max(0,Math.min(100,v))}))
  const setSuit=(k:string,v:number)=> setSuitVals(s=>({...s,[k]:Math.max(0,Math.min(100,v))}))
  return <Ctx.Provider value={{points,completed,calibracoes,suitVals,addPoints,toggleComplete,setCalib,setSuit}}>{children}</Ctx.Provider>
}
export const useAppState=()=> useContext(Ctx)
