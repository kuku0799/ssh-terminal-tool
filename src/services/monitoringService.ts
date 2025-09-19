import { Connection } from '../stores/connectionStore'

export interface SystemInfo {
  hostname: string
  platform: string
  arch: string
  uptime: number
  loadAverage: number[]
  cpuCount: number
}

export interface CPUInfo {
  usage: number
  cores: Array<{
    id: number
    usage: number
    frequency: number
    temperature?: number
  }>
  loadAverage: number[]
}

export interface MemoryInfo {
  total: number
  used: number
  free: number
  available: number
  usage: number
  swap: {
    total: number
    used: number
    free: number
    usage: number
  }
}

export interface DiskInfo {
  total: number
  used: number
  free: number
  usage: number
  mountPoint: string
  filesystem: string
}

export interface NetworkInfo {
  interfaces: Array<{
    name: string
    bytesReceived: number
    bytesSent: number
    packetsReceived: number
    packetsSent: number
    errors: number
    dropped: number
  }>
  connections: {
    established: number
    listening: number
    timeWait: number
  }
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  memory: number
  state: string
  user: string
  command: string
}

export interface MonitoringData {
  timestamp: Date
  system: SystemInfo
  cpu: CPUInfo
  memory: MemoryInfo
  disks: DiskInfo[]
  network: NetworkInfo
  processes: ProcessInfo[]
}

class MonitoringService {
  private connections: Map<string, NodeJS.Timeout> = new Map()
  private eventListeners: Map<string, (data: MonitoringData) => void> = new Map()

  async startMonitoring(connectionId: string, connection: Connection): Promise<void> {
    if (this.connections.has(connectionId)) {
      return // 已经在监控中
    }

    // 模拟监控数据收集
    const interval = setInterval(async () => {
      try {
        const data = await this.collectMonitoringData(connection)
        this.emitEvent('monitoring-data', { connectionId, data })
      } catch (error) {
        console.error('监控数据收集失败:', error)
      }
    }, 2000) // 每2秒收集一次数据

    this.connections.set(connectionId, interval)
  }

  stopMonitoring(connectionId: string): void {
    const interval = this.connections.get(connectionId)
    if (interval) {
      clearInterval(interval)
      this.connections.delete(connectionId)
    }
  }

  private async collectMonitoringData(connection: Connection): Promise<MonitoringData> {
    // 模拟数据收集过程
    await new Promise(resolve => setTimeout(resolve, 100))

    const timestamp = new Date()
    
    // 模拟系统信息
    const system: SystemInfo = {
      hostname: connection.host,
      platform: 'linux',
      arch: 'x64',
      uptime: Math.floor(Math.random() * 86400 * 30), // 随机运行时间
      loadAverage: [Math.random(), Math.random(), Math.random()],
      cpuCount: 4
    }

    // 模拟CPU信息
    const cpu: CPUInfo = {
      usage: Math.random() * 100,
      cores: Array.from({ length: 4 }, (_, i) => ({
        id: i,
        usage: Math.random() * 100,
        frequency: 2400 + Math.random() * 400,
        temperature: 40 + Math.random() * 30
      })),
      loadAverage: [Math.random(), Math.random(), Math.random()]
    }

    // 模拟内存信息
    const totalMemory = 8 * 1024 * 1024 * 1024 // 8GB
    const usedMemory = totalMemory * (0.3 + Math.random() * 0.4)
    const memory: MemoryInfo = {
      total: totalMemory,
      used: usedMemory,
      free: totalMemory - usedMemory,
      available: totalMemory - usedMemory,
      usage: (usedMemory / totalMemory) * 100,
      swap: {
        total: 2 * 1024 * 1024 * 1024, // 2GB
        used: Math.random() * 1024 * 1024 * 1024,
        free: 2 * 1024 * 1024 * 1024 - Math.random() * 1024 * 1024 * 1024,
        usage: Math.random() * 50
      }
    }

    // 模拟磁盘信息
    const disks: DiskInfo[] = [
      {
        total: 500 * 1024 * 1024 * 1024, // 500GB
        used: 200 * 1024 * 1024 * 1024 + Math.random() * 100 * 1024 * 1024 * 1024,
        free: 300 * 1024 * 1024 * 1024 - Math.random() * 100 * 1024 * 1024 * 1024,
        usage: 40 + Math.random() * 20,
        mountPoint: '/',
        filesystem: 'ext4'
      },
      {
        total: 100 * 1024 * 1024 * 1024, // 100GB
        used: 20 * 1024 * 1024 * 1024 + Math.random() * 20 * 1024 * 1024 * 1024,
        free: 80 * 1024 * 1024 * 1024 - Math.random() * 20 * 1024 * 1024 * 1024,
        usage: 20 + Math.random() * 10,
        mountPoint: '/home',
        filesystem: 'ext4'
      }
    ]

    // 模拟网络信息
    const network: NetworkInfo = {
      interfaces: [
        {
          name: 'eth0',
          bytesReceived: Math.floor(Math.random() * 1000000000),
          bytesSent: Math.floor(Math.random() * 1000000000),
          packetsReceived: Math.floor(Math.random() * 1000000),
          packetsSent: Math.floor(Math.random() * 1000000),
          errors: Math.floor(Math.random() * 100),
          dropped: Math.floor(Math.random() * 50)
        },
        {
          name: 'lo',
          bytesReceived: Math.floor(Math.random() * 10000000),
          bytesSent: Math.floor(Math.random() * 10000000),
          packetsReceived: Math.floor(Math.random() * 100000),
          packetsSent: Math.floor(Math.random() * 100000),
          errors: 0,
          dropped: 0
        }
      ],
      connections: {
        established: Math.floor(Math.random() * 1000),
        listening: Math.floor(Math.random() * 100),
        timeWait: Math.floor(Math.random() * 200)
      }
    }

    // 模拟进程信息
    const processes: ProcessInfo[] = [
      {
        pid: 1,
        name: 'systemd',
        cpu: Math.random() * 5,
        memory: 50 + Math.random() * 100,
        state: 'S',
        user: 'root',
        command: '/sbin/init'
      },
      {
        pid: 1234,
        name: 'nginx',
        cpu: Math.random() * 10,
        memory: 100 + Math.random() * 200,
        state: 'S',
        user: 'www-data',
        command: 'nginx: master process'
      },
      {
        pid: 1235,
        name: 'node',
        cpu: Math.random() * 15,
        memory: 200 + Math.random() * 300,
        state: 'S',
        user: 'node',
        command: 'node app.js'
      },
      {
        pid: 5678,
        name: 'mysql',
        cpu: Math.random() * 8,
        memory: 500 + Math.random() * 500,
        state: 'S',
        user: 'mysql',
        command: 'mysqld'
      }
    ]

    return {
      timestamp,
      system,
      cpu,
      memory,
      disks,
      network,
      processes
    }
  }

