import React from 'react'
import styled from 'styled-components'
import { Folder, File, FileText, Image, Archive, Video, Music, Code } from 'lucide-react'
import { SFTPFile } from '../../services/sftpService'

const FileItemContainer = styled.div<{ viewMode: 'grid' | 'list'; selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.viewMode === 'grid' ? props.theme.spacing.md : props.theme.spacing.sm};
  background: ${props => props.selected ? props.theme.colors.primary}20 : 'transparent'};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: ${props => props.viewMode === 'grid' ? '120px' : '40px'};
  flex-direction: ${props => props.viewMode === 'grid' ? 'column' : 'row'};
  text-align: ${props => props.viewMode === 'grid' ? 'center' : 'left'};

  &:hover {
    background: ${props => props.selected ? props.theme.colors.primary}30 : props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
  }
`

const FileIcon = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.theme.spacing['2xl']};
  height: ${props => props.theme.spacing['2xl']};
  color: ${props => {
    switch (props.type) {
      case 'directory': return props.theme.colors.primary
      case 'file': return props.theme.colors.textSecondary
      default: return props.theme.colors.text
    }
  }};
  flex-shrink: 0;
`

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const FileName = styled.div`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: ${props => props.theme.spacing.xs};
`

const FileDetails = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`

const FileSize = styled.span``

const FileDate = styled.span``

const FilePermissions = styled.span`
  font-family: ${props => props.theme.fonts.mono};
`

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`

interface FileItemProps {
  file: SFTPFile
  viewMode: 'grid' | 'list'
  selected: boolean
  onSelect: (selected: boolean) => void
  onClick: () => void
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  viewMode,
  selected,
  onSelect,
  onClick
}) => {
  const getFileIcon = (file: SFTPFile) => {
    if (file.isDirectory) {
      return <Folder size={viewMode === 'grid' ? 32 : 20} />
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'txt':
      case 'md':
      case 'log':
        return <FileText size={viewMode === 'grid' ? 32 : 20} />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <Image size={viewMode === 'grid' ? 32 : 20} />
      case 'zip':
      case 'tar':
      case 'gz':
      case 'rar':
        return <Archive size={viewMode === 'grid' ? 32 : 20} />
      case 'mp4':
      case 'avi':
      case 'mkv':
        return <Video size={viewMode === 'grid' ? 32 : 20} />
      case 'mp3':
      case 'wav':
      case 'flac':
        return <Music size={viewMode === 'grid' ? 32 : 20} />
      case 'js':
      case 'ts':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'html':
      case 'css':
        return <Code size={viewMode === 'grid' ? 32 : 20} />
      default:
        return <File size={viewMode === 'grid' ? 32 : 20} />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onSelect(e.target.checked)
  }

  return (
    <FileItemContainer
      viewMode={viewMode}
      selected={selected}
      onClick={handleClick}
    >
      <Checkbox
        type="checkbox"
        checked={selected}
        onChange={handleSelect}
      />
      
      <FileIcon type={file.type}>
        {getFileIcon(file)}
      </FileIcon>
      
      <FileInfo>
        <FileName>{file.name}</FileName>
        <FileDetails>
          {!file.isDirectory && (
            <FileSize>{formatFileSize(file.size)}</FileSize>
          )}
          <FileDate>{formatDate(file.modified)}</FileDate>
          <FilePermissions>{file.permissions}</FilePermissions>
        </FileDetails>
      </FileInfo>
    </FileItemContainer>
  )
}
