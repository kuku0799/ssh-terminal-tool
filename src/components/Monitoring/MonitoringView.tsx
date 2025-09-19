import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Activity, Cpu, HardDrive, Wifi, AlertTriangle, Play, Pause, RefreshCw } from 'lucide-react'
import { useConnectionStore } from '../../stores/connectionStore'
import { monitoringService, MonitoringData, SystemInfo, CPUInfo, MemoryInfo, DiskInfo, NetworkInfo, ProcessInfo } from '../../services/monitoringService'

const MonitoringContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.lg};
`

const MonitoringHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const MonitoringTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const MonitoringControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const ControlButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.backgroundSecondary};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${props => props.theme.fonts.size.sm};

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.backgroundTertiary};
  }
`

const MonitoringGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  flex: 1;
`

const MonitoringCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.colors.primary}20;
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`

const CardTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const CardContent = styled.div`
  color: ${props => props.theme.colors.textSecondary};
`

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const MetricLabel = styled.span`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.textSecondary};
`

const MetricValue = styled.span`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.backgroundTertiary};
  border-radius: 4px;
  overflow: hidden;
  margin: ${props => props.theme.spacing.xs} 0;
`

const ProgressFill = styled.div<{ percentage: number; color?: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.color || props.theme.colors.primary};
  transition: width 0.3s ease;
`

const ProcessList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`

const ProcessItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.fonts.size.xs};

  &:last-child {
    border-bottom: none;
  }
`

const ProcessName = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`

const ProcessStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
`

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const EmptyTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`

const EmptyDescription = styled.p`
  font-size: ${props => props.theme.fonts.size.base};
  margin-bottom: ${props => props.theme.spacing.lg};
`

