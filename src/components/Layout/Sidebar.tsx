import React from 'react'
import styled from 'styled-components'
import { 
  Server, 
  Plus, 
  Search, 
  Folder, 
  Monitor, 
  Settings, 
  ChevronDown,
  ChevronRight,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useConnectionStore } from '../../stores/connectionStore'
import { useState } from 'react'

const SidebarContainer = styled.div<{ collapsed: boolean }>`
  width: ${props => props.collapsed ? '60px' : '280px'};
  height: 100%;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
`

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const SearchContainer = styled.div<{ collapsed: boolean }>`
  display: ${props => props.collapsed ? 'none' : 'flex'};
  align-items: center;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.xs};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.size.sm};
  outline: none;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.sm};
`

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const SectionHeader = styled.div<{ collapsed: boolean }>`
  display: ${props => props.collapsed ? 'none' : 'flex'};
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`

const MenuItem = styled.button<{ active?: boolean; collapsed?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.collapsed ? '0' : props.theme.spacing.sm};
  width: 100%;
  padding: ${props => props.collapsed ? props.theme.spacing.sm : `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${props => props.theme.fonts.size.sm};
  text-align: left;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.backgroundTertiary};
  }

  .icon {
    flex-shrink: 0;
  }

  .text {
    display: ${props => props.collapsed ? 'none' : 'block'};
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status {
    display: ${props => props.collapsed ? 'none' : 'flex'};
    align-items: center;
    margin-left: auto;
  }
`

const ConnectionItem = styled(MenuItem)`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: ${props => props.theme.colors.primary};
    border-radius: 0 2px 2px 0;
    transition: height 0.2s ease;
  }

  &:hover::before,
  &.active::before {
    height: 60%;
  }
`

const AddButton = styled(MenuItem)`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`

const CollapsedIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 32px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { connections, activeConnectionId, setActiveConnection, searchConnections } = useConnectionStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    connections: true,
    tools: true
  })

  const filteredConnections = searchQuery 
    ? searchConnections(searchQuery)
    : connections

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <SidebarContainer collapsed={collapsed}>
      <SidebarHeader>
        <SearchContainer collapsed={collapsed}>
          <Search size={16} />
          <SearchInput
            placeholder="搜索连接..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </SidebarHeader>

      <SidebarContent>
        <Section>
          <SectionHeader collapsed={collapsed}>
            <span>连接</span>
            {!collapsed && (
              <button onClick={() => toggleSection('connections')}>
                {expandedSections.connections ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
          </SectionHeader>
          
          {expandedSections.connections && (
            <SectionContent>
              <AddButton collapsed={collapsed}>
                <Plus size={16} className="icon" />
                <span className="text">新建连接</span>
              </AddButton>
              
              {filteredConnections.map((connection) => (
                <ConnectionItem
                  key={connection.id}
                  active={connection.id === activeConnectionId}
                  collapsed={collapsed}
                  onClick={() => setActiveConnection(connection.id)}
                >
                  <Server size={16} className="icon" />
                  <span className="text">{connection.name}</span>
                  <div className="status">
                    {connection.isConnected ? (
                      <Wifi size={12} color="var(--success-color)" />
                    ) : (
                      <WifiOff size={12} color="var(--error-color)" />
                    )}
                  </div>
                </ConnectionItem>
              ))}
            </SectionContent>
          )}
        </Section>

        <Section>
          <SectionHeader collapsed={collapsed}>
            <span>工具</span>
            {!collapsed && (
              <button onClick={() => toggleSection('tools')}>
                {expandedSections.tools ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
          </SectionHeader>
          
          {expandedSections.tools && (
            <SectionContent>
              <MenuItem collapsed={collapsed}>
                <Folder size={16} className="icon" />
                <span className="text">文件管理器</span>
              </MenuItem>
              
              <MenuItem collapsed={collapsed}>
                <Monitor size={16} className="icon" />
                <span className="text">系统监控</span>
              </MenuItem>
              
              <MenuItem collapsed={collapsed}>
                <Settings size={16} className="icon" />
                <span className="text">设置</span>
              </MenuItem>
            </SectionContent>
          )}
        </Section>
      </SidebarContent>
    </SidebarContainer>
  )
}
