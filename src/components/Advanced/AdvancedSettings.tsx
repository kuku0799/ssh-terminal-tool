import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { 
  Settings, 
  Shield, 
  Zap, 
  Compress, 
  Upload, 
  Download, 
  Globe, 
  Lock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Trash2
} from 'lucide-react'
import { advancedService, AdvancedFeatures, TransferProgress } from '../../services/advancedService'

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.lg};
`

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const SettingsTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const SettingsContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`

const SettingsCard = styled.div`
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
  width: 32px;
  height: 32px;
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

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
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
`

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.text};
`

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.colors.primary};
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
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
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;

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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const TransferList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
`

const TransferItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

const TransferInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const TransferName = styled.div`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TransferProgress = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.xs};
`

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${props => props.theme.colors.backgroundTertiary};
  border-radius: 2px;
  overflow: hidden;
  margin-top: ${props => props.theme.spacing.xs};
`

const ProgressFill = styled.div<{ percentage: number; color?: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.color || props.theme.colors.primary};
  transition: width 0.3s ease;
`

const TransferActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`

const StatusIcon = styled.div<{ status: string }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch (props.status) {
      case 'completed':
        return props.theme.colors.success
      case 'error':
      case 'cancelled':
        return props.theme.colors.error
      case 'uploading':
      case 'downloading':
        return props.theme.colors.primary
      default:
        return props.theme.colors.textSecondary
    }
  }};
`

const StatusText = styled.span<{ status: string }>`
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: 500;
  color: ${props => {
    switch (props.status) {
      case 'completed':
        return props.theme.colors.success
      case 'error':
      case 'cancelled':
        return props.theme.colors.error
      case 'uploading':
      case 'downloading':
        return props.theme.colors.primary
      default:
        return props.theme.colors.textSecondary
    }
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.backgroundTertiary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.md};
`

const EmptyTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`

const EmptyDescription = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  margin: 0;
`

