import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Search, History, Zap, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import { commandService, CommandSuggestion, CommandHistory } from '../../services/commandService'

const PaletteContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding-top: 10vh;
`

const PaletteContent = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  width: 100%;
  max-width: 600px;
  max-height: 70vh;
  overflow: hidden;
  box-shadow: 0 20px 40px ${props => props.theme.colors.shadow};
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: ${props => props.theme.spacing.sm};
`

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.size.lg};
  outline: none;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`

const ResultsContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const ResultSection = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ResultItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.colors.primary}20 : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`

const CommandIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`

const CommandInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const CommandName = styled.div`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`

const CommandDescription = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`

const CommandUsage = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.mono};
  margin-top: ${props => props.theme.spacing.xs};
`

const CommandCategory = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.backgroundTertiary};
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: ${props => props.theme.spacing.sm};
  flex-shrink: 0;
`

const HistoryItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.colors.primary}20 : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`

const HistoryIcon = styled.div<{ success: boolean }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.success ? props.theme.colors.success : props.theme.colors.error};
  flex-shrink: 0;
`

const HistoryCommand = styled.div`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.mono};
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const HistoryTime = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
  flex-shrink: 0;
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
  background: ${props => props.theme.colors.backgroundSecondary};
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

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border-top: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.textSecondary};
`

const FooterHint = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSelectCommand: (command: string) => void
  connectionId?: string
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCommand,
  connectionId
}) => {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [suggestions, setSuggestions] = useState<CommandSuggestion[]>([])
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setActiveIndex(0)
      setShowHistory(false)
      loadHistory()
    }
  }, [isOpen, connectionId])

  useEffect(() => {
    if (query.trim()) {
      const newSuggestions = commandService.getSuggestions(query, connectionId)
      setSuggestions(newSuggestions)
      setShowHistory(false)
      setActiveIndex(0)
    } else {
      setSuggestions([])
      setShowHistory(true)
    }
  }, [query, connectionId])

  const loadHistory = () => {
    const historyData = commandService.getHistory(connectionId)
    setHistory(historyData.slice(0, 20)) // 只显示最近20条
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = showHistory ? history : suggestions
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, items.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (items.length > 0 && activeIndex >= 0 && activeIndex < items.length) {
          if (showHistory) {
            onSelectCommand(history[activeIndex].command)
          } else {
            onSelectCommand(suggestions[activeIndex].command)
          }
          onClose()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  const handleSelectCommand = (command: string) => {
    onSelectCommand(command)
    onClose()
  }

  const formatTime = (date: Date): string => {
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

  const allItems = showHistory ? history : suggestions

  return (
    <PaletteContainer isOpen={isOpen} onClick={onClose}>
      <PaletteContent onClick={(e) => e.stopPropagation()}>
        <SearchContainer>
          <Search size={20} color="var(--text-secondary)" />
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={showHistory ? "搜索命令历史..." : "搜索命令..."}
          />
        </SearchContainer>

        <ResultsContainer>
          {allItems.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                {showHistory ? <History size={24} /> : <Search size={24} />}
              </EmptyIcon>
              <EmptyTitle>
                {showHistory ? '没有命令历史' : '没有找到命令'}
              </EmptyTitle>
              <EmptyDescription>
                {showHistory 
                  ? '开始使用终端命令，历史记录将显示在这里'
                  : '尝试输入其他关键词搜索命令'
                }
              </EmptyDescription>
            </EmptyState>
          ) : (
            <>
              {showHistory ? (
                <ResultSection>
                  <SectionHeader>
                    <History size={16} />
                    命令历史
                  </SectionHeader>
                  {history.map((item, index) => (
                    <HistoryItem
                      key={item.id}
                      active={index === activeIndex}
                      onClick={() => handleSelectCommand(item.command)}
                    >
                      <HistoryIcon success={item.success}>
                        {item.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      </HistoryIcon>
                      <HistoryCommand>{item.command}</HistoryCommand>
                      <HistoryTime>{formatTime(item.timestamp)}</HistoryTime>
                    </HistoryItem>
                  ))}
                </ResultSection>
              ) : (
                <ResultSection>
                  <SectionHeader>
                    <Zap size={16} />
                    命令建议
                  </SectionHeader>
                  {suggestions.map((suggestion, index) => (
                    <ResultItem
                      key={suggestion.command}
                      active={index === activeIndex}
                      onClick={() => handleSelectCommand(suggestion.command)}
                    >
                      <CommandIcon>
                        <ChevronRight size={16} />
                      </CommandIcon>
                      <CommandInfo>
                        <CommandName>{suggestion.command}</CommandName>
                        <CommandDescription>{suggestion.description}</CommandDescription>
                        {suggestion.usage && (
                          <CommandUsage>{suggestion.usage}</CommandUsage>
                        )}
                      </CommandInfo>
                      <CommandCategory>{suggestion.category}</CommandCategory>
                    </ResultItem>
                  ))}
                </ResultSection>
              )}
            </>
          )}
        </ResultsContainer>

        <Footer>
          <FooterHint>
            <span>↑↓</span>
            <span>选择</span>
            <span>↵</span>
            <span>执行</span>
            <span>Esc</span>
            <span>关闭</span>
          </FooterHint>
          <div>
            {allItems.length} 项
          </div>
        </Footer>
      </PaletteContent>
    </PaletteContainer>
  )
}
