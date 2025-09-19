import React, { useState } from 'react'
import styled from 'styled-components'
import { X, Plus, Terminal, Folder, Monitor } from 'lucide-react'
import { useConnectionStore } from '../../stores/connectionStore'

const TabContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.backgroundTertiary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  min-height: 40px;
`

const Tab = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.colors.background : props.theme.colors.backgroundTertiary};
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textSecondary};
  border-right: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  max-width: 200px;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  }
`

const TabContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  flex: 1;
  min-width: 0;
`

const TabTitle = styled.span`
  font-size: ${props => props.theme.fonts.size.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TabIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  border-radius: 2px;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.textInverse};
  }
`

const AddTabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`

interface Tab {
  id: string
  type: 'terminal' | 'sftp' | 'monitoring'
  connectionId?: string
  title: string
  icon: React.ReactNode
}

export const TabManager: React.FC = () => {
  const { connections, activeConnectionId } = useConnectionStore()
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

  const getTabIcon = (type: Tab['type']) => {
    switch (type) {
      case 'terminal':
        return <Terminal size={14} />
      case 'sftp':
        return <Folder size={14} />
      case 'monitoring':
        return <Monitor size={14} />
      default:
        return <Terminal size={14} />
    }
  }

  const addTab = (type: Tab['type'], connectionId?: string) => {
    const connection = connectionId ? connections.find(c => c.id === connectionId) : null
    const title = connection ? `${connection.name} - ${type}` : type
    
    const newTab: Tab = {
      id: crypto.randomUUID(),
      type,
      connectionId,
      title,
      icon: getTabIcon(type)
    }

    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
  }

  const closeTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      if (activeTabId === tabId) {
        setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null)
      }
      return newTabs
    })
  }

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId)
  }

  // 当活动连接改变时，自动创建终端标签
  React.useEffect(() => {
    if (activeConnectionId && !tabs.find(tab => tab.connectionId === activeConnectionId && tab.type === 'terminal')) {
      addTab('terminal', activeConnectionId)
    }
  }, [activeConnectionId])

  return (
    <TabContainer>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          active={tab.id === activeTabId}
          onClick={() => switchTab(tab.id)}
        >
          <TabContent>
            <TabIcon>{tab.icon}</TabIcon>
            <TabTitle>{tab.title}</TabTitle>
          </TabContent>
          <CloseButton
            onClick={(e) => {
              e.stopPropagation()
              closeTab(tab.id)
            }}
          >
            <X size={12} />
          </CloseButton>
        </Tab>
      ))}
      
      <AddTabButton onClick={() => addTab('terminal')}>
        <Plus size={16} />
      </AddTabButton>
    </TabContainer>
  )
}
