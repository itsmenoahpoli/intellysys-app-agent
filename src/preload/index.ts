import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Interface for system metrics
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

// Custom APIs for the renderer
const windowAPI = {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  toggleDevTools: () => ipcRenderer.send('window-toggle-devtools')
}

const metricsAPI = {
  get: (): Promise<SystemMetrics> => ipcRenderer.invoke('get-system-metrics')
}

// Expose APIs if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', {
      window: windowAPI,
      metrics: metricsAPI
    })
  } catch (error) {
    console.error('Error exposing APIs in preload:', error)
  }
} else {
  // @ts-ignore (for development fallback)
  window.electron = electronAPI
  // @ts-ignore
  window.api = {
    window: windowAPI,
    metrics: metricsAPI
  }
}
