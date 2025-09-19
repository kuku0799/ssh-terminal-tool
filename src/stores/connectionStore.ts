import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Connection {
  id: string
  name: string
  type: 'ssh' | 'rdp'
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  passphrase?: string
  proxy?: {
    type: 'http' | 'socks5'
    host: string
    port: number
    username?: string
    password?: string
  }
  color?: string
  group?: string
  tags?: string[]
  lastConnected?: Date
  isConnected: boolean
  terminal?: {
    rows: number
    cols: number
    fontSize: number
    fontFamily: string
    theme: string
  }
  rdp?: {
    width: number
    height: number
    colorDepth: number
    fullScreen: boolean
  }
}

interface ConnectionState {
  connections: Connection[]
  activeConnectionId: string | null
  addConnection: (connection: Omit<Connection, 'id' | 'isConnected'>) => void
  updateConnection: (id: string, updates: Partial<Connection>) => void
  deleteConnection: (id: string) => void
  setActiveConnection: (id: string | null) => void
  setConnectionStatus: (id: string, isConnected: boolean) => void
  loadConnections: () => void
  saveConnections: () => void
  getConnection: (id: string) => Connection | undefined
  getConnectionsByGroup: (group: string) => Connection[]
  searchConnections: (query: string) => Connection[]
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      connections: [],
      activeConnectionId: null,

      addConnection: (connectionData) => {
        const newConnection: Connection = {
          ...connectionData,
          id: crypto.randomUUID(),
          isConnected: false,
          lastConnected: new Date()
        }
        
        set((state) => ({
          connections: [...state.connections, newConnection]
        }))
        
        get().saveConnections()
      },

      updateConnection: (id, updates) => {
        set((state) => ({
          connections: state.connections.map((conn) =>
            conn.id === id ? { ...conn, ...updates } : conn
          )
        }))
        
        get().saveConnections()
      },

      deleteConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter((conn) => conn.id !== id),
          activeConnectionId: state.activeConnectionId === id ? null : state.activeConnectionId
        }))
        
        get().saveConnections()
      },

      setActiveConnection: (id) => {
        set({ activeConnectionId: id })
      },

      setConnectionStatus: (id, isConnected) => {
        set((state) => ({
          connections: state.connections.map((conn) =>
            conn.id === id 
              ? { ...conn, isConnected, lastConnected: isConnected ? new Date() : conn.lastConnected }
              : conn
          )
        }))
      },

      loadConnections: () => {
        try {
          const saved = localStorage.getItem('ssh-tool-connections')
          if (saved) {
            const connections = JSON.parse(saved)
            set({ connections })
          }
        } catch (error) {
          console.error('Failed to load connections:', error)
        }
      },

      saveConnections: () => {
        try {
          const { connections } = get()
          localStorage.setItem('ssh-tool-connections', JSON.stringify(connections))
        } catch (error) {
          console.error('Failed to save connections:', error)
        }
      },

      getConnection: (id) => {
        return get().connections.find((conn) => conn.id === id)
      },

      getConnectionsByGroup: (group) => {
        return get().connections.filter((conn) => conn.group === group)
      },

      searchConnections: (query) => {
        const { connections } = get()
        const lowerQuery = query.toLowerCase()
        
        return connections.filter((conn) =>
          conn.name.toLowerCase().includes(lowerQuery) ||
          conn.host.toLowerCase().includes(lowerQuery) ||
          conn.username.toLowerCase().includes(lowerQuery) ||
          conn.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
      }
    }),
    {
      name: 'connection-store',
      partialize: (state) => ({ connections: state.connections })
    }
  )
)
