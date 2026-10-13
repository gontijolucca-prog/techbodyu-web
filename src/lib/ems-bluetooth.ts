/* Web Bluetooth EMS - protocolo real 0x53 - fix para fato TechBody */
export type EMSDevice = { id: string; name: string; device: any; server?: any; battery?: number }

export function isBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && !!(navigator as any).bluetooth
}
export async function checkBluetoothAvailability(): Promise<boolean> {
  if (!isBluetoothSupported()) return false
  try { const avail = await (navigator as any).bluetooth.getAvailability(); return !!avail } catch { return true }
}
const EMS_OPTIONAL_SERVICES = [
  'battery_service','device_information','0000fff0-0000-1000-8000-00805f9b34fb','0000ff00-0000-1000-8000-00805f9b34fb','6e400001-b5a3-f393-e0a9-e50e24dcca9e','0000180a-0000-1000-8000-00805f9b34fb','0000180f-0000-1000-8000-00805f9b34fb',
]
export async function requestEMSDevice(): Promise<any> {
  if (!isBluetoothSupported()) throw new Error('Bluetooth não suportado neste browser. Usa Chrome/Edge em Android ou Desktop.')
  const filters = [{ namePrefix: 'EMS' },{ namePrefix: 'TechBody' },{ namePrefix: 'WH-' },{ namePrefix: 'WHS' },{ namePrefix: 'SBody' },{ namePrefix: 'nord' },{ namePrefix: 'NORD' }]
  try { return await (navigator as any).bluetooth.requestDevice({ filters, optionalServices: EMS_OPTIONAL_SERVICES }) } catch (e:any){ if(e?.name==='NotFoundError') throw new Error('Nenhum dispositivo selecionado.'); throw e }
}
export async function requestAnyDevice(): Promise<any> {
  if (!isBluetoothSupported()) throw new Error('Bluetooth não suportado.')
  return await (navigator as any).bluetooth.requestDevice({ acceptAllDevices:true, optionalServices: EMS_OPTIONAL_SERVICES })
}
export async function connectDevice(device:any):Promise<any>{
  if(!device.gatt) throw new Error('Device sem GATT.')
  if(device.gatt.connected) return device.gatt
  return await device.gatt.connect()
}
export async function readBattery(server:any): Promise<number|undefined>{
  try{ const svc=await server.getPrimaryService('battery_service'); const chr=await svc.getCharacteristic('battery_level'); const v=await chr.readValue(); return v.getUint8(0)}catch{ return undefined }
}
export async function discoverServices(server:any): Promise<string[]>{
  try{ const services=await server.getPrimaryServices(); return services.map((s:any)=>s.uuid)}catch{ return [] }
}
export function onDeviceDisconnect(device:any, cb:()=>void){
  const handler=()=>cb()
  device.addEventListener('gattserverdisconnected', handler)
  return ()=>device.removeEventListener('gattserverdisconnected', handler)
}

