import * as WebBLE from './ems-bluetooth'
import { Capacitor } from '@capacitor/core'
import { BleClient, numbersToDataView } from '@capacitor-community/bluetooth-le'

let bleInit = false
async function ensureNativeInit(){
  if(bleInit) return
  try{
    await BleClient.initialize()
    bleInit = true
  }catch{}
}

export function isNative(): boolean {
  try{ return Capacitor.isNativePlatform() }catch{ return false }
}

export function isBluetoothSupported(): boolean {
  if(isNative()) return true
  return WebBLE.isBluetoothSupported()
}

export async function checkBluetoothAvailability(): Promise<boolean> {
  if(isNative()){
    try{ await ensureNativeInit(); return true }catch{ return false }
  }
  return WebBLE.checkBluetoothAvailability()
}

const EMS_SERVICES = [
  'battery_service',
  '0000fff0-0000-1000-8000-00805f9b34fb',
  '0000ff00-0000-1000-8000-00805f9b34fb',
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
]

export async function requestEMSDevice(): Promise<any> {
  if(isNative()){
    await ensureNativeInit()
    const device = await BleClient.requestDevice({
      services: EMS_SERVICES,
      namePrefix: 'EMS',
      optionalServices: EMS_SERVICES
    })
    return { id: device.deviceId, name: device.name || device.deviceId, nativeDevice: device, isNative: true }
  }
  return WebBLE.requestEMSDevice()
}

export async function requestAnyDevice(): Promise<any> {
  if(isNative()){
    await ensureNativeInit()
    const device = await BleClient.requestDevice({
      services: [],
      optionalServices: EMS_SERVICES
    })
    return { id: device.deviceId, name: device.name || device.deviceId, nativeDevice: device, isNative: true }
  }
  return WebBLE.requestAnyDevice()
}

export async function connectDevice(device: any): Promise<any> {
  if(device?.isNative){
    await BleClient.connect(device.id)
    return { id: device.id, isNative: true, device }
  }
  return WebBLE.connectDevice(device)
}

export async function readBattery(server: any): Promise<number|undefined> {
  if(server?.isNative){
    try{
      const svc = 'battery_service'
      const chr = 'battery_level'
      const val = await BleClient.read(server.id, svc, chr)
      return val.getUint8(0)
    }catch{ return undefined }
  }
  return WebBLE.readBattery(server)
}

export async function discoverServices(server: any): Promise<string[]> {
  if(server?.isNative){
    try{
      const services = await BleClient.getServices(server.id)
      return services.map((s:any)=> s.uuid)
    }catch{ return [] }
  }
  return WebBLE.discoverServices(server)
}

export async function writeIntensity(server: any, muscle: string, value: number): Promise<boolean> {
  if(server?.isNative){
    try{
      const services = await BleClient.getServices(server.id)
      for(const svc of services){
        for(const ch of (svc as any).characteristics || []){
          if(ch.properties?.write || ch.properties?.writeWithoutResponse){
            const payload = numbersToDataView([muscle.charCodeAt(0) % 256, Math.max(0, Math.min(100, value))])
            try{ await BleClient.write(server.id, svc.uuid, ch.uuid, payload); return true }catch{}
          }
        }
      }
      return false
    }catch{ return false }
  }
  return WebBLE.writeIntensity(server, muscle, value)
}

export function onDeviceDisconnect(device: any, cb: ()=>void){
  if(device?.isNative){
    (BleClient as any).addListener('disconnect', (d:any)=>{ if(d.deviceId===device.id) cb() })
    return ()=>{}
  }
  return WebBLE.onDeviceDisconnect(device, cb)
}