export const AdvancedSettings: React.FC = () => {
  const [config, setConfig] = useState<AdvancedFeatures>(advancedService.getDefaultConfig())
  const [transfers, setTransfers] = useState<TransferProgress[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadConfig()
    loadTransfers()

    // 监听传输事件
    advancedService.on('transfer-progress', ({ transferId, transfer }) => {
      setTransfers(prev => prev.map(t => t.id === transferId ? transfer : t))
    })

    advancedService.on('transfer-completed', ({ transferId, transfer }) => {
      setTransfers(prev => prev.map(t => t.id === transferId ? transfer : t))
    })

    return () => {
      advancedService.off('transfer-progress')
      advancedService.off('transfer-completed')
    }
  }, [])

  const loadConfig = async () => {
    try {
      const loadedConfig = await advancedService.loadConfig()
      setConfig(loadedConfig)
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const loadTransfers = () => {
    const transferList = advancedService.getTransfers()
    setTransfers(transferList)
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await advancedService.saveConfig(config)
      // 显示成功消息
    } catch (error) {
      console.error('Failed to save config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestProxy = async () => {
    if (config.proxy) {
      const success = await advancedService.testProxy(config.proxy)
      // 显示测试结果
    }
  }

  const handleCancelTransfer = (transferId: string) => {
    advancedService.cancelTransfer(transferId)
    loadTransfers()
  }

  const handleClearCompleted = () => {
    advancedService.clearCompletedTransfers()
    loadTransfers()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatSpeed = (bytesPerSecond: number): string => {
    return formatFileSize(bytesPerSecond) + '/s'
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.floor(seconds)}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>高级设置</SettingsTitle>
        <Button onClick={handleSave} variant="primary" disabled={isLoading}>
          <Settings size={16} />
          {isLoading ? '保存中...' : '保存设置'}
        </Button>
      </SettingsHeader>

      <SettingsContent>
        {/* 代理设置 */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Globe size={20} />
            </CardIcon>
            <CardTitle>代理设置</CardTitle>
          </CardHeader>
          
          <FormGroup>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={config.proxy !== null}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  proxy: e.target.checked ? {
                    type: 'http',
                    host: '',
                    port: 8080,
                    username: '',
                    password: ''
                  } : null
                }))}
              />
              启用代理
            </CheckboxItem>
          </FormGroup>

          {config.proxy && (
            <>
              <FormGroup>
                <Label>代理类型</Label>
                <Select
                  value={config.proxy.type}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    proxy: prev.proxy ? { ...prev.proxy, type: e.target.value as 'http' | 'socks5' } : null
                  }))}
                >
                  <option value="http">HTTP</option>
                  <option value="socks5">SOCKS5</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>代理地址</Label>
                <Input
                  value={config.proxy.host}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    proxy: prev.proxy ? { ...prev.proxy, host: e.target.value } : null
                  }))}
                  placeholder="proxy.example.com"
                />
              </FormGroup>

              <FormGroup>
                <Label>端口</Label>
                <Input
                  type="number"
                  value={config.proxy.port}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    proxy: prev.proxy ? { ...prev.proxy, port: parseInt(e.target.value) } : null
                  }))}
                  placeholder="8080"
                />
              </FormGroup>

              <FormGroup>
                <Label>用户名（可选）</Label>
                <Input
                  value={config.proxy.username || ''}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    proxy: prev.proxy ? { ...prev.proxy, username: e.target.value } : null
                  }))}
                  placeholder="username"
                />
              </FormGroup>

              <FormGroup>
                <Label>密码（可选）</Label>
                <Input
                  type="password"
                  value={config.proxy.password || ''}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    proxy: prev.proxy ? { ...prev.proxy, password: e.target.value } : null
                  }))}
                  placeholder="password"
                />
              </FormGroup>

              <Button onClick={handleTestProxy}>
                测试代理
              </Button>
            </>
          )}
        </SettingsCard>

        {/* 压缩设置 */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Compress size={20} />
            </CardIcon>
            <CardTitle>压缩设置</CardTitle>
          </CardHeader>
          
          <FormGroup>
            <Label>压缩算法</Label>
            <Select
              value={config.compression.algorithm}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                compression: { ...prev.compression, algorithm: e.target.value as any }
              }))}
            >
              <option value="gzip">GZIP</option>
              <option value="deflate">Deflate</option>
              <option value="brotli">Brotli</option>
              <option value="lz4">LZ4</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>压缩级别 (1-9)</Label>
            <Input
              type="number"
              min="1"
              max="9"
              value={config.compression.level}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                compression: { ...prev.compression, level: parseInt(e.target.value) }
              }))}
            />
          </FormGroup>

          <FormGroup>
            <Label>压缩阈值 (字节)</Label>
            <Input
              type="number"
              value={config.compression.threshold}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                compression: { ...prev.compression, threshold: parseInt(e.target.value) }
              }))}
            />
          </FormGroup>
        </SettingsCard>

        {/* Zmodem设置 */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Upload size={20} />
            </CardIcon>
            <CardTitle>Zmodem 传输</CardTitle>
          </CardHeader>
          
          <CheckboxGroup>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={config.zmodem.enabled}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  zmodem: { ...prev.zmodem, enabled: e.target.checked }
                }))}
              />
              启用 Zmodem
            </CheckboxItem>
            
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={config.zmodem.autoDetect}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  zmodem: { ...prev.zmodem, autoDetect: e.target.checked }
                }))}
              />
              自动检测
            </CheckboxItem>
          </CheckboxGroup>

          <FormGroup>
            <Label>缓冲区大小 (字节)</Label>
            <Input
              type="number"
              value={config.zmodem.bufferSize}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                zmodem: { ...prev.zmodem, bufferSize: parseInt(e.target.value) }
              }))}
            />
          </FormGroup>

          <FormGroup>
            <Label>超时时间 (毫秒)</Label>
            <Input
              type="number"
              value={config.zmodem.timeout}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                zmodem: { ...prev.zmodem, timeout: parseInt(e.target.value) }
              }))}
            />
          </FormGroup>
        </SettingsCard>

        {/* 加速设置 */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Zap size={20} />
            </CardIcon>
            <CardTitle>连接加速</CardTitle>
          </CardHeader>
          
          <CheckboxItem>
            <Checkbox
              type="checkbox"
              checked={config.acceleration.enabled}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                acceleration: { ...prev.acceleration, enabled: e.target.checked }
              }))}
            />
            启用加速
          </CheckboxItem>

          {config.acceleration.enabled && (
            <>
              <FormGroup>
                <Label>加速服务器</Label>
                <Input
                  value={config.acceleration.server}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    acceleration: { ...prev.acceleration, server: e.target.value }
                  }))}
                  placeholder="acceleration.example.com"
                />
              </FormGroup>

              <FormGroup>
                <Label>端口</Label>
                <Input
                  type="number"
                  value={config.acceleration.port}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    acceleration: { ...prev.acceleration, port: parseInt(e.target.value) }
                  }))}
                />
              </FormGroup>

              <FormGroup>
                <Label>协议</Label>
                <Select
                  value={config.acceleration.protocol}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    acceleration: { ...prev.acceleration, protocol: e.target.value as any }
                  }))}
                >
                  <option value="https">HTTPS</option>
                  <option value="http">HTTP</option>
                  <option value="socks5">SOCKS5</option>
                </Select>
              </FormGroup>
            </>
          )}
        </SettingsCard>

        {/* 安全设置 */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Shield size={20} />
            </CardIcon>
            <CardTitle>安全设置</CardTitle>
          </CardHeader>
          
          <CheckboxGroup>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={config.security.strictHostKeyChecking}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  security: { ...prev.security, strictHostKeyChecking: e.target.checked }
                }))}
              />
              严格主机密钥检查
            </CheckboxItem>
          </CheckboxGroup>

          <FormGroup>
            <Label>已知主机文件</Label>
            <Input
              value={config.security.knownHostsFile}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                security: { ...prev.security, knownHostsFile: e.target.value }
              }))}
            />
          </FormGroup>
        </SettingsCard>

        {/* 性能设置 */}
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Settings size={20} />
            </CardIcon>
            <CardTitle>性能设置</CardTitle>
          </CardHeader>
          
          <CheckboxGroup>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={config.performance.keepAlive}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  performance: { ...prev.performance, keepAlive: e.target.checked }
                }))}
              />
              保持连接
            </CheckboxItem>
            
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={config.performance.tcpNoDelay}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  performance: { ...prev.performance, tcpNoDelay: e.target.checked }
                }))}
              />
              TCP No Delay
            </CheckboxItem>
            
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                checked={config.performance.compression}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  performance: { ...prev.performance, compression: e.target.checked }
                }))}
              />
              连接压缩
            </CheckboxItem>
          </CheckboxGroup>

          <FormGroup>
            <Label>保活间隔 (秒)</Label>
            <Input
              type="number"
              value={config.performance.keepAliveInterval}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                performance: { ...prev.performance, keepAliveInterval: parseInt(e.target.value) }
              }))}
            />
          </FormGroup>
        </SettingsCard>

        {/* 传输管理 */}
        <SettingsCard style={{ gridColumn: '1 / -1' }}>
          <CardHeader>
            <CardIcon>
              <Download size={20} />
            </CardIcon>
            <CardTitle>传输管理</CardTitle>
            <div style={{ marginLeft: 'auto' }}>
              <Button onClick={handleClearCompleted} variant="secondary">
                <Trash2 size={16} />
                清理已完成
              </Button>
            </div>
          </CardHeader>
          
          {transfers.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Upload size={24} />
              </EmptyIcon>
              <EmptyTitle>没有传输任务</EmptyTitle>
              <EmptyDescription>
                文件传输任务将显示在这里
              </EmptyDescription>
            </EmptyState>
          ) : (
            <TransferList>
              {transfers.map((transfer) => (
                <TransferItem key={transfer.id}>
                  <StatusIcon status={transfer.status}>
                    {transfer.status === 'completed' ? (
                      <CheckCircle size={14} />
                    ) : transfer.status === 'error' || transfer.status === 'cancelled' ? (
                      <XCircle size={14} />
                    ) : transfer.status === 'uploading' ? (
                      <Upload size={14} />
                    ) : transfer.status === 'downloading' ? (
                      <Download size={14} />
                    ) : (
                      <Pause size={14} />
                    )}
                  </StatusIcon>
                  
                  <TransferInfo>
                    <TransferName>{transfer.fileName}</TransferName>
                    <TransferProgress>
                      {formatFileSize(transfer.transferred)} / {formatFileSize(transfer.fileSize)} 
                      ({transfer.progress.toFixed(1)}%)
                      {transfer.speed > 0 && ` • ${formatSpeed(transfer.speed)}`}
                      {transfer.eta > 0 && ` • ${formatTime(transfer.eta)}`}
                    </TransferProgress>
                    <ProgressBar>
                      <ProgressFill 
                        percentage={transfer.progress} 
                        color={transfer.status === 'error' ? 'var(--error-color)' : undefined}
                      />
                    </ProgressBar>
                  </TransferInfo>
                  
                  <TransferActions>
                    <StatusText status={transfer.status}>
                      {transfer.status === 'uploading' ? '上传中' :
                       transfer.status === 'downloading' ? '下载中' :
                       transfer.status === 'completed' ? '已完成' :
                       transfer.status === 'error' ? '错误' :
                       transfer.status === 'cancelled' ? '已取消' : '等待中'}
                    </StatusText>
                    
                    {(transfer.status === 'uploading' || transfer.status === 'downloading') && (
                      <Button
                        onClick={() => handleCancelTransfer(transfer.id)}
                        variant="danger"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        <XCircle size={12} />
                      </Button>
                    )}
                  </TransferActions>
                </TransferItem>
              ))}
            </TransferList>
          )}
        </SettingsCard>
      </SettingsContent>
    </SettingsContainer>
  )
}
