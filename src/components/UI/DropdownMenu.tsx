import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  margin-top: 4px;
`

const DropdownItem = styled.button<{ variant?: 'default' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: transparent;
  border: none;
  color: ${props => props.variant === 'danger' ? props.theme.colors.error : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${props => props.theme.fonts.size.sm};
  text-align: left;

  &:hover {
    background: ${props => props.variant === 'danger' ? props.theme.colors.error}20 : props.theme.colors.backgroundSecondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:first-child {
    border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md};
  }

  &:only-child {
    border-radius: ${props => props.theme.borderRadius.md};
  }
`

const DropdownDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: ${props => props.theme.spacing.xs} 0;
`

interface DropdownItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'danger'
}

interface DropdownMenuProps {
  items: DropdownItem[]
  trigger: React.ReactNode
  align?: 'left' | 'right'
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  items, 
  trigger, 
  align = 'right' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick()
      setIsOpen(false)
    }
  }

  return (
    <DropdownContainer ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      <DropdownContent isOpen={isOpen}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <DropdownItem
              variant={item.variant}
              disabled={item.disabled}
              onClick={() => handleItemClick(item)}
            >
              {item.icon}
              {item.label}
            </DropdownItem>
            {index < items.length - 1 && <DropdownDivider />}
          </React.Fragment>
        ))}
      </DropdownContent>
    </DropdownContainer>
  )
}
