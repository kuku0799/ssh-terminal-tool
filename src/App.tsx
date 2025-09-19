import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/Layout/MainLayout'
import { ConnectionManager } from './components/Connection/ConnectionManager'
import { TerminalView } from './components/Terminal/TerminalView'
import { SFTPView } from './components/SFTP/SFTPView'
import { MonitoringView } from './components/Monitoring/MonitoringView'
import { SettingsView } from './components/Settings/SettingsView'
import { useConnectionStore } from './stores/connectionStore'
import { useThemeStore } from './stores/themeStore'

function App() {
  const { loadConnections } = useConnectionStore()
  const { loadTheme } = useThemeStore()

  useEffect(() => {
    // 加载保存的连接和主题设置
    loadConnections()
    loadTheme()
  }, [loadConnections, loadTheme])

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ConnectionManager />} />
          <Route path="/terminal/:connectionId" element={<TerminalView />} />
          <Route path="/sftp/:connectionId" element={<SFTPView />} />
          <Route path="/monitoring" element={<MonitoringView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
