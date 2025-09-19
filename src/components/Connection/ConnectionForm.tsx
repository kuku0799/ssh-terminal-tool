import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { X, Save, TestTube, Eye, EyeOff, Key, Lock, Globe, Shield } from 'lucide-react'
import { useConnectionStore, Connection } from '../../stores/connectionStore'

const FormContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
`

const FormCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px ${props => props.theme.colors.shadow};
`

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const FormTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`

const FormContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`

const FormSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
`

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`

const Label = styled.label`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`

const Input = styled.input<{ error?: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.size.sm};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`

const Select = styled.select<{ error?: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`

const TextArea = styled.textarea<{ error?: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fonts.size.sm};
  font-family: ${props => props.theme.fonts.mono};
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`

const PasswordInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.backgroundTertiary};
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

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  background: transparent;
`

const ErrorMessage = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.xs};
`

const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
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

interface ConnectionFormProps {
  connectionId?: string | null
  onClose: () => void
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ connectionId, onClose }) => {
  const { connections, addConnection, updateConnection, getConnection } = useConnectionStore()
  const [formData, setFormData] = useState<Partial<Connection>>({
    name: '',
    type: 'ssh',
    host: '',
    port: 22,
    username: '',
    password: '',
    privateKey: '',
    passphrase: '',
    group: '',
    tags: [],
    color: '#007acc',
    terminal: {
      rows: 24,
      cols: 80,
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      theme: 'default'
    },
    rdp: {
      width: 1024,
      height: 768,
      colorDepth: 24,
      fullScreen: false
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (connectionId) {
      const connection = getConnection(connectionId)
      if (connection) {
        setFormData(connection)
      }
    }
  }, [connectionId, getConnection])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = '连接名称不能为空'
    }

    if (!formData.host?.trim()) {
      newErrors.host = '主机地址不能为空'
    }

    if (!formData.port || formData.port < 1 || formData.port > 65535) {
      newErrors.port = '端口号必须在1-65535之间'
    }

    if (!formData.username?.trim()) {
      newErrors.username = '用户名不能为空'
    }

    if (!formData.privateKey && !formData.password) {
      newErrors.password = '密码或私钥至少需要填写一个'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (connectionId) {
        updateConnection(connectionId, formData as Connection)
      } else {
        addConnection(formData as Omit<Connection, 'id' | 'isConnected'>)
      }
      onClose()
    } catch (error) {
      console.error('保存连接失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    // 这里实现连接测试逻辑
    setTimeout(() => {
      setIsLoading(false)
      alert('连接测试功能待实现')
    }, 2000)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 清除相关错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleTagChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag)
    handleInputChange('tags', tags)
  }

  return (
    <FormContainer onClick={onClose}>
      <FormCard onClick={(e) => e.stopPropagation()}>
        <FormHeader>
          <FormTitle>
            {connectionId ? '编辑连接' : '新建连接'}
          </FormTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <FormContent>
            <FormSection>
              <SectionTitle>
                <Globe size={20} />
                基本信息
              </SectionTitle>
              
              <FormGrid>
                <FormGroup fullWidth>
                  <Label>连接名称 *</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="例如: 生产服务器"
                    error={!!errors.name}
                  />
                  {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>连接类型 *</Label>
                  <Select
                    value={formData.type || 'ssh'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="ssh">SSH</option>
                    <option value="rdp">RDP (远程桌面)</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>主机地址 *</Label>
                  <Input
                    value={formData.host || ''}
                    onChange={(e) => handleInputChange('host', e.target.value)}
                    placeholder="192.168.1.100 或 example.com"
                    error={!!errors.host}
                  />
                  {errors.host && <ErrorMessage>{errors.host}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>端口 *</Label>
                  <Input
                    type="number"
                    value={formData.port || 22}
                    onChange={(e) => handleInputChange('port', parseInt(e.target.value))}
                    min="1"
                    max="65535"
                    error={!!errors.port}
                  />
                  {errors.port && <ErrorMessage>{errors.port}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>用户名 *</Label>
                  <Input
                    value={formData.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="root"
                    error={!!errors.username}
                  />
                  {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>分组</Label>
                  <Input
                    value={formData.group || ''}
                    onChange={(e) => handleInputChange('group', e.target.value)}
                    placeholder="例如: 生产环境"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>标签</Label>
                  <Input
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => handleTagChange(e.target.value)}
                    placeholder="用逗号分隔，例如: linux, production, web"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>颜色</Label>
                  <ColorPicker
                    type="color"
                    value={formData.color || '#007acc'}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <Shield size={20} />
                认证设置
              </SectionTitle>
              
              <FormGrid>
                <FormGroup>
                  <Label>密码</Label>
                  <PasswordInput>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password || ''}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="输入密码"
                      error={!!errors.password}
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </PasswordToggle>
                  </PasswordInput>
                  {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>私钥文件</Label>
                  <TextArea
                    value={formData.privateKey || ''}
                    onChange={(e) => handleInputChange('privateKey', e.target.value)}
                    placeholder="粘贴私钥内容..."
                    rows={6}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>私钥密码</Label>
                  <PasswordInput>
                    <Input
                      type={showPassphrase ? 'text' : 'password'}
                      value={formData.passphrase || ''}
                      onChange={(e) => handleInputChange('passphrase', e.target.value)}
                      placeholder="私钥密码（如果有）"
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassphrase(!showPassphrase)}
                    >
                      {showPassphrase ? <EyeOff size={16} /> : <Eye size={16} />}
                    </PasswordToggle>
                  </PasswordInput>
                </FormGroup>
              </FormGrid>
            </FormSection>

            {formData.type === 'ssh' && (
              <FormSection>
                <SectionTitle>
                  <Key size={20} />
                  终端设置
                </SectionTitle>
                
                <FormGrid>
                  <FormGroup>
                    <Label>行数</Label>
                    <Input
                      type="number"
                      value={formData.terminal?.rows || 24}
                      onChange={(e) => handleInputChange('terminal', {
                        ...formData.terminal,
                        rows: parseInt(e.target.value)
                      })}
                      min="10"
                      max="100"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>列数</Label>
                    <Input
                      type="number"
                      value={formData.terminal?.cols || 80}
                      onChange={(e) => handleInputChange('terminal', {
                        ...formData.terminal,
                        cols: parseInt(e.target.value)
                      })}
                      min="40"
                      max="200"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>字体大小</Label>
                    <Input
                      type="number"
                      value={formData.terminal?.fontSize || 14}
                      onChange={(e) => handleInputChange('terminal', {
                        ...formData.terminal,
                        fontSize: parseInt(e.target.value)
                      })}
                      min="8"
                      max="32"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>字体</Label>
                    <Select
                      value={formData.terminal?.fontFamily || 'JetBrains Mono'}
                      onChange={(e) => handleInputChange('terminal', {
                        ...formData.terminal,
                        fontFamily: e.target.value
                      })}
                    >
                      <option value="JetBrains Mono">JetBrains Mono</option>
                      <option value="Fira Code">Fira Code</option>
                      <option value="Consolas">Consolas</option>
                      <option value="Monaco">Monaco</option>
                      <option value="Courier New">Courier New</option>
                    </Select>
                  </FormGroup>
                </FormGrid>
              </FormSection>
            )}

            {formData.type === 'rdp' && (
              <FormSection>
                <SectionTitle>
                  <Monitor size={20} />
                  远程桌面设置
                </SectionTitle>
                
                <FormGrid>
                  <FormGroup>
                    <Label>宽度</Label>
                    <Input
                      type="number"
                      value={formData.rdp?.width || 1024}
                      onChange={(e) => handleInputChange('rdp', {
                        ...formData.rdp,
                        width: parseInt(e.target.value)
                      })}
                      min="800"
                      max="4096"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>高度</Label>
                    <Input
                      type="number"
                      value={formData.rdp?.height || 768}
                      onChange={(e) => handleInputChange('rdp', {
                        ...formData.rdp,
                        height: parseInt(e.target.value)
                      })}
                      min="600"
                      max="4096}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>颜色深度</Label>
                    <Select
                      value={formData.rdp?.colorDepth || 24}
                      onChange={(e) => handleInputChange('rdp', {
                        ...formData.rdp,
                        colorDepth: parseInt(e.target.value)
                      })}
                    >
                      <option value="8">8位 (256色)</option>
                      <option value="16">16位 (65536色)</option>
                      <option value="24">24位 (真彩色)</option>
                      <option value="32">32位 (真彩色+Alpha)</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <CheckboxGroup>
                      <CheckboxItem>
                        <Checkbox
                          type="checkbox"
                          checked={formData.rdp?.fullScreen || false}
                          onChange={(e) => handleInputChange('rdp', {
                            ...formData.rdp,
                            fullScreen: e.target.checked
                          })}
                        />
                        全屏模式
                      </CheckboxItem>
                    </CheckboxGroup>
                  </FormGroup>
                </FormGrid>
              </FormSection>
            )}
          </FormContent>

          <FormFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              <TestTube size={16} />
              测试连接
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              取消
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              <Save size={16} />
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </FormFooter>
        </form>
      </FormCard>
    </FormContainer>
  )
}
