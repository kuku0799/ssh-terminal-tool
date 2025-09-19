import React from 'react'
import styled from 'styled-components'
import { 
  Settings, 
  RotateCcw, 
  Download, 
  Upload, 
  Copy, 
  Search, 
  Maximize2, 
  Minimize2,
  Wifi,
  WifiOff,
  MoreVertical
} from 'lucide-react'
import { Connection } from '../../stores/connectionStore'
import { DropdownMenu } from '../UI/DropdownMenu'

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  min-height: 48px;
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

const ConnectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.backgroundTertiary};
  border-radius: ${props => props.theme.borderRadius.sm};
`

const StatusIndicator = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.connected ? props.theme.colors.success : props.theme.colors.error};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
`

const ConnectionName = styled.span`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`

const ConnectionDetails = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
`

const ToolbarButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${props => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.primary
      case 'danger':
        return props.theme.colors.error
      default:
        return 'transparent'
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'primary':
      case 'danger':
        return props.theme.colors.textInverse
      default:
        return props.theme.colors.text
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.primary
      case 'danger':
        return props.theme.colors.error
      default:
        return props.theme.colors.border
    }
  }};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'primary':
          return props.theme.colors.primaryHover
        case 'danger':
          return props.theme.colors.error
        default:
          return props.theme.colors.backgroundTertiary
      }
    }};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: 0 ${props => props.theme.spacing.sm};
  border-right: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-right: none;
  }
`

const SearchInput = styled.input`
  width: 200px;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.size.sm};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`

interface TerminalToolbarProps {
  connection: Connection
  isConnected: boolean
  onSettings: () => void
  onReconnect: () => void
}

export const TerminalToolbar: React.FC<TerminalToolbarProps> = ({
  connection,
  isConnected,
  onSettings,
  onReconnect
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleSearch = () => {
    // 实现终端搜索功能
    console.log('Searching for:', searchQuery)
  }

  const handleCopy = () => {
    // 实现复制功能
    console.log('Copying terminal content')
  }

  const handleDownload = () => {
    // 实现下载功能
    console.log('Downloading terminal content')
  }

  const handleUpload = () => {
    // 实现上传功能
    console.log('Uploading file')
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toolbarItems = [
    {
      label: '设置',
      icon: <Settings size={16} />,
      onClick: onSettings
    },
    {
      label: '重新连接',
      icon: <RotateCcw size={16} />,
      onClick: onReconnect,
      disabled: !isConnected
    },
    {
      label: '复制内容',
      icon: <Copy size={16} />,
      onClick: handleCopy
    },
    {
      label: '下载日志',
      icon: <Download size={16} />,
      onClick: handleDownload
    },
    {
      label: '上传文件',
      icon: <Upload size={16} />,
      onClick: handleUpload,
      disabled: !isConnected
    }
  ]

  return (
    <Toolbar>
      <LeftSection>
        <ConnectionInfo>
          <StatusIndicator connected={isConnected}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isConnected ? '已连接' : '未连接'}
          </StatusIndicator>
          <ConnectionName>{connection.name}</ConnectionName>
          <ConnectionDetails>
            {connection.host}:{connection.port}
          </ConnectionDetails>
        </ConnectionInfo>
      </LeftSection>

      <RightSection>
        <ToolbarGroup>
          <SearchInput
            placeholder="搜索终端内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <ToolbarButton onClick={handleSearch}>
            <Search size={16} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton onClick={handleCopy}>
            <Copy size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleDownload}>
            <Download size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleUpload} disabled={!isConnected}>
            <Upload size={16} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton onClick={handleFullscreen}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </ToolbarButton>
          <ToolbarButton onClick={onReconnect} disabled={!isConnected}>
            <RotateCcw size={16} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <DropdownMenu
            items={toolbarItems}
            trigger={
              <ToolbarButton>
                <MoreVertical size={16} />
              </ToolbarButton>
            }
          />
        </ToolbarGroup>
      </RightSection>
    </Toolbar>
  )
}
