import { Connection } from '../stores/connectionStore'

export interface SFTPFile {
  name: string
  path: string
  size: number
  type: 'file' | 'directory' | 'symlink'
  permissions: string
  owner: string
  group: string
  modified: Date
  isDirectory: boolean
  isFile: boolean
  isSymlink: boolean
}

export interface SFTPTransfer {
  id: string
  fileName: string
  filePath: string
  size: number
  transferred: number
  progress: number
  status: 'pending' | 'uploading' | 'downloading' | 'completed' | 'error'
  startTime: Date
  endTime?: Date
  error?: string
}

export interface SFTPConnection {
  id: string
  connectionId: string
  isConnected: boolean
  currentPath: string
  files: SFTPFile[]
  transfers: SFTPTransfer[]
}

class SFTPService {
  private connections: Map<string, SFTPConnection> = new Map()
  private eventListeners: Map<string, (event: any) => void> = new Map()

  async connect(connection: Connection): Promise<SFTPConnection> {
    const connectionId = connection.id

    try {
      // 模拟SFTP连接过程
      await this.simulateSFTPConnection(connection)

      const sftpConnection: SFTPConnection = {
        id: crypto.randomUUID(),
        connectionId,
        isConnected: true,
        currentPath: '/',
        files: [],
        transfers: []
      }

      this.connections.set(connectionId, sftpConnection)

      // 加载根目录文件
      await this.listFiles(connectionId, '/')

      return sftpConnection
    } catch (error) {
      throw new Error(`SFTP连接失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  private async simulateSFTPConnection(connection: Connection): Promise<void> {
    // 模拟连接延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 在实际实现中，这里会使用ssh2-sftp-client库
    console.log('SFTP连接参数:', {
      host: connection.host,
      port: connection.port,
      username: connection.username,
      password: connection.password ? '***' : undefined,
      privateKey: connection.privateKey ? '***' : undefined
    })
  }

  async disconnect(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (connection) {
      connection.isConnected = false
      this.connections.delete(connectionId)
    }
  }

  getConnection(connectionId: string): SFTPConnection | undefined {
    return this.connections.get(connectionId)
  }

  async listFiles(connectionId: string, path: string): Promise<SFTPFile[]> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('SFTP连接未建立')
    }

    // 模拟文件列表加载
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟文件数据
    const mockFiles: SFTPFile[] = [
      {
        name: '..',
        path: path === '/' ? '/' : path.split('/').slice(0, -1).join('/') || '/',
        size: 0,
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        modified: new Date(),
        isDirectory: true,
        isFile: false,
        isSymlink: false
      },
      {
        name: 'home',
        path: path === '/' ? '/home' : `${path}/home`,
        size: 4096,
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        modified: new Date(Date.now() - 86400000),
        isDirectory: true,
        isFile: false,
        isSymlink: false
      },
      {
        name: 'var',
        path: path === '/' ? '/var' : `${path}/var`,
        size: 4096,
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        modified: new Date(Date.now() - 172800000),
        isDirectory: true,
        isFile: false,
        isSymlink: false
      },
      {
        name: 'etc',
        path: path === '/' ? '/etc' : `${path}/etc`,
        size: 4096,
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        modified: new Date(Date.now() - 259200000),
        isDirectory: true,
        isFile: false,
        isSymlink: false
      },
      {
        name: 'readme.txt',
        path: path === '/' ? '/readme.txt' : `${path}/readme.txt`,
        size: 1024,
        type: 'file',
        permissions: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        modified: new Date(Date.now() - 3600000),
        isDirectory: false,
        isFile: true,
        isSymlink: false
      },
      {
        name: 'config.json',
        path: path === '/' ? '/config.json' : `${path}/config.json`,
        size: 2048,
        type: 'file',
        permissions: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        modified: new Date(Date.now() - 7200000),
        isDirectory: false,
        isFile: true,
        isSymlink: false
      }
    ]

    connection.files = mockFiles
    connection.currentPath = path

    return mockFiles
  }

  async changeDirectory(connectionId: string, path: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('SFTP连接未建立')
    }

    // 模拟目录切换
    await new Promise(resolve => setTimeout(resolve, 300))

    // 更新当前路径并重新加载文件列表
    await this.listFiles(connectionId, path)
  }

  async createDirectory(connectionId: string, path: string, name: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('SFTP连接未建立')
    }

    // 模拟创建目录
    await new Promise(resolve => setTimeout(resolve, 500))

    // 重新加载文件列表
    await this.listFiles(connectionId, connection.currentPath)
  }

  async deleteFile(connectionId: string, path: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('SFTP连接未建立')
    }

    // 模拟删除文件
    await new Promise(resolve => setTimeout(resolve, 500))

    // 重新加载文件列表
    await this.listFiles(connectionId, connection.currentPath)
  }

  async renameFile(connectionId: string, oldPath: string, newPath: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('SFTP连接未建立')
    }

    // 模拟重命名文件
    await new Promise(resolve => setTimeout(resolve, 500))

    // 重新加载文件列表
    await this.listFiles(connectionId, connection.currentPath)
  }

  async uploadFile(connectionId: string, localPath: string, remotePath: string): Promise<SFTPTransfer> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('SFTP连接未建立')
    }

    const transfer: SFTPTransfer = {
      id: crypto.randomUUID(),
      fileName: localPath.split('/').pop() || 'unknown',
      filePath: remotePath,
      size: 0, // 在实际实现中会获取文件大小
      transferred: 0,
      progress: 0,
      status: 'uploading',
      startTime: new Date()
    }

    connection.transfers.push(transfer)

    // 模拟文件上传过程
    this.simulateFileTransfer(transfer, connection)

    return transfer
  }

  async downloadFile(connectionId: string, remotePath: string, localPath: string): Promise<SFTPTransfer> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('SFTP连接未建立')
    }

    const transfer: SFTPTransfer = {
      id: crypto.randomUUID(),
      fileName: remotePath.split('/').pop() || 'unknown',
      filePath: localPath,
      size: 0, // 在实际实现中会获取文件大小
      transferred: 0,
      progress: 0,
      status: 'downloading',
      startTime: new Date()
    }

    connection.transfers.push(transfer)

    // 模拟文件下载过程
    this.simulateFileTransfer(transfer, connection)

    return transfer
  }

  private simulateFileTransfer(transfer: SFTPTransfer, connection: SFTPConnection): void {
    const interval = setInterval(() => {
      transfer.transferred += Math.random() * 1024 * 1024 // 模拟传输速度
      transfer.progress = Math.min((transfer.transferred / transfer.size) * 100, 100)

      if (transfer.progress >= 100) {
        transfer.status = 'completed'
        transfer.endTime = new Date()
        clearInterval(interval)
      }

      // 触发进度更新事件
      this.emitEvent('transfer-progress', { transferId: transfer.id, transfer })
    }, 100)

    // 模拟传输完成
    setTimeout(() => {
      if (transfer.status === 'uploading' || transfer.status === 'downloading') {
        transfer.status = 'completed'
        transfer.endTime = new Date()
        clearInterval(interval)
        this.emitEvent('transfer-completed', { transferId: transfer.id, transfer })
      }
    }, 5000)
  }

  async readFile(connectionId: string, path: string): Promise<string> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('SFTP连接未建立')
    }

    // 模拟文件读取
    await new Promise(resolve => setTimeout(resolve, 500))

    // 返回模拟文件内容
    return `# 文件内容: ${path}\n\n这是一个模拟的文件内容。\n在实际实现中，这里会通过SFTP协议读取真实的文件内容。`
  }

  async writeFile(connectionId: string, path: string, content: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('SFTP连接未建立')
    }

    // 模拟文件写入
    await new Promise(resolve => setTimeout(resolve, 500))

    // 重新加载文件列表
    await this.listFiles(connectionId, connection.currentPath)
  }

  getTransfers(connectionId: string): SFTPTransfer[] {
    const connection = this.connections.get(connectionId)
    return connection?.transfers || []
  }

  cancelTransfer(connectionId: string, transferId: string): void {
    const connection = this.connections.get(connectionId)
    if (connection) {
      const transfer = connection.transfers.find(t => t.id === transferId)
      if (transfer && (transfer.status === 'uploading' || transfer.status === 'downloading')) {
        transfer.status = 'error'
        transfer.error = '传输已取消'
        transfer.endTime = new Date()
      }
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
}

export const sftpService = new SFTPService()
