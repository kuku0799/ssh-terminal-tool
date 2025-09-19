import React, { useState } from 'react'
import styled from 'styled-components'
import { Plus, Search, Filter, Grid, List, MoreVertical, Edit, Trash2, Copy, Play } from 'lucide-react'
import { useConnectionStore } from '../../stores/connectionStore'
import { ConnectionForm } from './ConnectionForm'
import { ConnectionCard } from './ConnectionCard'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const Title = styled.h1`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const SearchInput = styled.input`
  width: 300px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: 40px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
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

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.colors.textSecondary};
  width: 16px;
  height: 16px;
`

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
    border-color: ${props => props.theme.colors.primary};
  }
`

const ViewToggle = styled.div`
  display: flex;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`

const ViewButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.text};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.backgroundTertiary};
  }
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }
`

const Content = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
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

const StatsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  min-width: 120px;
`

const StatValue = styled.div`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`

const StatLabel = styled.div`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.textSecondary};
`

export const ConnectionManager: React.FC = () => {
  const { connections, searchConnections } = useConnectionStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showForm, setShowForm] = useState(false)
  const [editingConnection, setEditingConnection] = useState<string | null>(null)

  const filteredConnections = searchQuery 
    ? searchConnections(searchQuery)
    : connections

  const connectedCount = connections.filter(c => c.isConnected).length
  const totalCount = connections.length

  const handleEditConnection = (connectionId: string) => {
    setEditingConnection(connectionId)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingConnection(null)
  }

  if (showForm) {
    return (
      <ConnectionForm
        connectionId={editingConnection}
        onClose={handleCloseForm}
      />
    )
  }

  return (
    <Container>
      <Header>
        <Title>连接管理</Title>
        <Controls>
          <SearchContainer>
            <SearchIcon size={16} />
            <SearchInput
              placeholder="搜索连接..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          
          <FilterButton>
            <Filter size={16} />
            筛选
          </FilterButton>
          
          <ViewToggle>
            <ViewButton
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </ViewButton>
            <ViewButton
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </ViewButton>
          </ViewToggle>
          
          <AddButton onClick={() => setShowForm(true)}>
            <Plus size={16} />
            新建连接
          </AddButton>
        </Controls>
      </Header>

      <Content>
        {totalCount > 0 && (
          <StatsContainer>
            <StatCard>
              <StatValue>{totalCount}</StatValue>
              <StatLabel>总连接数</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{connectedCount}</StatValue>
              <StatLabel>已连接</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{totalCount - connectedCount}</StatValue>
              <StatLabel>未连接</StatLabel>
            </StatCard>
          </StatsContainer>
        )}

        {filteredConnections.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Server size={32} />
            </EmptyIcon>
            <EmptyTitle>
              {searchQuery ? '未找到匹配的连接' : '还没有任何连接'}
            </EmptyTitle>
            <EmptyDescription>
              {searchQuery 
                ? '尝试使用不同的关键词搜索'
                : '点击"新建连接"按钮开始添加您的第一个服务器连接'
              }
            </EmptyDescription>
            {!searchQuery && (
              <AddButton onClick={() => setShowForm(true)}>
                <Plus size={16} />
                创建第一个连接
              </AddButton>
            )}
          </EmptyState>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <GridView>
                {filteredConnections.map((connection) => (
                  <ConnectionCard
                    key={connection.id}
                    connection={connection}
                    onEdit={handleEditConnection}
                  />
                ))}
              </GridView>
            ) : (
              <ListView>
                {filteredConnections.map((connection) => (
                  <ConnectionCard
                    key={connection.id}
                    connection={connection}
                    onEdit={handleEditConnection}
                    listView
                  />
                ))}
              </ListView>
            )}
          </>
        )}
      </Content>
    </Container>
  )
}
