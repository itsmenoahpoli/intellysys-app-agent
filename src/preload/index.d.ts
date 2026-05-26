import { ElectronAPI } from '@electron-toolkit/preload'

export interface SystemMetrics {
  cpuModel: string
  cpuCores: number
  totalMem: number
  usedMem: number
  freeMem: number
  processMem: number
  appUptime: number
  platform: string
  arch: string
  nodeVersion: string
  chromeVersion: string
  electronVersion: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      window: {
        minimize: () => void
        maximize: () => void
        close: () => void
        toggleDevTools: () => void
      }
      metrics: {
        get: () => Promise<SystemMetrics>
      }
    }
  }
}
