/* Web Bluetooth EMS - real connection, no fake */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EMSDevice = {
  id: string
  name: string
  device: any
  server?: any
  battery?: number
}

export function isBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && !!(navigator as any).bluetooth
}

export async function checkBluetoothAvailability(): Promise<boolean> {
  if (!isBluetoothSupported()) return false
  try {
    const avail = await (navigator as any).bluetooth.getAvailability()
    return !!avail
  } catch { return true }
}

const EMS_OPTIONAL_SERVICES = [
  'battery_service',
  'device_information',
  '0000fff0-0000-1000-8000-00805f9b34fb',
  '0000ff00-0000-1000-8000-00805f9b34fb',
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  '0000180a-0000-1000-8000-00805f9b34fb',
  '0000180f-0000-1000-8000-00805f9b34fb',
]

export async function requestEMSDevice(): Promise<any> {
  if (!isBluetoothSupported()) throw new Error('Bluetooth não suportado neste browser. Usa Chrome/Edge em Android ou Desktop.')
  const filters = [
    { namePrefix: 'EMS' },
    { namePrefix: 'TechBody' },
    { namePrefix: 'WH-' },
    { namePrefix: 'WHS' },
    { namePrefix: 'SBody' },
  ]
  try {
    const device = await (navigator as any).bluetooth.requestDevice({
      filters,
      optionalServices: EMS_OPTIONAL_SERVICES,
    })
    return device
  } catch (e:any) {
    if (e?.name === 'NotFoundError') throw new Error('Nenhum dispositivo selecionado.')
    throw e
  }
}

export async function requestAnyDevice(): Promise<any> {
  if (!isBluetoothSupported()) throw new Error('Bluetooth não suportado.')
  const device = await (navigator as any).bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: EMS_OPTIONAL_SERVICES,
  })
  return device
}

export async function connectDevice(device: any): Promise<any> {
  if (!device.gatt) throw new Error('Device sem GATT.')
  if (device.gatt.connected) return device.gatt
  const server = await device.gatt.connect()
  return server
}

export async function readBattery(server: any): Promise<number | undefined> {
  try {
    const svc = await server.getPrimaryService('battery_service')
    const chr = await svc.getCharacteristic('battery_level')
    const v = await chr.readValue()
    return v.getUint8(0)
  } catch { return undefined }
}

export async function discoverServices(server: any): Promise<string[]> {
  try {
    const services = await server.getPrimaryServices()
    return services.map((s:any)=> s.uuid)
  } catch { return [] }
}

export async function writeIntensity(server: any, muscle: string, value: number): Promise<boolean> {
  try {
    const services = await server.getPrimaryServices()
    for (const svc of services) {
      const chars = await svc.getCharacteristics()
      for (const ch of chars) {
        if (ch.properties.write || ch.properties.writeWithoutResponse) {
          const payload = new Uint8Array([muscle.charCodeAt(0) % 256, Math.max(0, Math.min(100, value))])
          try { await ch.writeValue(payload); return true } catch {}
          try { await (ch as any).writeValueWithoutResponse(payload); return true } catch {}
        }
      }
    }
    return false
  } catch { return false }
}

export function onDeviceDisconnect(device: any, cb: () => void) {
  const handler = () => cb()
  device.addEventListener('gattserverdisconnected', handler)
  return () => device.removeEventListener('gattserverdisconnected', handler)
}
