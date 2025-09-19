import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 应用信息
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  getPlatform: () => ipcRenderer.invoke('platform'),
  
  // 对话框
  showMessageBox: (options: any) => ipcRenderer.invoke('show-message-box', options),
  showSaveDialog: (options: any) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),
  
  // 菜单事件
  onMenuNewConnection: (callback: () => void) => {
    ipcRenderer.on('menu-new-connection', callback)
  },
  onMenuImportConfig: (callback: () => void) => {
    ipcRenderer.on('menu-import-config', callback)
  },
  onMenuAbout: (callback: () => void) => {
    ipcRenderer.on('menu-about', callback)
  },
  
  // 移除监听器
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  }
})

// 类型声明
declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>
      getPlatform: () => Promise<string>
      showMessageBox: (options: any) => Promise<any>
      showSaveDialog: (options: any) => Promise<any>
      showOpenDialog: (options: any) => Promise<any>
      onMenuNewConnection: (callback: () => void) => void
      onMenuImportConfig: (callback: () => void) => void
      onMenuAbout: (callback: () => void) => void
      removeAllListeners: (channel: string) => void
    }
  }
}