export const MonitoringView: React.FC = () => {
  const { connections } = useConnectionStore()
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)

  useEffect(() => {
    // 监听监控数据
    monitoringService.on('monitoring-data', ({ connectionId, data }) => {
      if (connectionId === selectedConnection) {
        setMonitoringData(data)
      }
    })

    return () => {
      monitoringService.off('monitoring-data')
    }
  }, [selectedConnection])

  const startMonitoring = async () => {
    if (!selectedConnection) return

    const connection = connections.find(c => c.id === selectedConnection)
    if (!connection) return

    await monitoringService.startMonitoring(selectedConnection, connection)
    setIsMonitoring(true)
  }

  const stopMonitoring = () => {
    if (selectedConnection) {
      monitoringService.stopMonitoring(selectedConnection)
    }
    setIsMonitoring(false)
  }

  const refreshData = async () => {
    if (selectedConnection) {
      const connection = connections.find(c => c.id === selectedConnection)
      if (connection) {
        await monitoringService.startMonitoring(selectedConnection, connection)
      }
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}天 ${hours}小时 ${minutes}分钟`
  }

  const getUsageColor = (usage: number): string => {
    if (usage > 90) return '#dc3545' // 红色
    if (usage > 70) return '#ffc107' // 黄色
    return '#28a745' // 绿色
  }

  if (connections.length === 0) {
    return (
      <MonitoringContainer>
        <EmptyState>
          <EmptyIcon>
            <Activity size={32} />
          </EmptyIcon>
          <EmptyTitle>没有可监控的连接</EmptyTitle>
          <EmptyDescription>
            请先添加服务器连接，然后选择要监控的连接
          </EmptyDescription>
        </EmptyState>
      </MonitoringContainer>
    )
  }

  return (
    <MonitoringContainer>
      <MonitoringHeader>
        <MonitoringTitle>系统监控</MonitoringTitle>
        <MonitoringControls>
          <select
            value={selectedConnection || ''}
            onChange={(e) => setSelectedConnection(e.target.value)}
            style={{
              padding: '8px 12px',
              background: 'var(--background-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text)',
              marginRight: '8px'
            }}
          >
            <option value="">选择连接</option>
            {connections.map(conn => (
              <option key={conn.id} value={conn.id}>
                {conn.name} ({conn.host})
              </option>
            ))}
          </select>
          
          <ControlButton
            active={isMonitoring}
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            disabled={!selectedConnection}
          >
            {isMonitoring ? <Pause size={16} /> : <Play size={16} />}
            {isMonitoring ? '停止监控' : '开始监控'}
          </ControlButton>
          
          <ControlButton onClick={refreshData} disabled={!selectedConnection}>
            <RefreshCw size={16} />
            刷新
          </ControlButton>
        </MonitoringControls>
      </MonitoringHeader>

      {!selectedConnection ? (
        <EmptyState>
          <EmptyIcon>
            <Activity size={32} />
          </EmptyIcon>
          <EmptyTitle>选择要监控的连接</EmptyTitle>
          <EmptyDescription>
            请从上方下拉菜单中选择一个连接开始监控
          </EmptyDescription>
        </EmptyState>
      ) : !monitoringData ? (
        <EmptyState>
          <EmptyIcon>
            <Activity size={32} />
          </EmptyIcon>
          <EmptyTitle>正在连接监控服务</EmptyTitle>
          <EmptyDescription>
            请稍候，正在建立监控连接...
          </EmptyDescription>
        </EmptyState>
      ) : (
        <MonitoringGrid>
          {/* 系统信息 */}
          <MonitoringCard>
            <CardHeader>
              <CardIcon>
                <Activity size={20} />
              </CardIcon>
              <CardTitle>系统信息</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricRow>
                <MetricLabel>主机名</MetricLabel>
                <MetricValue>{monitoringData.system.hostname}</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>平台</MetricLabel>
                <MetricValue>{monitoringData.system.platform}</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>架构</MetricLabel>
                <MetricValue>{monitoringData.system.arch}</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>运行时间</MetricLabel>
                <MetricValue>{formatUptime(monitoringData.system.uptime)}</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>负载均衡</MetricLabel>
                <MetricValue>{monitoringData.system.loadAverage.map(l => l.toFixed(2)).join(', ')}</MetricValue>
              </MetricRow>
            </CardContent>
          </MonitoringCard>

          {/* CPU信息 */}
          <MonitoringCard>
            <CardHeader>
              <CardIcon>
                <Cpu size={20} />
              </CardIcon>
              <CardTitle>CPU 使用率</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricRow>
                <MetricLabel>总体使用率</MetricLabel>
                <MetricValue>{monitoringData.cpu.usage.toFixed(1)}%</MetricValue>
              </MetricRow>
              <ProgressBar>
                <ProgressFill 
                  percentage={monitoringData.cpu.usage} 
                  color={getUsageColor(monitoringData.cpu.usage)}
                />
              </ProgressBar>
              <div style={{ marginTop: '12px' }}>
                <MetricLabel>核心使用率</MetricLabel>
                {monitoringData.cpu.cores.map((core, index) => (
                  <div key={index}>
                    <MetricRow>
                      <MetricLabel>核心 {core.id}</MetricLabel>
                      <MetricValue>{core.usage.toFixed(1)}%</MetricValue>
                    </MetricRow>
                    <ProgressBar>
                      <ProgressFill 
                        percentage={core.usage} 
                        color={getUsageColor(core.usage)}
                      />
                    </ProgressBar>
                  </div>
                ))}
              </div>
            </CardContent>
          </MonitoringCard>

          {/* 内存信息 */}
          <MonitoringCard>
            <CardHeader>
              <CardIcon>
                <HardDrive size={20} />
              </CardIcon>
              <CardTitle>内存使用</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricRow>
                <MetricLabel>总内存</MetricLabel>
                <MetricValue>{formatBytes(monitoringData.memory.total)}</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>已使用</MetricLabel>
                <MetricValue>{formatBytes(monitoringData.memory.used)}</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>可用</MetricLabel>
                <MetricValue>{formatBytes(monitoringData.memory.available)}</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>使用率</MetricLabel>
                <MetricValue>{monitoringData.memory.usage.toFixed(1)}%</MetricValue>
              </MetricRow>
              <ProgressBar>
                <ProgressFill 
                  percentage={monitoringData.memory.usage} 
                  color={getUsageColor(monitoringData.memory.usage)}
                />
              </ProgressBar>
            </CardContent>
          </MonitoringCard>

          {/* 磁盘信息 */}
          <MonitoringCard>
            <CardHeader>
              <CardIcon>
                <HardDrive size={20} />
              </CardIcon>
              <CardTitle>磁盘使用</CardTitle>
            </CardHeader>
            <CardContent>
              {monitoringData.disks.map((disk, index) => (
                <div key={index}>
                  <MetricRow>
                    <MetricLabel>{disk.mountPoint}</MetricLabel>
                    <MetricValue>{disk.usage.toFixed(1)}%</MetricValue>
                  </MetricRow>
                  <ProgressBar>
                    <ProgressFill 
                      percentage={disk.usage} 
                      color={getUsageColor(disk.usage)}
                    />
                  </ProgressBar>
                  <MetricRow>
                    <MetricLabel>已使用</MetricLabel>
                    <MetricValue>{formatBytes(disk.used)} / {formatBytes(disk.total)}</MetricValue>
                  </MetricRow>
                </div>
              ))}
            </CardContent>
          </MonitoringCard>

          {/* 网络信息 */}
          <MonitoringCard>
            <CardHeader>
              <CardIcon>
                <Wifi size={20} />
              </CardIcon>
              <CardTitle>网络状态</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricRow>
                <MetricLabel>已建立连接</MetricLabel>
                <MetricValue>{monitoringData.network.connections.established}</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>监听端口</MetricLabel>
                <MetricValue>{monitoringData.network.connections.listening}</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>等待连接</MetricLabel>
                <MetricValue>{monitoringData.network.connections.timeWait}</MetricValue>
              </MetricRow>
              {monitoringData.network.interfaces.map((iface, index) => (
                <div key={index}>
                  <MetricRow>
                    <MetricLabel>{iface.name}</MetricLabel>
                    <MetricValue>
                      ↓{formatBytes(iface.bytesReceived)} ↑{formatBytes(iface.bytesSent)}
                    </MetricValue>
                  </MetricRow>
                </div>
              ))}
            </CardContent>
          </MonitoringCard>

          {/* 进程信息 */}
          <MonitoringCard>
            <CardHeader>
              <CardIcon>
                <Activity size={20} />
              </CardIcon>
              <CardTitle>进程列表</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessList>
                {monitoringData.processes.map((process, index) => (
                  <ProcessItem key={index}>
                    <ProcessName>{process.name}</ProcessName>
                    <ProcessStats>
                      <span>CPU: {process.cpu.toFixed(1)}%</span>
                      <span>内存: {formatBytes(process.memory * 1024 * 1024)}</span>
                    </ProcessStats>
                  </ProcessItem>
                ))}
              </ProcessList>
            </CardContent>
          </MonitoringCard>
        </MonitoringGrid>
      )}
    </MonitoringContainer>
  )
}
