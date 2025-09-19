import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { 
  Save, 
  Download, 
  Upload, 
  Search, 
  Replace, 
  Settings, 
  FileText, 
  Code, 
  Image,
  File,
  Folder,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react'
import * as monaco from 'monaco-editor'

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
`

const EditorToolbar = styled.div`
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

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.backgroundTertiary};
  border-radius: ${props => props.theme.borderRadius.sm};
`

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
`

const FileName = styled.span`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`

const FilePath = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
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

const EditorWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`

const EditorElement = styled.div`
  width: 100%;
  height: 100%;
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

const StatusLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const StatusRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`

const SearchReplacePanel = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.sm};
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  z-index: 10;
`

const SearchInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.size.sm};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

const ReplaceInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.size.sm};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${props => props.theme.fonts.size.sm};

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.sm};

  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
    color: ${props => props.theme.colors.text};
  }
`

const FileExplorer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-right: 1px solid ${props => props.theme.colors.border};
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  z-index: 5;
  display: flex;
  flex-direction: column;
`

const FileExplorerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const FileExplorerTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const FileExplorerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.sm};
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

interface EditorViewProps {
  filePath?: string
  content?: string
  onSave?: (content: string) => void
  onClose?: () => void
}

export const EditorView: React.FC<EditorViewProps> = ({
  filePath = 'untitled.txt',
  content = '',
  onSave,
  onClose
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSearchReplace, setShowSearchReplace] = useState(false)
  const [showFileExplorer, setShowFileExplorer] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [isModified, setIsModified] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [selectionCount, setSelectionCount] = useState(0)

  useEffect(() => {
    if (editorRef.current && !editorInstanceRef.current) {
      // 配置Monaco Editor
      monaco.editor.setTheme('vs-dark')
      
      const editor = monaco.editor.create(editorRef.current, {
        value: content,
        language: getLanguageFromPath(filePath),
        theme: 'vs-dark',
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        minimap: { enabled: true },
        wordWrap: 'on',
        tabSize: 2,
        insertSpaces: true,
        renderWhitespace: 'selection',
        renderControlCharacters: true,
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
        contextmenu: true,
        mouseWheelZoom: true,
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true
        }
      })

      editorInstanceRef.current = editor

      // 监听内容变化
      editor.onDidChangeModelContent(() => {
        setIsModified(true)
      })

      // 监听光标位置变化
      editor.onDidChangeCursorPosition((e) => {
        setCursorPosition({
          line: e.position.lineNumber,
          column: e.position.column
        })
      })

      // 监听选择变化
      editor.onDidChangeCursorSelection((e) => {
        setSelectionCount(e.selectionCount)
      })

      // 监听键盘快捷键
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        handleSave()
      })

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
        setShowSearchReplace(true)
      })

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
        setShowSearchReplace(true)
        setReplaceQuery('')
      })

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
        setShowFileExplorer(!showFileExplorer)
      })

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.F11, () => {
        handleFullscreen()
      })

      return () => {
        editor.dispose()
        editorInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue(content)
      setIsModified(false)
    }
  }, [content])

  const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase()
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'shell',
      'bash': 'shell',
      'zsh': 'shell',
      'dockerfile': 'dockerfile',
      'docker': 'dockerfile',
      'ini': 'ini',
      'conf': 'ini',
      'log': 'log',
      'txt': 'plaintext'
    }

    return languageMap[extension || ''] || 'plaintext'
  }

  const handleSave = () => {
    if (editorInstanceRef.current && onSave) {
      const content = editorInstanceRef.current.getValue()
      onSave(content)
      setIsModified(false)
    }
  }

  const handleDownload = () => {
    if (editorInstanceRef.current) {
      const content = editorInstanceRef.current.getValue()
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filePath
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.js,.ts,.py,.html,.css,.json,.md,.xml,.yaml,.yml,.sql,.sh,.bash,.zsh,.dockerfile,.ini,.conf,.log'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          if (editorInstanceRef.current) {
            editorInstanceRef.current.setValue(content)
            setIsModified(true)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleSearch = () => {
    if (editorInstanceRef.current && searchQuery) {
      editorInstanceRef.current.getAction('actions.find')?.run()
    }
  }

  const handleReplace = () => {
    if (editorInstanceRef.current && searchQuery && replaceQuery) {
      editorInstanceRef.current.getAction('editor.action.replaceAll')?.run()
    }
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

  const getFileIcon = (path: string) => {
    const extension = path.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'cs':
      case 'php':
      case 'rb':
      case 'go':
      case 'rs':
        return <Code size={16} />
      case 'html':
      case 'htm':
      case 'css':
      case 'scss':
      case 'sass':
      case 'less':
        return <FileText size={16} />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image size={16} />
      default:
        return <File size={16} />
    }
  }

  return (
    <EditorContainer>
      <EditorToolbar>
        <ToolbarLeft>
          <FileInfo>
            <FileIcon>
              {getFileIcon(filePath)}
            </FileIcon>
            <div>
              <FileName>{filePath.split('/').pop()}</FileName>
              <FilePath>{filePath}</FilePath>
            </div>
          </FileInfo>
        </ToolbarLeft>

        <ToolbarRight>
          <ToolbarButton onClick={() => setShowFileExplorer(!showFileExplorer)}>
            <Folder size={16} />
            文件
          </ToolbarButton>
          
          <ToolbarButton onClick={() => setShowSearchReplace(!showSearchReplace)}>
            <Search size={16} />
            搜索
          </ToolbarButton>
          
          <ToolbarButton onClick={handleUpload}>
            <Upload size={16} />
            打开
          </ToolbarButton>
          
          <ToolbarButton onClick={handleDownload}>
            <Download size={16} />
            下载
          </ToolbarButton>
          
          <ToolbarButton onClick={handleSave} variant="primary">
            <Save size={16} />
            保存
          </ToolbarButton>
          
          <ToolbarButton onClick={handleFullscreen}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </ToolbarButton>
          
          {onClose && (
            <ToolbarButton onClick={onClose}>
              <X size={16} />
            </ToolbarButton>
          )}
        </ToolbarRight>
      </EditorToolbar>

      <EditorWrapper>
        <SearchReplacePanel isOpen={showSearchReplace}>
          <SearchInput
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchInput
            placeholder="替换为..."
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleReplace()}
          />
          <SearchButton onClick={handleSearch}>
            <Search size={14} />
            搜索
          </SearchButton>
          <SearchButton onClick={handleReplace}>
            <Replace size={14} />
            替换
          </SearchButton>
          <CloseButton onClick={() => setShowSearchReplace(false)}>
            <X size={14} />
          </CloseButton>
        </SearchReplacePanel>

        <FileExplorer isOpen={showFileExplorer}>
          <FileExplorerHeader>
            <FileExplorerTitle>文件资源管理器</FileExplorerTitle>
            <CloseButton onClick={() => setShowFileExplorer(false)}>
              <X size={14} />
            </CloseButton>
          </FileExplorerHeader>
          <FileExplorerContent>
            <EmptyState>
              <EmptyIcon>
                <Folder size={32} />
              </EmptyIcon>
              <EmptyTitle>文件资源管理器</EmptyTitle>
              <EmptyDescription>
                文件资源管理器功能正在开发中...
              </EmptyDescription>
            </EmptyState>
          </FileExplorerContent>
        </FileExplorer>

        <EditorElement ref={editorRef} />
      </EditorWrapper>

      <StatusBar>
        <StatusLeft>
          <StatusItem>
            <span>行 {cursorPosition.line}, 列 {cursorPosition.column}</span>
          </StatusItem>
          {selectionCount > 0 && (
            <StatusItem>
              <span>{selectionCount} 个选择</span>
            </StatusItem>
          )}
          <StatusItem>
            <span>{getLanguageFromPath(filePath).toUpperCase()}</span>
          </StatusItem>
        </StatusLeft>
        
        <StatusRight>
          <StatusItem>
            <span>{isModified ? '已修改' : '已保存'}</span>
          </StatusItem>
          <StatusItem>
            <span>UTF-8</span>
          </StatusItem>
          <StatusItem>
            <span>LF</span>
          </StatusItem>
        </StatusRight>
      </StatusBar>
    </EditorContainer>
  )
}