  // 事件系统
  on(event: string, callback: (data: any) => void): void {
    this.eventListeners.set(event, callback)
  }

  off(event: string): void {
    this.eventListeners.delete(event)
  }

  private emitEvent(event: string, data: any): void {
    const callback = this.eventListeners.get(event)
    if (callback) {
      callback(data)
    }
  }

  // 获取历史数据（模拟）
  async getHistoricalData(connectionId: string, hours: number = 24): Promise<MonitoringData[]> {
    const data: MonitoringData[] = []
    const now = new Date()
    
    for (let i = 0; i < hours; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      data.push({
        timestamp,
        system: {
          hostname: connectionId,
          platform: 'linux',
          arch: 'x64',
          uptime: Math.floor(Math.random() * 86400 * 30),
          loadAverage: [Math.random(), Math.random(), Math.random()],
          cpuCount: 4
        },
        cpu: {
          usage: Math.random() * 100,
          cores: Array.from({ length: 4 }, (_, i) => ({
            id: i,
            usage: Math.random() * 100,
            frequency: 2400 + Math.random() * 400
          })),
          loadAverage: [Math.random(), Math.random(), Math.random()]
        },
        memory: {
          total: 8 * 1024 * 1024 * 1024,
          used: 8 * 1024 * 1024 * 1024 * (0.3 + Math.random() * 0.4),
          free: 8 * 1024 * 1024 * 1024 * (0.6 - Math.random() * 0.4),
          available: 8 * 1024 * 1024 * 1024 * (0.6 - Math.random() * 0.4),
          usage: (0.3 + Math.random() * 0.4) * 100,
          swap: {
            total: 2 * 1024 * 1024 * 1024,
            used: Math.random() * 1024 * 1024 * 1024,
            free: 2 * 1024 * 1024 * 1024 - Math.random() * 1024 * 1024 * 1024,
            usage: Math.random() * 50
          }
        },
        disks: [],
        network: {
          interfaces: [],
          connections: {
            established: Math.floor(Math.random() * 1000),
            listening: Math.floor(Math.random() * 100),
            timeWait: Math.floor(Math.random() * 200)
          }
        },
        processes: []
      })
    }

    return data.reverse() // 按时间正序排列
  }
}

export const monitoringService = new MonitoringService()
