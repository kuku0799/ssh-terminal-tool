import { Connection } from '../stores/connectionStore'

export interface CommandHistory {
  id: string
  command: string
  timestamp: Date
  connectionId: string
  success: boolean
  output?: string
}

export interface CommandSuggestion {
  command: string
  description: string
  category: string
  usage?: string
  examples?: string[]
}

export interface CommandCompletion {
  suggestions: CommandSuggestion[]
  currentInput: string
  cursorPosition: number
}

class CommandService {
  private history: CommandHistory[] = []
  private suggestions: CommandSuggestion[] = []
  private currentInput: string = ''
  private historyIndex: number = -1
  private eventListeners: Map<string, (data: any) => void> = new Map()

  constructor() {
    this.initializeSuggestions()
    this.loadHistory()
  }

  private initializeSuggestions(): void {
    this.suggestions = [
      // 系统命令
      { command: 'ls', description: '列出目录内容', category: '文件操作', usage: 'ls [选项] [文件...]', examples: ['ls -la', 'ls -h', 'ls /tmp'] },
      { command: 'cd', description: '切换目录', category: '文件操作', usage: 'cd [目录]', examples: ['cd /home', 'cd ..', 'cd ~'] },
      { command: 'pwd', description: '显示当前工作目录', category: '文件操作', usage: 'pwd', examples: ['pwd'] },
      { command: 'mkdir', description: '创建目录', category: '文件操作', usage: 'mkdir [选项] 目录...', examples: ['mkdir test', 'mkdir -p path/to/dir'] },
      { command: 'rmdir', description: '删除空目录', category: '文件操作', usage: 'rmdir [选项] 目录...', examples: ['rmdir test', 'rmdir -p path/to/dir'] },
      { command: 'rm', description: '删除文件或目录', category: '文件操作', usage: 'rm [选项] 文件...', examples: ['rm file.txt', 'rm -rf directory'] },
      { command: 'cp', description: '复制文件或目录', category: '文件操作', usage: 'cp [选项] 源... 目标', examples: ['cp file.txt backup.txt', 'cp -r dir1 dir2'] },
      { command: 'mv', description: '移动或重命名文件', category: '文件操作', usage: 'mv [选项] 源... 目标', examples: ['mv old.txt new.txt', 'mv file.txt /tmp/'] },
      { command: 'find', description: '查找文件', category: '文件操作', usage: 'find [路径] [条件]', examples: ['find . -name "*.txt"', 'find / -type f -size +100M'] },
      { command: 'grep', description: '搜索文本', category: '文本处理', usage: 'grep [选项] 模式 [文件...]', examples: ['grep "error" log.txt', 'grep -r "function" src/'] },
      { command: 'cat', description: '显示文件内容', category: '文本处理', usage: 'cat [选项] [文件...]', examples: ['cat file.txt', 'cat -n file.txt'] },
      { command: 'head', description: '显示文件开头', category: '文本处理', usage: 'head [选项] [文件...]', examples: ['head -n 10 file.txt', 'head -c 100 file.txt'] },
      { command: 'tail', description: '显示文件结尾', category: '文本处理', usage: 'tail [选项] [文件...]', examples: ['tail -f log.txt', 'tail -n 20 file.txt'] },
      { command: 'less', description: '分页显示文件', category: '文本处理', usage: 'less [选项] [文件...]', examples: ['less file.txt', 'less -S file.txt'] },
      { command: 'more', description: '分页显示文件', category: '文本处理', usage: 'more [选项] [文件...]', examples: ['more file.txt'] },
      { command: 'vim', description: '文本编辑器', category: '编辑器', usage: 'vim [选项] [文件...]', examples: ['vim file.txt', 'vim +10 file.txt'] },
      { command: 'nano', description: '简单文本编辑器', category: '编辑器', usage: 'nano [选项] [文件...]', examples: ['nano file.txt', 'nano -w file.txt'] },
      { command: 'chmod', description: '修改文件权限', category: '权限管理', usage: 'chmod [选项] 模式 文件...', examples: ['chmod 755 file.txt', 'chmod +x script.sh'] },
      { command: 'chown', description: '修改文件所有者', category: '权限管理', usage: 'chown [选项] 所有者[:组] 文件...', examples: ['chown user file.txt', 'chown user:group file.txt'] },
      { command: 'ps', description: '显示进程', category: '进程管理', usage: 'ps [选项]', examples: ['ps aux', 'ps -ef', 'ps -u username'] },
      { command: 'top', description: '实时显示进程', category: '进程管理', usage: 'top [选项]', examples: ['top', 'top -u username'] },
      { command: 'htop', description: '交互式进程查看器', category: '进程管理', usage: 'htop [选项]', examples: ['htop', 'htop -u username'] },
      { command: 'kill', description: '终止进程', category: '进程管理', usage: 'kill [选项] PID...', examples: ['kill 1234', 'kill -9 1234', 'killall process_name'] },
      { command: 'systemctl', description: '系统服务管理', category: '系统管理', usage: 'systemctl [选项] 命令 [单元...]', examples: ['systemctl status nginx', 'systemctl start nginx', 'systemctl enable nginx'] },
      { command: 'service', description: '服务管理', category: '系统管理', usage: 'service 服务名 命令', examples: ['service nginx start', 'service nginx status'] },
      { command: 'df', description: '显示磁盘使用情况', category: '系统信息', usage: 'df [选项] [文件...]', examples: ['df -h', 'df -T', 'df /'] },
      { command: 'du', description: '显示目录使用情况', category: '系统信息', usage: 'du [选项] [文件...]', examples: ['du -h', 'du -sh *', 'du -h --max-depth=1'] },
      { command: 'free', description: '显示内存使用情况', category: '系统信息', usage: 'free [选项]', examples: ['free -h', 'free -m', 'free -s 5'] },
      { command: 'uptime', description: '显示系统运行时间', category: '系统信息', usage: 'uptime', examples: ['uptime'] },
      { command: 'whoami', description: '显示当前用户', category: '系统信息', usage: 'whoami', examples: ['whoami'] },
      { command: 'id', description: '显示用户ID', category: '系统信息', usage: 'id [选项] [用户...]', examples: ['id', 'id username'] },
      { command: 'uname', description: '显示系统信息', category: '系统信息', usage: 'uname [选项]', examples: ['uname -a', 'uname -r'] },
      { command: 'date', description: '显示或设置日期', category: '系统信息', usage: 'date [选项] [+格式]', examples: ['date', 'date +%Y-%m-%d', 'date -s "2023-01-01"'] },
      { command: 'wget', description: '下载文件', category: '网络工具', usage: 'wget [选项] URL...', examples: ['wget https://example.com/file.zip', 'wget -O file.zip https://example.com/file'] },
      { command: 'curl', description: '数据传输工具', category: '网络工具', usage: 'curl [选项] URL...', examples: ['curl https://api.example.com', 'curl -O https://example.com/file.zip'] },
      { command: 'ssh', description: 'SSH连接', category: '网络工具', usage: 'ssh [选项] [用户@]主机 [命令]', examples: ['ssh user@host', 'ssh -p 2222 user@host'] },
      { command: 'scp', description: '安全复制', category: '网络工具', usage: 'scp [选项] 源 目标', examples: ['scp file.txt user@host:/path/', 'scp -r dir user@host:/path/'] },
      { command: 'rsync', description: '文件同步', category: '网络工具', usage: 'rsync [选项] 源 目标', examples: ['rsync -av src/ dest/', 'rsync -av --delete src/ dest/'] },
      { command: 'tar', description: '归档工具', category: '压缩工具', usage: 'tar [选项] [文件...]', examples: ['tar -czf archive.tar.gz files/', 'tar -xzf archive.tar.gz'] },
      { command: 'zip', description: 'ZIP压缩', category: '压缩工具', usage: 'zip [选项] 压缩包 文件...', examples: ['zip -r archive.zip files/', 'zip -9 archive.zip file.txt'] },
      { command: 'unzip', description: 'ZIP解压', category: '压缩工具', usage: 'unzip [选项] 压缩包', examples: ['unzip archive.zip', 'unzip -d dest/ archive.zip'] },
      { command: 'gzip', description: 'GZIP压缩', category: '压缩工具', usage: 'gzip [选项] [文件...]', examples: ['gzip file.txt', 'gzip -d file.txt.gz'] },
      { command: 'gunzip', description: 'GZIP解压', category: '压缩工具', usage: 'gunzip [选项] [文件...]', examples: ['gunzip file.txt.gz'] },
      { command: 'history', description: '显示命令历史', category: 'Shell内置', usage: 'history [选项]', examples: ['history', 'history 10', 'history -c'] },
      { command: 'alias', description: '创建命令别名', category: 'Shell内置', usage: 'alias [名称=值]', examples: ['alias ll="ls -la"', 'alias', 'unalias ll'] },
      { command: 'export', description: '设置环境变量', category: 'Shell内置', usage: 'export [名称=值]', examples: ['export PATH=$PATH:/new/path', 'export VAR=value'] },
      { command: 'echo', description: '输出文本', category: 'Shell内置', usage: 'echo [选项] [字符串...]', examples: ['echo "Hello World"', 'echo $PATH'] },
      { command: 'printf', description: '格式化输出', category: 'Shell内置', usage: 'printf 格式 [参数...]', examples: ['printf "%s\\n" "Hello"', 'printf "%d\\n" 123'] },
      { command: 'test', description: '条件测试', category: 'Shell内置', usage: 'test 表达式', examples: ['test -f file.txt', 'test -d directory'] },
      { command: 'if', description: '条件语句', category: 'Shell内置', usage: 'if 条件; then 命令; fi', examples: ['if [ -f file.txt ]; then echo "exists"; fi'] },
      { command: 'for', description: '循环语句', category: 'Shell内置', usage: 'for 变量 in 列表; do 命令; done', examples: ['for i in 1 2 3; do echo $i; done'] },
      { command: 'while', description: '循环语句', category: 'Shell内置', usage: 'while 条件; do 命令; done', examples: ['while true; do echo "loop"; done'] },
      { command: 'case', description: '多分支语句', category: 'Shell内置', usage: 'case 值 in 模式) 命令;; esac', examples: ['case $1 in start) echo "starting";; stop) echo "stopping";; esac'] },
      { command: 'function', description: '定义函数', category: 'Shell内置', usage: 'function 名称() { 命令; }', examples: ['function hello() { echo "Hello $1"; }'] },
      { command: 'source', description: '执行脚本', category: 'Shell内置', usage: 'source 文件', examples: ['source ~/.bashrc', '. ~/.bashrc'] },
      { command: 'exit', description: '退出Shell', category: 'Shell内置', usage: 'exit [状态码]', examples: ['exit', 'exit 0', 'exit 1'] },
      { command: 'clear', description: '清屏', category: 'Shell内置', usage: 'clear', examples: ['clear'] },
      { command: 'reset', description: '重置终端', category: 'Shell内置', usage: 'reset', examples: ['reset'] },
      { command: 'help', description: '显示帮助', category: 'Shell内置', usage: 'help [命令]', examples: ['help', 'help cd'] },
      { command: 'man', description: '显示手册', category: '帮助系统', usage: 'man [选项] 命令', examples: ['man ls', 'man -k keyword'] },
      { command: 'info', description: '显示信息文档', category: '帮助系统', usage: 'info [选项] 主题', examples: ['info ls', 'info bash'] },
      { command: 'which', description: '查找命令位置', category: '帮助系统', usage: 'which [选项] 命令...', examples: ['which ls', 'which -a python'] },
      { command: 'whereis', description: '查找命令位置', category: '帮助系统', usage: 'whereis [选项] 命令...', examples: ['whereis ls', 'whereis -b ls'] },
      { command: 'type', description: '显示命令类型', category: '帮助系统', usage: 'type [选项] 命令...', examples: ['type ls', 'type -a cd'] }
    ]
  }

