import React from 'react'
import styled from 'styled-components'
import { Menu, Settings, Monitor, Server, ChevronLeft, ChevronRight } from 'lucide-react'
import { useConnectionStore } from '../../stores/connectionStore'

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0 ${props => props.theme.spacing.md};
  user-select: none;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
  }
`

const Title = styled.h1`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const StatusIndicator = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.connected ? props.theme.colors.success : props.theme.colors.error};
  color: ${props => props.theme.colors.textInverse};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${props => props.theme.fonts.size.sm};

  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
    border-color: ${props => props.theme.colors.primary};
  }
`

interface HeaderProps {
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { activeConnectionId, getConnection } = useConnectionStore()
  const activeConnection = activeConnectionId ? getConnection(activeConnectionId) : null

  return (
    <HeaderContainer>
      <LeftSection>
        <ToggleButton onClick={onToggleSidebar}>
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </ToggleButton>
        <Title>SSH Terminal Tool</Title>
        {activeConnection && (
          <StatusIndicator connected={activeConnection.isConnected}>
            <Server size={14} />
            {activeConnection.name}
          </StatusIndicator>
        )}
      </LeftSection>
      
      <RightSection>
        <ActionButton>
          <Monitor size={16} />
          监控
        </ActionButton>
        <ActionButton>
          <Settings size={16} />
          设置
        </ActionButton>
      </RightSection>
    </HeaderContainer>
  )
}
