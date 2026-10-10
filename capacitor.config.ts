import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'pt.techbodyu.web',
  appName: 'TechBody U',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      appReadyTimeout: 1000,
      resetWhenUpdateFailed: true
    },
    BluetoothLe: {
      displayStrings: {
        scanning: 'A procurar fato EMS...',
        cancel: 'Cancelar',
        availableDevices: 'Dispositivos disponíveis',
        noDeviceFound: 'Nenhum fato encontrado'
      }
    }
  }
}

export default config