// --- Protocolo real 0x53 ---
class BleDeviceCommend{
  header=0x53; length:number; commend:number; pdu:number[]; checksum=0
  constructor(commend:number, pdu:number[]|Uint8Array){
    this.commend=commend
    this.pdu=Array.from(pdu as any)
    this.length=this.pdu.length+4
  }
  buildPacket():Uint8Array{
    const data=[this.header, this.length, this.commend, ...this.pdu]
    const cs=data.reduce((a,c)=>a+c,0)&0xFF
    return new Uint8Array([...data, cs])
  }
  getCommend(){ return this.commend }
}
const CMD_SETTING=1, CMD_RUN=3, CMD_START=0xF1, CMD_STOP=0xF2
function getPartsArray(parts:any){
  // mapeia 7 músculos PT para 10 do protocolo - usa chest/abdomen etc, resto espelha
  return [
    1,
    parts['Peitoral'] ?? parts.chest ?? 0,
    parts['Abdómen'] ?? parts.abdomen ?? 0,
    parts['Isquiotibiais'] ?? parts.thighFront ?? 0,
    parts['Bíceps'] ?? parts.armBack ?? 0,
    parts['Tríceps'] ?? parts.armFront ?? 0,
    parts['Trapézio'] ?? parts.trapezius ?? 0,
    parts['Glúteos'] ?? parts.latissimus ?? 50, // fallback
    parts['Glúteos'] ?? parts.erectorSpinae ?? 50,
    parts['Glúteos'] ?? parts.pygal ?? 0,
    parts['Isquiotibiais'] ?? parts.thighBack ?? 0,
  ]
}
function getPartsParamsPdu(partsData:any, partsDisabled:any){
  const parts=getPartsArray(partsData)
  const dis=getPartsArray(partsDisabled)
  const pdu=new Uint8Array(11)
  for(let i=0;i<11;i++){
    const enabled = dis[i] ? 1 : 0
    // se disabled (true) então usa valor, senão 0 - inverso do zip que usa enabled flag
    // zip: if(partsDisabled[index]) return value else 0 ; onde partsDisabled é true=usado
    pdu[i]= enabled ? Math.floor((parts[i]/100)*100) : 0
  }
  return pdu
}
function getWorkParamsPdu(programData:any, workLengthSec:number, workStatus:boolean){
  const b=new Uint8Array(11)
  b[0]=1
  let j=Math.floor(workLengthSec)
  if(j>0 && j<=5) j=5
  b[1]=Math.floor(j/256); b[2]=j%256
  b[3]=programData.frequency ?? 90
  b[4]=Math.floor((programData.pulseWidth ?? 350)/50)
  b[5]=programData.pulseDuration ?? 4
  b[6]= j===0 ? 1 : (programData.pulsePause ?? 4)
  b[7]=programData.startDelayTime ?? 2
  b[8]=programData.endDelayTime ?? 2
  b[9]=programData.retryCount ?? 3
  b[10]= workStatus ? 1 : 0
  return b
}
async function findWriteCharacteristic(server:any){
  const services=await server.getPrimaryServices()
  for(const svc of services){
    const chars=await svc.getCharacteristics()
    // procura write
    for(const ch of chars){
      if(ch.properties.write || ch.properties.writeWithoutResponse){
        // tenta achar par notify no mesmo serviço
        const notify = chars.find((c:any)=> c.properties.notify || c.properties.indicate)
        return { service: svc, writeChar: ch, notifyChar: notify }
      }
    }
  }
  throw new Error('Característica BLE de escrita não encontrada. Tenta “Procurar todos”.')
}
async function writePacket(server:any, cmd:number, pdu:Uint8Array){
  const { writeChar } = await findWriteCharacteristic(server)
  const pkt=new BleDeviceCommend(cmd, pdu).buildPacket()
  // tenta writeValue e fallback writeWithoutResponse
  try{ await writeChar.writeValue(pkt as any); return true }catch{}
  try{ await (writeChar as any).writeValueWithoutResponse(pkt as any); return true }catch(e){ throw e }
}
export async function writeIntensity(server:any, muscle:string, value:number): Promise<boolean>{
  // mantém compat: mas agora envia pacote real com header 0x53
  // para teste rápido de 1 músculo: cria parts com só esse músculo a value
  try{
    const v=Math.max(0, Math.min(100, value))
    const parts:any={}; const disabled:any={}
    const all=['Peitoral','Glúteos','Abdómen','Tríceps','Bíceps','Isquiotibiais','Trapézio']
    for(const m of all){ parts[m]= m===muscle ? v : 0; disabled[m]= m===muscle }
    // se for 0, desliga parte
    const pduParts=getPartsParamsPdu(parts, disabled)
    const program={ frequency:90, pulseWidth:350, pulseDuration:4, pulsePause:4, startDelayTime:2, endDelayTime:2, retryCount:3 }
    const pduWork=getWorkParamsPdu(program, 60, true)
    // sequência correta: 0x01 -> 0x03 -> 0xF1 com delays
    await writePacket(server, CMD_SETTING, pduParts)
    await new Promise(r=>setTimeout(r,150))
    await writePacket(server, CMD_RUN, pduWork)
    await new Promise(r=>setTimeout(r,150))
    await writePacket(server, CMD_START, new Uint8Array([0x00]))
    return true
  }catch{ return false }
}
export async function startEMSSession(server:any, parts:any, program:any, durationSec:number){
  const disabled:any={}; for(const k of Object.keys(parts)) disabled[k]= parts[k]>0
  const pduParts=getPartsParamsPdu(parts, disabled)
  const pduWork=getWorkParamsPdu(program, durationSec, true)
  await writePacket(server, CMD_SETTING, pduParts); await new Promise(r=>setTimeout(r,150))
  await writePacket(server, CMD_RUN, pduWork); await new Promise(r=>setTimeout(r,150))
  await writePacket(server, CMD_START, new Uint8Array([0x00]))
}
export async function stopEMSSession(server:any){
  try{ await writePacket(server, CMD_STOP, new Uint8Array([0x00])) }catch{}
  await new Promise(r=>setTimeout(r,1000))
}
export async function pauseEMSSession(server:any, program:any, durationSec:number){
  const pdu=getWorkParamsPdu(program, durationSec, false)
  await writePacket(server, CMD_RUN, pdu)
}
