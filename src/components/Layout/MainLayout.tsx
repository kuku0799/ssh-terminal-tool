import React, { useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { TabManager } from './TabManager'
import { useThemeStore } from '../../stores/themeStore'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentTheme } = useThemeStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <ThemeProvider theme={currentTheme}>
      <LayoutContainer>
        <Header 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <MainContent>
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <ContentArea>
            <TabManager />
            {children}
          </ContentArea>
        </MainContent>
      </LayoutContainer>
    </ThemeProvider>
  )
}
