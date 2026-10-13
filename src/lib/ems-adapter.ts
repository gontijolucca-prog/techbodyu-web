import * as WebBLE from './ems-bluetooth'
import { Capacitor } from '@capacitor/core'
import { BleClient, numbersToDataView } from '@capacitor-community/bluetooth-le'

let bleInit=false
async function ensureNativeInit(){ if(bleInit) return; try{ await BleClient.initialize(); bleInit=true }catch{} }
export function isNative():boolean{ try{ return Capacitor.isNativePlatform()}catch{ return false } }
export function isBluetoothSupported():boolean{ if(isNative()) return true; return WebBLE.isBluetoothSupported() }
export async function checkBluetoothAvailability():Promise<boolean>{ if(isNative()){ try{ await ensureNativeInit(); return true }catch{ return false } } return WebBLE.checkBluetoothAvailability() }
const EMS_SERVICES=['battery_service','0000fff0-0000-1000-8000-00805f9b34fb','0000ff00-0000-1000-8000-00805f9b34fb','6e400001-b5a3-f393-e0a9-e50e24dcca9e']
export async function requestEMSDevice():Promise<any>{
  if(isNative()){ await ensureNativeInit(); const d=await BleClient.requestDevice({ services:EMS_SERVICES, namePrefix:'EMS', optionalServices:EMS_SERVICES }); return { id:d.deviceId, name:d.name||d.deviceId, nativeDevice:d, isNative:true } }
  return WebBLE.requestEMSDevice()
}
export async function requestAnyDevice():Promise<any>{
  if(isNative()){ await ensureNativeInit(); const d=await BleClient.requestDevice({ services:[], optionalServices:EMS_SERVICES }); return { id:d.deviceId, name:d.name||d.deviceId, nativeDevice:d, isNative:true } }
  return WebBLE.requestAnyDevice()
}
export async function connectDevice(device:any):Promise<any>{
  if(device?.isNative){ await BleClient.connect(device.id); return { id:device.id, isNative:true, device } }
  return WebBLE.connectDevice(device)
}
export async function readBattery(server:any):Promise<number|undefined>{
  if(server?.isNative){ try{ const v=await BleClient.read(server.id,'battery_service','battery_level'); return v.getUint8(0)}catch{ return undefined } }
  return WebBLE.readBattery(server)
}
export async function discoverServices(server:any):Promise<string[]>{
  if(server?.isNative){ try{ const s=await BleClient.getServices(server.id); return s.map((x:any)=>x.uuid)}catch{ return [] } }
  return WebBLE.discoverServices(server)
}
class BleDeviceCommendNative{header=0x53;length:number;commend:number;pdu:number[];constructor(commend:number,pdu:number[]|Uint8Array){this.commend=commend;this.pdu=Array.from(pdu as any);this.length=this.pdu.length+4}buildPacket():Uint8Array{const data=[this.header,this.length,this.commend,...this.pdu];const cs=data.reduce((a,c)=>a+c,0)&0xFF;return new Uint8Array([...data,cs])}}
const CMD_SETTING_N=1,CMD_RUN_N=3,CMD_START_N=0xF1,CMD_STOP_N=0xF2
function getPartsArrayNative(parts:any){return[1,parts['Peitoral']??parts.chest??0,parts['Abdómen']??parts.abdomen??0,parts['Isquiotibiais']??parts.thighFront??0,parts['Bíceps']??parts.armBack??0,parts['Tríceps']??parts.armFront??0,parts['Trapézio']??parts.trapezius??0,parts['Glúteos']??parts.latissimus??50,parts['Glúteos']??parts.erectorSpinae??50,parts['Glúteos']??parts.pygal??0,parts['Isquiotibiais']??parts.thighBack??0]}
function getPartsParamsPduNative(partsData:any,partsDisabled:any){const parts=getPartsArrayNative(partsData);const dis=getPartsArrayNative(partsDisabled);const pdu=new Uint8Array(11);for(let i=0;i<11;i++){const enabled=dis[i]?1:0;pdu[i]=enabled?Math.floor((parts[i]/100)*100):0}return pdu}
function getWorkParamsPduNative(programData:any,workLengthSec:number,workStatus:boolean){const b=new Uint8Array(11);b[0]=1;let j=Math.floor(workLengthSec);if(j>0&&j<=5)j=5;b[1]=Math.floor(j/256);b[2]=j%256;b[3]=programData.frequency??90;b[4]=Math.floor((programData.pulseWidth??350)/50);b[5]=programData.pulseDuration??4;b[6]=j===0?1:(programData.pulsePause??4);b[7]=programData.startDelayTime??2;b[8]=programData.endDelayTime??2;b[9]=programData.retryCount??3;b[10]=workStatus?1:0;return b}
async function findNativeWriteChar(deviceId:string):Promise<{serviceUuid:string,charUuid:string}>{const services=await BleClient.getServices(deviceId);for(const svc of services){for(const ch of (svc as any).characteristics||[]){if(ch.properties?.write||ch.properties?.writeWithoutResponse){return{serviceUuid:svc.uuid,charUuid:ch.uuid}}}}throw new Error('Característica BLE nativa não encontrada')}
async function writePacketNative(deviceId:string,cmd:number,pdu:Uint8Array){const {serviceUuid,charUuid}=await findNativeWriteChar(deviceId);const pkt=new BleDeviceCommendNative(cmd,pdu).buildPacket();const dv=numbersToDataView(Array.from(pkt));await BleClient.write(deviceId,serviceUuid,charUuid,dv)}
export async function writeIntensity(server:any, muscle:string, value:number):Promise<boolean>{
  if(server?.isNative){
    try{
      const v=Math.max(0,Math.min(100,value))
      const parts:any={};const disabled:any={}
      const all=['Peitoral','Glúteos','Abdómen','Tríceps','Bíceps','Isquiotibiais','Trapézio']
      for(const m of all){parts[m]=m===muscle?v:0;disabled[m]=m===muscle}
      const pduParts=getPartsParamsPduNative(parts,disabled)
      const program={frequency:90,pulseWidth:350,pulseDuration:4,pulsePause:4,startDelayTime:2,endDelayTime:2,retryCount:3}
      const pduWork=getWorkParamsPduNative(program,60,true)
      await writePacketNative(server.id,CMD_SETTING_N,pduParts)
      await new Promise(r=>setTimeout(r,150))
      await writePacketNative(server.id,CMD_RUN_N,pduWork)
      await new Promise(r=>setTimeout(r,150))
      await writePacketNative(server.id,CMD_START_N,new Uint8Array([0x00]))
      return true
    }catch{ return false }
  }
  return WebBLE.writeIntensity(server, muscle, value)
}
export async function startEMSSession(server:any, parts:any, program:any, durationSec:number){
  if(server?.isNative){
    try{
      const disabled:any={};for(const k of Object.keys(parts)) disabled[k]=parts[k]>0
      const pduParts=getPartsParamsPduNative(parts,disabled)
      const pduWork=getWorkParamsPduNative(program,durationSec,true)
      await writePacketNative(server.id,CMD_SETTING_N,pduParts);await new Promise(r=>setTimeout(r,150))
      await writePacketNative(server.id,CMD_RUN_N,pduWork);await new Promise(r=>setTimeout(r,150))
      await writePacketNative(server.id,CMD_START_N,new Uint8Array([0x00]))
      return true
    }catch{ return false }
  }
  const mod=await import('./ems-bluetooth'); return (mod as any).startEMSSession(server, parts, program, durationSec)
}
export async function stopEMSSession(server:any){
  if(server?.isNative){ try{ await writePacketNative(server.id,CMD_STOP_N,new Uint8Array([0x00])); await new Promise(r=>setTimeout(r,1000)) }catch{} return }
  const mod=await import('./ems-bluetooth'); return (mod as any).stopEMSSession(server)
}
export async function pauseEMSSession(server:any, program:any, durationSec:number){
  if(server?.isNative){ try{ const pdu=getWorkParamsPduNative(program,durationSec,false); await writePacketNative(server.id,CMD_RUN_N,pdu)}catch{} return }
  const mod=await import('./ems-bluetooth'); return (mod as any).pauseEMSSession(server, program, durationSec)
}
export function onDeviceDisconnect(device:any, cb:()=>void){
  if(device?.isNative){ (BleClient as any).addListener('disconnect', (d:any)=>{ if(d.deviceId===device.id) cb() }); return ()=>{} }
  return WebBLE.onDeviceDisconnect(device, cb)
}
