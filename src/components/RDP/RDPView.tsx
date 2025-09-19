import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useConnectionStore } from '../../stores/connectionStore'
import { rdpService, RDPConnection } from '../../services/rdpService'
import { RDPToolbar } from './RDPToolbar'
import { RDPControls } from './RDPControls'

const RDPContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
`

const RDPWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`

const RDPCanvas = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.backgroundSecondary};
  position: relative;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LoadingText = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fonts.size.sm};
`

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: ${props => props.theme.spacing.xl};
`

const ErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${props => props.theme.colors.error}20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.error};
  font-size: 32px;
`

const ErrorTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`

const ErrorMessage = styled.p`
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  max-width: 400px;
`

const RetryButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }
`

const ConnectionInfo = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  left: ${props => props.theme.spacing.md};
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fonts.size.sm};
  z-index: 5;
`

export const RDPView: React.FC = () => {
  const { connectionId } = useParams<{ connectionId: string }>()
  const { getConnection, setConnectionStatus } = useConnectionStore()
  const [rdpConnection, setRdpConnection] = useState<RDPConnection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const connection = connectionId ? getConnection(connectionId) : null

  useEffect(() => {
    if (!connection) {
      setError('连接不存在')
      setIsLoading(false)
      return
    }

    if (connection.type !== 'rdp') {
      setError('此连接不是RDP类型')
      setIsLoading(false)
      return
    }

    connectToRDP()

    return () => {
      if (connectionId) {
        rdpService.disconnect(connectionId)
      }
    }
  }, [connectionId])

  const connectToRDP = async () => {
    if (!connection) return

    setIsLoading(true)
    setError(null)

    try {
      const rdpConn = await rdpService.connect(connection)
      setRdpConnection(rdpConn)
      setIsConnected(true)
      setConnectionStatus(connection.id, true)

      // 将Canvas添加到DOM
      if (canvasRef.current) {
        canvasRef.current.appendChild(rdpConn.canvas)
      }

      // 设置剪贴板监听
      rdpService.onClipboardData(connection.id, (data) => {
        navigator.clipboard.writeText(data)
      })

      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'RDP连接失败')
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (connectionId) {
      await rdpService.disconnect(connectionId)
      setIsConnected(false)
      setConnectionStatus(connectionId, false)
      setRdpConnection(null)
    }
  }

  const handleReconnect = () => {
    connectToRDP()
  }

  const handleScreenshot = () => {
    if (connectionId) {
      const screenshot = rdpService.captureScreenshot(connectionId)
      if (screenshot) {
        // 创建下载链接
        const link = document.createElement('a')
        link.download = `rdp-screenshot-${Date.now()}.png`
        link.href = screenshot
        link.click()
      }
    }
  }

  const handleFullscreen = () => {
    if (connectionId) {
      rdpService.toggleFullscreen(connectionId)
    }
  }

  const handleStartRecording = () => {
    if (connectionId) {
      rdpService.startRecording(connectionId)
    }
  }

  const handleStopRecording = () => {
    if (connectionId) {
      rdpService.stopRecording(connectionId)
    }
  }

  if (!connection) {
    return (
      <RDPContainer>
        <ErrorOverlay>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>连接不存在</ErrorTitle>
          <ErrorMessage>请检查连接ID是否正确</ErrorMessage>
        </ErrorOverlay>
      </RDPContainer>
    )
  }

  return (
    <RDPContainer>
      <RDPToolbar
        connection={connection}
        isConnected={isConnected}
        onDisconnect={handleDisconnect}
        onReconnect={handleReconnect}
        onScreenshot={handleScreenshot}
        onFullscreen={handleFullscreen}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onToggleControls={() => setShowControls(!showControls)}
      />

      <RDPWrapper>
        <RDPCanvas ref={canvasRef}>
          {isLoading && (
            <LoadingOverlay>
              <LoadingSpinner />
              <LoadingText>正在连接远程桌面...</LoadingText>
            </LoadingOverlay>
          )}

          {error && (
            <ErrorOverlay>
              <ErrorIcon>❌</ErrorIcon>
              <ErrorTitle>连接失败</ErrorTitle>
              <ErrorMessage>{error}</ErrorMessage>
              <RetryButton onClick={handleReconnect}>
                重试连接
              </RetryButton>
            </ErrorOverlay>
          )}

          {isConnected && connection && (
            <ConnectionInfo>
              {connection.host}:{connection.port} - {connection.username}
            </ConnectionInfo>
          )}
        </RDPCanvas>

        {showControls && (
          <RDPControls
            connection={connection}
            onClose={() => setShowControls(false)}
          />
        )}
      </RDPWrapper>
    </RDPContainer>
  )
}
