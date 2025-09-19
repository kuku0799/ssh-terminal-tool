import React from 'react'
import styled from 'styled-components'
import { Settings as SettingsIcon, Palette, Keyboard, Bell, Shield } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
`

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const SettingsTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`

const SettingsContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`

const SettingsSidebar = styled.div`
  width: 250px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg};
`

const SettingsMain = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`

const SidebarItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  margin-bottom: ${props => props.theme.spacing.xs};

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.backgroundTertiary};
  }
`

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
`

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
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

const ColorPreview = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  background: ${props => props.color};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
`

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`

const ThemeCard = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.colors.primary}20 : props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`

const ThemePreview = styled.div<{ theme: any }>`
  width: 100%;
  height: 60px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: ${props => props.theme.colors.backgroundSecondary};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  &::after {
    content: '';
    position: absolute;
    top: 30px;
    left: 8px;
    right: 8px;
    height: 2px;
    background: ${props => props.theme.colors.primary};
  }
`

const ThemeName = styled.span`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`

export const SettingsView: React.FC = () => {
  const { currentTheme, availableThemes, setTheme } = useThemeStore()
  const [activeSection, setActiveSection] = useState('appearance')

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsIcon size={24} />
        <SettingsTitle>设置</SettingsTitle>
      </SettingsHeader>

      <SettingsContent>
        <SettingsSidebar>
          <SidebarItem
            active={activeSection === 'appearance'}
            onClick={() => setActiveSection('appearance')}
          >
            <Palette size={16} />
            外观
          </SidebarItem>
          <SidebarItem
            active={activeSection === 'keyboard'}
            onClick={() => setActiveSection('keyboard')}
          >
            <Keyboard size={16} />
            快捷键
          </SidebarItem>
          <SidebarItem
            active={activeSection === 'notifications'}
            onClick={() => setActiveSection('notifications')}
          >
            <Bell size={16} />
            通知
          </SidebarItem>
          <SidebarItem
            active={activeSection === 'security'}
            onClick={() => setActiveSection('security')}
          >
            <Shield size={16} />
            安全
          </SidebarItem>
        </SettingsSidebar>

        <SettingsMain>
          {activeSection === 'appearance' && (
            <>
              <SectionTitle>主题设置</SectionTitle>
              
              <FormGroup>
                <Label>当前主题</Label>
                <ThemeGrid>
                  {availableThemes.map((theme) => (
                    <ThemeCard
                      key={theme.name}
                      active={theme.name === currentTheme.name}
                      onClick={() => setTheme(theme.name)}
                    >
                      <ThemePreview theme={theme} />
                      <ThemeName>{theme.name}</ThemeName>
                    </ThemeCard>
                  ))}
                </ThemeGrid>
              </FormGroup>

              <FormGroup>
                <Label>字体设置</Label>
                <Select>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Monaco">Monaco</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <CheckboxGroup>
                  <CheckboxItem>
                    <Checkbox type="checkbox" defaultChecked />
                    启用动画效果
                  </CheckboxItem>
                  <CheckboxItem>
                    <Checkbox type="checkbox" />
                    紧凑模式
                  </CheckboxItem>
                  <CheckboxItem>
                    <Checkbox type="checkbox" defaultChecked />
                    显示图标
                  </CheckboxItem>
                </CheckboxGroup>
              </FormGroup>
            </>
          )}

          {activeSection === 'keyboard' && (
            <>
              <SectionTitle>快捷键设置</SectionTitle>
              <p>快捷键设置功能正在开发中...</p>
            </>
          )}

          {activeSection === 'notifications' && (
            <>
              <SectionTitle>通知设置</SectionTitle>
              <p>通知设置功能正在开发中...</p>
            </>
          )}

          {activeSection === 'security' && (
            <>
              <SectionTitle>安全设置</SectionTitle>
              <p>安全设置功能正在开发中...</p>
            </>
          )}
        </SettingsMain>
      </SettingsContent>
    </SettingsContainer>
  )
}
