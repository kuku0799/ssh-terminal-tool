import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Terminal as XTerminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { SearchAddon } from 'xterm-addon-search'
import { Unicode11Addon } from 'xterm-addon-unicode11'
import 'xterm/css/xterm.css'
import { useParams } from 'react-router-dom'
import { useConnectionStore } from '../../stores/connectionStore'
import { TerminalToolbar } from './TerminalToolbar'
import { TerminalSettings } from './TerminalSettings'

const TerminalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
`

const TerminalWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`

const TerminalElement = styled.div`
  width: 100%;
  height: 100%;
  
  .xterm {
    height: 100%;
  }
  
  .xterm-viewport {
    background: ${props => props.theme.colors.background} !important;
  }
  
  .xterm-screen {
    background: ${props => props.theme.colors.background} !important;
  }
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background};
  display: flex;
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

export const TerminalView: React.FC = () => {
  const { connectionId } = useParams<{ connectionId: string }>()
  const { getConnection } = useConnectionStore()
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInstanceRef = useRef<XTerminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const connection = connectionId ? getConnection(connectionId) : null

  useEffect(() => {
    if (!connection) {
      setError('连接不存在')
      setIsLoading(false)
      return
    }

    initializeTerminal()
    connectToServer()

    return () => {
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.dispose()
      }
    }
  }, [connectionId])

  const initializeTerminal = () => {
    if (!terminalRef.current || !connection) return

    // 创建终端实例
    const terminal = new XTerminal({
      theme: {
        background: connection.terminal?.theme === 'dark' ? '#1e1e1e' : '#ffffff',
        foreground: connection.terminal?.theme === 'dark' ? '#ffffff' : '#000000',
        cursor: '#007acc',
        selection: '#007acc40',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#007acc',
        magenta: '#bc05bc',
        cyan: '#14a8a8',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5'
      },
      fontFamily: connection.terminal?.fontFamily || 'JetBrains Mono, Consolas, Monaco, monospace',
      fontSize: connection.terminal?.fontSize || 14,
      rows: connection.terminal?.rows || 24,
      cols: connection.terminal?.cols || 80,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      tabStopWidth: 4,
      bellStyle: 'sound',
      allowTransparency: false,
      allowProposedApi: true
    })

    // 添加插件
    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    const searchAddon = new SearchAddon()
    const unicode11Addon = new Unicode11Addon()

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)
    terminal.loadAddon(searchAddon)
    terminal.loadAddon(unicode11Addon)
    terminal.unicode.activeVersion = '11'

    // 挂载终端
    terminal.open(terminalRef.current)
    fitAddon.fit()

    // 保存引用
    terminalInstanceRef.current = terminal
    fitAddonRef.current = fitAddon

    // 处理窗口大小变化
    const handleResize = () => {
      fitAddon.fit()
    }

    window.addEventListener('resize', handleResize)

    // 处理终端输入
    terminal.onData((data) => {
      // 这里会发送数据到SSH连接
      console.log('Terminal input:', data)
    })

    // 处理终端大小变化
    terminal.onResize((size) => {
      console.log('Terminal resized:', size)
    })

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  const connectToServer = async () => {
    if (!connection) return

    setIsLoading(true)
    setError(null)

    try {
      // 模拟连接过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 这里实现实际的SSH连接逻辑
      // 使用node-ssh或ssh2库
      
      setIsConnected(true)
      setIsLoading(false)
      
      // 显示欢迎信息
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.write('\r\n\x1b[32m连接成功！\x1b[0m\r\n')
        terminalInstanceRef.current.write(`\x1b[36m欢迎使用 SSH Terminal Tool\x1b[0m\r\n`)
        terminalInstanceRef.current.write(`\x1b[33m服务器: ${connection.host}:${connection.port}\x1b[0m\r\n`)
        terminalInstanceRef.current.write(`\x1b[33m用户: ${connection.username}\x1b[0m\r\n`)
        terminalInstanceRef.current.write('\r\n')
        terminalInstanceRef.current.write('$ ')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '连接失败')
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    connectToServer()
  }

  const handleSettings = () => {
    setShowSettings(true)
  }

  if (!connection) {
    return (
      <TerminalContainer>
        <ErrorOverlay>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>连接不存在</ErrorTitle>
          <ErrorMessage>请检查连接ID是否正确</ErrorMessage>
        </ErrorOverlay>
      </TerminalContainer>
    )
  }

  return (
    <TerminalContainer>
      <TerminalToolbar
        connection={connection}
        isConnected={isConnected}
        onSettings={handleSettings}
        onReconnect={handleRetry}
      />
      
      <TerminalWrapper>
        <TerminalElement ref={terminalRef} />
        
        {isLoading && (
          <LoadingOverlay>
            <div>
              <LoadingSpinner />
              <LoadingText>正在连接服务器...</LoadingText>
            </div>
          </LoadingOverlay>
        )}
        
        {error && (
          <ErrorOverlay>
            <ErrorIcon>❌</ErrorIcon>
            <ErrorTitle>连接失败</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <RetryButton onClick={handleRetry}>
              重试连接
            </RetryButton>
          </ErrorOverlay>
        )}
      </TerminalWrapper>

      {showSettings && (
        <TerminalSettings
          connection={connection}
          onClose={() => setShowSettings(false)}
        />
      )}
    </TerminalContainer>
  )
}
