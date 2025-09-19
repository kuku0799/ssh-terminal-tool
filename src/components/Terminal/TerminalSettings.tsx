import React, { useState } from 'react'
import styled from 'styled-components'
import { X, Save, RotateCcw } from 'lucide-react'
import { Connection } from '../../stores/connectionStore'
import { useConnectionStore } from '../../stores/connectionStore'

const SettingsContainer = styled.div`
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

const SettingsCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px ${props => props.theme.colors.shadow};
`

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const SettingsTitle = styled.h2`
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

const SettingsContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`

const SettingsSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`

const Label = styled.label`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
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

const Select = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
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

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  background: transparent;
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

const SettingsFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.backgroundTertiary};
  color: ${props => props.variant === 'primary' ? props.theme.colors.textInverse : props.theme.colors.text};
  border: 1px solid ${props => props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${props => props.variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.border};
    transform: translateY(-1px);
  }
`

interface TerminalSettingsProps {
  connection: Connection
  onClose: () => void
}

export const TerminalSettings: React.FC<TerminalSettingsProps> = ({ connection, onClose }) => {
  const { updateConnection } = useConnectionStore()
  const [settings, setSettings] = useState({
    rows: connection.terminal?.rows || 24,
    cols: connection.terminal?.cols || 80,
    fontSize: connection.terminal?.fontSize || 14,
    fontFamily: connection.terminal?.fontFamily || 'JetBrains Mono',
    theme: connection.terminal?.theme || 'default',
    cursorBlink: true,
    cursorStyle: 'block' as 'block' | 'underline' | 'bar',
    scrollback: 1000,
    bellStyle: 'sound' as 'none' | 'visual' | 'sound',
    allowTransparency: false
  })

  const handleSave = () => {
    updateConnection(connection.id, {
      terminal: {
        ...connection.terminal,
        ...settings
      }
    })
    onClose()
  }

  const handleReset = () => {
    setSettings({
      rows: 24,
      cols: 80,
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      theme: 'default',
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      bellStyle: 'sound',
      allowTransparency: false
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <SettingsContainer onClick={onClose}>
      <SettingsCard onClick={(e) => e.stopPropagation()}>
        <SettingsHeader>
          <SettingsTitle>终端设置</SettingsTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </SettingsHeader>

        <SettingsContent>
          <SettingsSection>
            <SectionTitle>显示设置</SectionTitle>
            
            <FormGroup>
              <Label>行数</Label>
              <Input
                type="number"
                value={settings.rows}
                onChange={(e) => handleInputChange('rows', parseInt(e.target.value))}
                min="10"
                max="100"
              />
            </FormGroup>

            <FormGroup>
              <Label>列数</Label>
              <Input
                type="number"
                value={settings.cols}
                onChange={(e) => handleInputChange('cols', parseInt(e.target.value))}
                min="40"
                max="200"
              />
            </FormGroup>

            <FormGroup>
              <Label>字体大小</Label>
              <Input
                type="number"
                value={settings.fontSize}
                onChange={(e) => handleInputChange('fontSize', parseInt(e.target.value))}
                min="8"
                max="32"
              />
            </FormGroup>

            <FormGroup>
              <Label>字体</Label>
              <Select
                value={settings.fontFamily}
                onChange={(e) => handleInputChange('fontFamily', e.target.value)}
              >
                <option value="JetBrains Mono">JetBrains Mono</option>
                <option value="Fira Code">Fira Code</option>
                <option value="Consolas">Consolas</option>
                <option value="Monaco">Monaco</option>
                <option value="Courier New">Courier New</option>
                <option value="Source Code Pro">Source Code Pro</option>
                <option value="Ubuntu Mono">Ubuntu Mono</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>主题</Label>
              <Select
                value={settings.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
              >
                <option value="default">默认</option>
                <option value="dark">深色</option>
                <option value="light">浅色</option>
                <option value="monokai">Monokai</option>
                <option value="solarized">Solarized</option>
                <option value="dracula">Dracula</option>
              </Select>
            </FormGroup>
          </SettingsSection>

          <SettingsSection>
            <SectionTitle>光标设置</SectionTitle>
            
            <FormGroup>
              <CheckboxGroup>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    checked={settings.cursorBlink}
                    onChange={(e) => handleInputChange('cursorBlink', e.target.checked)}
                  />
                  光标闪烁
                </CheckboxItem>
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <Label>光标样式</Label>
              <Select
                value={settings.cursorStyle}
                onChange={(e) => handleInputChange('cursorStyle', e.target.value)}
              >
                <option value="block">方块</option>
                <option value="underline">下划线</option>
                <option value="bar">竖线</option>
              </Select>
            </FormGroup>
          </SettingsSection>

          <SettingsSection>
            <SectionTitle>行为设置</SectionTitle>
            
            <FormGroup>
              <Label>历史记录行数</Label>
              <Input
                type="number"
                value={settings.scrollback}
                onChange={(e) => handleInputChange('scrollback', parseInt(e.target.value))}
                min="100"
                max="10000"
              />
            </FormGroup>

            <FormGroup>
              <Label>铃声样式</Label>
              <Select
                value={settings.bellStyle}
                onChange={(e) => handleInputChange('bellStyle', e.target.value)}
              >
                <option value="none">无</option>
                <option value="visual">视觉</option>
                <option value="sound">声音</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <CheckboxGroup>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    checked={settings.allowTransparency}
                    onChange={(e) => handleInputChange('allowTransparency', e.target.checked)}
                  />
                  允许透明度
                </CheckboxItem>
              </CheckboxGroup>
            </FormGroup>
          </SettingsSection>
        </SettingsContent>

        <SettingsFooter>
          <Button onClick={handleReset}>
            <RotateCcw size={16} />
            重置
          </Button>
          
          <Button onClick={onClose}>
            取消
          </Button>
          
          <Button variant="primary" onClick={handleSave}>
            <Save size={16} />
            保存
          </Button>
        </SettingsFooter>
      </SettingsCard>
    </SettingsContainer>
  )
}
