import React, { useState } from 'react'
import styled from 'styled-components'
import { 
  Server, 
  Wifi, 
  WifiOff, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Play, 
  Pause,
  ExternalLink,
  Key,
  Lock
} from 'lucide-react'
import { Connection } from '../../stores/connectionStore'
import { useConnectionStore } from '../../stores/connectionStore'
import { DropdownMenu } from '../UI/DropdownMenu'

const Card = styled.div<{ listView?: boolean }>`
  display: flex;
  flex-direction: ${props => props.listView ? 'row' : 'column'};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  min-height: ${props => props.listView ? '80px' : '200px'};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
    transform: translateY(-2px);
  }
`

const CardHeader = styled.div<{ listView?: boolean }>`
  display: flex;
  align-items: ${props => props.listView ? 'center' : 'flex-start'};
  justify-content: space-between;
  margin-bottom: ${props => props.listView ? '0' : props.theme.spacing.md};
  gap: ${props => props.theme.spacing.sm};
`

const ConnectionInfo = styled.div<{ listView?: boolean }>`
  display: flex;
  align-items: ${props => props.listView ? 'center' : 'flex-start'};
  gap: ${props => props.theme.spacing.md};
  flex: 1;
  min-width: 0;
`

const ConnectionIcon = styled.div<{ connected: boolean; listView?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.listView ? '40px' : '48px'};
  height: ${props => props.listView ? '40px' : '48px'};
  background: ${props => props.connected ? props.theme.colors.success : props.theme.colors.backgroundTertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.connected ? props.theme.colors.textInverse : props.theme.colors.textSecondary};
  flex-shrink: 0;
`

const ConnectionDetails = styled.div`
  flex: 1;
  min-width: 0;
`

const ConnectionName = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ConnectionHost = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ConnectionType = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StatusIndicator = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.connected ? props.theme.colors.success : props.theme.colors.error};
  color: ${props => props.theme.colors.textInverse};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
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
        return props.theme.colors.backgroundTertiary
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
  border: none;
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
          return props.theme.colors.border
      }
    }};
    transform: translateY(-1px);
  }
`

const CardContent = styled.div<{ listView?: boolean }>`
  display: ${props => props.listView ? 'none' : 'flex'};
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.fonts.size.sm};
`

const DetailLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`

const DetailValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.sm};
`

const Tag = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: 500;
`

const LastConnected = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.sm};
`

interface ConnectionCardProps {
  connection: Connection
  onEdit: (connectionId: string) => void
  listView?: boolean
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ 
  connection, 
  onEdit, 
  listView = false 
}) => {
  const { deleteConnection, setActiveConnection, setConnectionStatus } = useConnectionStore()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleConnect = () => {
    setActiveConnection(connection.id)
    // 这里会触发连接逻辑
    setConnectionStatus(connection.id, true)
  }

  const handleDisconnect = () => {
    setConnectionStatus(connection.id, false)
  }

  const handleDelete = () => {
    if (window.confirm(`确定要删除连接 "${connection.name}" 吗？`)) {
      deleteConnection(connection.id)
    }
  }

  const handleCopy = () => {
    const connectionString = `${connection.type}://${connection.username}@${connection.host}:${connection.port}`
    navigator.clipboard.writeText(connectionString)
  }

  const formatLastConnected = (date: Date | undefined) => {
    if (!date) return '从未连接'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    return `${days}天前`
  }

  const dropdownItems = [
    {
      label: '连接',
      icon: <Play size={16} />,
      onClick: handleConnect,
      disabled: connection.isConnected
    },
    {
      label: '断开',
      icon: <Pause size={16} />,
      onClick: handleDisconnect,
      disabled: !connection.isConnected
    },
    {
      label: '编辑',
      icon: <Edit size={16} />,
      onClick: () => onEdit(connection.id)
    },
    {
      label: '复制连接信息',
      icon: <Copy size={16} />,
      onClick: handleCopy
    },
    {
      label: '删除',
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      variant: 'danger' as const
    }
  ]

  return (
    <Card listView={listView} onClick={handleConnect}>
      <CardHeader listView={listView}>
        <ConnectionInfo listView={listView}>
          <ConnectionIcon connected={connection.isConnected} listView={listView}>
            <Server size={listView ? 20 : 24} />
          </ConnectionIcon>
          
          <ConnectionDetails>
            <ConnectionName>{connection.name}</ConnectionName>
            <ConnectionHost>{connection.host}:{connection.port}</ConnectionHost>
            <ConnectionType>
              {connection.type === 'ssh' ? (
                <>
                  <Key size={12} />
                  SSH
                </>
              ) : (
                <>
                  <ExternalLink size={12} />
                  RDP
                </>
              )}
            </ConnectionType>
          </ConnectionDetails>
        </ConnectionInfo>

        <CardActions>
          <StatusIndicator connected={connection.isConnected}>
            {connection.isConnected ? (
              <>
                <Wifi size={12} />
                已连接
              </>
            ) : (
              <>
                <WifiOff size={12} />
                未连接
              </>
            )}
          </StatusIndicator>

          <DropdownMenu
            items={dropdownItems}
            trigger={
              <ActionButton onClick={(e) => e.stopPropagation()}>
                <MoreVertical size={16} />
              </ActionButton>
            }
          />
        </CardActions>
      </CardHeader>

      {!listView && (
        <CardContent>
          <DetailRow>
            <DetailLabel>用户名</DetailLabel>
            <DetailValue>{connection.username}</DetailValue>
          </DetailRow>
          
          <DetailRow>
            <DetailLabel>认证方式</DetailLabel>
            <DetailValue>
              {connection.privateKey ? (
                <>
                  <Key size={12} />
                  密钥
                </>
              ) : (
                <>
                  <Lock size={12} />
                  密码
                </>
              )}
            </DetailValue>
          </DetailRow>

          {connection.group && (
            <DetailRow>
              <DetailLabel>分组</DetailLabel>
              <DetailValue>{connection.group}</DetailValue>
            </DetailRow>
          )}

          {connection.tags && connection.tags.length > 0 && (
            <Tags>
              {connection.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </Tags>
          )}

          <LastConnected>
            最后连接: {formatLastConnected(connection.lastConnected)}
          </LastConnected>
        </CardContent>
      )}
    </Card>
  )
}