  private loadHistory(): void {
    try {
      const saved = localStorage.getItem('ssh-tool-command-history')
      if (saved) {
        this.history = JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
      }
    } catch (error) {
      console.error('Failed to load command history:', error)
    }
  }

  private saveHistory(): void {
    try {
      localStorage.setItem('ssh-tool-command-history', JSON.stringify(this.history))
    } catch (error) {
      console.error('Failed to save command history:', error)
    }
  }

  addToHistory(command: string, connectionId: string, success: boolean, output?: string): void {
    const historyItem: CommandHistory = {
      id: crypto.randomUUID(),
      command,
      timestamp: new Date(),
      connectionId,
      success,
      output
    }

    this.history.unshift(historyItem)
    
    // 限制历史记录数量
    if (this.history.length > 1000) {
      this.history = this.history.slice(0, 1000)
    }

    this.saveHistory()
    this.emitEvent('history-updated', { history: this.history })
  }

  getHistory(connectionId?: string): CommandHistory[] {
    if (connectionId) {
      return this.history.filter(item => item.connectionId === connectionId)
    }
    return this.history
  }

  clearHistory(connectionId?: string): void {
    if (connectionId) {
      this.history = this.history.filter(item => item.connectionId !== connectionId)
    } else {
      this.history = []
    }
    this.saveHistory()
    this.emitEvent('history-cleared', { connectionId })
  }

