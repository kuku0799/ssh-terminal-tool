import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Theme {
  name: string
  colors: {
    background: string
    backgroundSecondary: string
    backgroundTertiary: string
    text: string
    textSecondary: string
    textInverse: string
    primary: string
    primaryHover: string
    secondary: string
    success: string
    warning: string
    error: string
    border: string
    borderHover: string
    shadow: string
  }
  fonts: {
    primary: string
    mono: string
    size: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
}

const defaultTheme: Theme = {
  name: 'Dark Pro',
  colors: {
    background: '#1e1e1e',
    backgroundSecondary: '#2d2d2d',
    backgroundTertiary: '#3c3c3c',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    textInverse: '#000000',
    primary: '#007acc',
    primaryHover: '#005a9e',
    secondary: '#6c757d',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    border: '#404040',
    borderHover: '#555555',
    shadow: 'rgba(0, 0, 0, 0.3)'
  },
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Consolas", "Monaco", "Courier New", monospace',
    size: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  }
}

const themes: Theme[] = [
  defaultTheme,
  {
    name: 'Light Pro',
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#f8f9fa',
      backgroundTertiary: '#e9ecef',
      text: '#212529',
      textSecondary: '#6c757d',
      textInverse: '#ffffff',
      primary: '#007bff',
      primaryHover: '#0056b3',
      secondary: '#6c757d',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      border: '#dee2e6',
      borderHover: '#adb5bd',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    fonts: defaultTheme.fonts,
    spacing: defaultTheme.spacing,
    borderRadius: defaultTheme.borderRadius
  },
  {
    name: 'Monokai',
    colors: {
      background: '#272822',
      backgroundSecondary: '#3e3d32',
      backgroundTertiary: '#49483e',
      text: '#f8f8f2',
      textSecondary: '#75715e',
      textInverse: '#272822',
      primary: '#a6e22e',
      primaryHover: '#8ccf1f',
      secondary: '#66d9ef',
      success: '#a6e22e',
      warning: '#f4bf75',
      error: '#f92672',
      border: '#49483e',
      borderHover: '#75715e',
      shadow: 'rgba(0, 0, 0, 0.5)'
    },
    fonts: defaultTheme.fonts,
    spacing: defaultTheme.spacing,
    borderRadius: defaultTheme.borderRadius
  },
  {
    name: 'Solarized Dark',
    colors: {
      background: '#002b36',
      backgroundSecondary: '#073642',
      backgroundTertiary: '#586e75',
      text: '#93a1a1',
      textSecondary: '#657b83',
      textInverse: '#002b36',
      primary: '#268bd2',
      primaryHover: '#1e6ba8',
      secondary: '#2aa198',
      success: '#859900',
      warning: '#b58900',
      error: '#dc322f',
      border: '#586e75',
      borderHover: '#657b83',
      shadow: 'rgba(0, 0, 0, 0.4)'
    },
    fonts: defaultTheme.fonts,
    spacing: defaultTheme.spacing,
    borderRadius: defaultTheme.borderRadius
  },
  {
    name: 'Dracula',
    colors: {
      background: '#282a36',
      backgroundSecondary: '#44475a',
      backgroundTertiary: '#6272a4',
      text: '#f8f8f2',
      textSecondary: '#bd93f9',
      textInverse: '#282a36',
      primary: '#ff79c6',
      primaryHover: '#ff6bb3',
      secondary: '#8be9fd',
      success: '#50fa7b',
      warning: '#f1fa8c',
      error: '#ff5555',
      border: '#6272a4',
      borderHover: '#8be9fd',
      shadow: 'rgba(0, 0, 0, 0.6)'
    },
    fonts: defaultTheme.fonts,
    spacing: defaultTheme.spacing,
    borderRadius: defaultTheme.borderRadius
  }
]

interface ThemeState {
  currentTheme: Theme
  availableThemes: Theme[]
  setTheme: (themeName: string) => void
  loadTheme: () => void
  saveTheme: () => void
  getTheme: (name: string) => Theme | undefined
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: defaultTheme,
      availableThemes: themes,

      setTheme: (themeName) => {
        const theme = get().availableThemes.find(t => t.name === themeName)
        if (theme) {
          set({ currentTheme: theme })
          get().saveTheme()
        }
      },

      loadTheme: () => {
        try {
          const saved = localStorage.getItem('ssh-tool-theme')
          if (saved) {
            const themeName = JSON.parse(saved)
            const theme = get().availableThemes.find(t => t.name === themeName)
            if (theme) {
              set({ currentTheme: theme })
            }
          }
        } catch (error) {
          console.error('Failed to load theme:', error)
        }
      },

      saveTheme: () => {
        try {
          const { currentTheme } = get()
          localStorage.setItem('ssh-tool-theme', JSON.stringify(currentTheme.name))
        } catch (error) {
          console.error('Failed to save theme:', error)
        }
      },

      getTheme: (name) => {
        return get().availableThemes.find(theme => theme.name === name)
      }
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({ currentTheme: state.currentTheme })
    }
  )
)
