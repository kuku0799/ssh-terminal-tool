import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { 
  Folder, 
  File, 
  Upload, 
  Download, 
  RefreshCw, 
  Home, 
  ArrowLeft, 
  Plus,
  Trash2,
  Edit,
  Copy,
  Move,
  Search,
  Grid,
  List,
  MoreVertical
} from 'lucide-react'
import { useConnectionStore } from '../../stores/connectionStore'
import { sftpService, SFTPFile, SFTPTransfer, SFTPConnection } from '../../services/sftpService'
import { FileItem } from './FileItem'
import { TransferPanel } from './TransferPanel'
import { FileEditor } from './FileEditor'
import { DropdownMenu } from '../UI/DropdownMenu'

const SFTPContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
`

const SFTPToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  min-height: 48px;
`

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.text};
`

const BreadcrumbItem = styled.span<{ clickable?: boolean }>`
  color: ${props => props.clickable ? props.theme.colors.primary : props.theme.colors.text};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  &:hover {
    text-decoration: ${props => props.clickable ? 'underline' : 'none'};
  }
`

const ToolbarButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.variant === 'primary' ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.variant === 'primary' ? props.theme.colors.textInverse : props.theme.colors.text};
  border: 1px solid ${props => props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${props => props.theme.fonts.size.sm};

  &:hover {
    background: ${props => props.variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.backgroundTertiary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SFTPContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`

const FileTree = styled.div`
  width: 300px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
`

const FileTreeHeader = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`

const FileTreeContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.sm};
`

const FileList = styled.div`
  flex: 1;
  background: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
`

const FileListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
`

const ViewToggle = styled.div`
  display: flex;
  background: ${props => props.theme.colors.backgroundTertiary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  overflow: hidden;
`

const ViewButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.text};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.backgroundTertiary};
  }
`

const FileListContent = styled.div<{ viewMode: 'grid' | 'list' }>`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.sm};
  display: ${props => props.viewMode === 'grid' ? 'grid' : 'flex'};
  grid-template-columns: ${props => props.viewMode === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'none'};
  flex-direction: ${props => props.viewMode === 'list' ? 'column' : 'unset'};
  gap: ${props => props.theme.spacing.xs};
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

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border-top: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
`

export const SFTPView: React.FC = () => {
  const { connectionId } = useParams<{ connectionId: string }>()
  const { getConnection, setConnectionStatus } = useConnectionStore()
  const [sftpConnection, setSftpConnection] = useState<SFTPConnection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [showTransferPanel, setShowTransferPanel] = useState(false)
  const [editingFile, setEditingFile] = useState<SFTPFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const connection = connectionId ? getConnection(connectionId) : null

  useEffect(() => {
    if (!connection) {
      setError('连接不存在')
      setIsLoading(false)
      return
    }

    connectToSFTP()

    return () => {
      if (connectionId) {
        sftpService.disconnect(connectionId)
      }
    }
  }, [connectionId])

  const connectToSFTP = async () => {
    if (!connection) return

    setIsLoading(true)
    setError(null)

    try {
      const sftpConn = await sftpService.connect(connection)
      setSftpConnection(sftpConn)
      setIsConnected(true)
      setConnectionStatus(connection.id, true)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'SFTP连接失败')
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    if (sftpConnection) {
      await sftpService.listFiles(sftpConnection.connectionId, sftpConnection.currentPath)
    }
  }

  const handleFileClick = async (file: SFTPFile) => {
    if (file.isDirectory) {
      await sftpService.changeDirectory(sftpConnection!.connectionId, file.path)
      setSftpConnection({ ...sftpConnection!, currentPath: file.path })
    } else if (file.isFile) {
      // 打开文件编辑器
      setEditingFile(file)
    }
  }

  const handleFileSelect = (filePath: string, selected: boolean) => {
    if (selected) {
      setSelectedFiles(prev => [...prev, filePath])
    } else {
      setSelectedFiles(prev => prev.filter(path => path !== filePath))
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !sftpConnection) return

    for (const file of files) {
      const remotePath = `${sftpConnection.currentPath}/${file.name}`
      await sftpService.uploadFile(sftpConnection.connectionId, file.name, remotePath)
    }

    await handleRefresh()
  }

  const handleCreateFolder = async () => {
    const name = prompt('请输入文件夹名称:')
    if (name && sftpConnection) {
      await sftpService.createDirectory(sftpConnection.connectionId, sftpConnection.currentPath, name)
      await handleRefresh()
    }
  }

  const handleDeleteSelected = async () => {
    if (!sftpConnection || selectedFiles.length === 0) return

    if (confirm(`确定要删除选中的 ${selectedFiles.length} 个文件吗？`)) {
      for (const filePath of selectedFiles) {
        await sftpService.deleteFile(sftpConnection.connectionId, filePath)
      }
      setSelectedFiles([])
      await handleRefresh()
    }
  }

  const filteredFiles = sftpConnection?.files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  if (!connection) {
    return (
      <SFTPContainer>
        <EmptyState>
          <EmptyIcon>
            <Folder size={32} />
          </EmptyIcon>
          <EmptyTitle>连接不存在</EmptyTitle>
          <EmptyDescription>请检查连接ID是否正确</EmptyDescription>
        </EmptyState>
      </SFTPContainer>
    )
  }

  return (
    <SFTPContainer>
      <SFTPToolbar>
        <ToolbarLeft>
          <h3>SFTP 文件管理器</h3>
          {sftpConnection && (
            <Breadcrumb>
              {sftpConnection.currentPath.split('/').map((segment, index, array) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem
                    clickable={index < array.length - 1}
                    onClick={() => {
                      if (index < array.length - 1) {
                        const path = array.slice(0, index + 1).join('/') || '/'
                        sftpService.changeDirectory(sftpConnection.connectionId, path)
                      }
                    }}
                  >
                    {segment || '根目录'}
                  </BreadcrumbItem>
                  {index < array.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </Breadcrumb>
          )}
        </ToolbarLeft>

        <ToolbarRight>
          <SearchInput
            placeholder="搜索文件..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <ToolbarButton onClick={handleRefresh}>
            <RefreshCw size={16} />
            刷新
          </ToolbarButton>
          
          <ToolbarButton onClick={handleUpload}>
            <Upload size={16} />
            上传
          </ToolbarButton>
          
          <ToolbarButton onClick={handleCreateFolder}>
            <Plus size={16} />
            新建文件夹
          </ToolbarButton>
          
          {selectedFiles.length > 0 && (
            <ToolbarButton onClick={handleDeleteSelected} variant="secondary">
              <Trash2 size={16} />
              删除选中
            </ToolbarButton>
          )}
          
          <ToolbarButton onClick={() => setShowTransferPanel(!showTransferPanel)}>
            <Download size={16} />
            传输列表
          </ToolbarButton>
        </ToolbarRight>
      </SFTPToolbar>

      <SFTPContent>
        <FileTree>
          <FileTreeHeader>文件树</FileTreeHeader>
          <FileTreeContent>
            <EmptyState>
              <EmptyIcon>
                <Folder size={32} />
              </EmptyIcon>
              <EmptyTitle>文件树</EmptyTitle>
              <EmptyDescription>
                文件树功能正在开发中...
              </EmptyDescription>
            </EmptyState>
          </FileTreeContent>
        </FileTree>

        <FileList>
          <FileListHeader>
            <div>
              {filteredFiles.length} 个项目
            </div>
            <ViewToggle>
              <ViewButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </ViewButton>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </ViewButton>
            </ViewToggle>
          </FileListHeader>

          <FileListContent viewMode={viewMode}>
            {isLoading ? (
              <LoadingOverlay>
                <LoadingSpinner />
                <LoadingText>正在连接SFTP服务器...</LoadingText>
              </LoadingOverlay>
            ) : error ? (
              <EmptyState>
                <EmptyIcon>❌</EmptyIcon>
                <EmptyTitle>连接失败</EmptyTitle>
                <EmptyDescription>{error}</EmptyDescription>
                <ToolbarButton onClick={connectToSFTP}>
                  重试连接
                </ToolbarButton>
              </EmptyState>
            ) : filteredFiles.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <File size={32} />
                </EmptyIcon>
                <EmptyTitle>文件夹为空</EmptyTitle>
                <EmptyDescription>
                  {searchQuery ? '没有找到匹配的文件' : '此文件夹中没有文件'}
                </EmptyDescription>
              </EmptyState>
            ) : (
              filteredFiles.map((file) => (
                <FileItem
                  key={file.path}
                  file={file}
                  viewMode={viewMode}
                  selected={selectedFiles.includes(file.path)}
                  onSelect={(selected) => handleFileSelect(file.path, selected)}
                  onClick={() => handleFileClick(file)}
                />
              ))
            )}
          </FileListContent>
        </FileList>
      </SFTPContent>

      <StatusBar>
        <div>
          {isConnected ? '已连接' : '未连接'} - {connection.host}:{connection.port}
        </div>
        <div>
          {selectedFiles.length > 0 && `${selectedFiles.length} 个文件已选中`}
        </div>
      </StatusBar>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {showTransferPanel && sftpConnection && (
        <TransferPanel
          connection={sftpConnection}
          onClose={() => setShowTransferPanel(false)}
        />
      )}

      {editingFile && (
        <FileEditor
          file={editingFile}
          connection={sftpConnection!}
          onClose={() => setEditingFile(null)}
        />
      )}
    </SFTPContainer>
  )
}