  getSuggestions(input: string, connectionId?: string): CommandSuggestion[] {
    if (!input.trim()) {
      return this.suggestions.slice(0, 10) // 返回前10个建议
    }

    const filtered = this.suggestions.filter(suggestion => 
      suggestion.command.toLowerCase().includes(input.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(input.toLowerCase())
    )

    // 优先显示完全匹配的命令
    const exactMatch = filtered.find(s => s.command === input)
    if (exactMatch) {
      return [exactMatch, ...filtered.filter(s => s !== exactMatch)]
    }

    return filtered.slice(0, 10)
  }

  getCommandCompletion(input: string, cursorPosition: number): CommandCompletion {
    const suggestions = this.getSuggestions(input)
    
    return {
      suggestions,
      currentInput: input,
      cursorPosition
    }
  }

  getPreviousCommand(): string | null {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++
      return this.history[this.historyIndex].command
    }
    return null
  }

  getNextCommand(): string | null {
    if (this.historyIndex > 0) {
      this.historyIndex--
      return this.history[this.historyIndex].command
    } else if (this.historyIndex === 0) {
      this.historyIndex = -1
      return ''
    }
    return null
  }

  resetHistoryIndex(): void {
    this.historyIndex = -1
  }

  searchHistory(query: string, connectionId?: string): CommandHistory[] {
    const filtered = this.getHistory(connectionId)
    return filtered.filter(item => 
      item.command.toLowerCase().includes(query.toLowerCase())
    )
  }

  getCommandHelp(command: string): CommandSuggestion | null {
    return this.suggestions.find(s => s.command === command) || null
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

export const commandService = new CommandService()
