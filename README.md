# SSH Terminal Tool

[![Docker](https://img.shields.io/badge/Docker-支持-blue)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

一款功能强大的跨平台SSH和远程桌面管理工具，支持Windows、macOS和Linux。

## 🚀 一键安装

### Windows用户
```bash
# 下载并运行安装脚本
curl -o install.bat https://raw.githubusercontent.com/您的用户名/ssh-terminal-tool/main/install.bat
install.bat
```

### Linux/Mac用户
```bash
# 下载并运行安装脚本
curl -sSL https://raw.githubusercontent.com/您的用户名/ssh-terminal-tool/main/install.sh | bash
```

### 手动安装
```bash
# 克隆项目
git clone https://github.com/您的用户名/ssh-terminal-tool.git
cd ssh-terminal-tool

# 启动Docker容器
docker-compose up -d

# 访问应用
# Web界面: http://localhost:3000
```

## ✨ 主要特性

### 🔗 连接管理
- **多平台支持**: Windows、macOS、Linux
- **多标签管理**: 批量服务器管理，支持同时连接多个服务器
- **双协议支持**: SSH和Windows远程桌面(RDP)
- **连接分组**: 按项目或环境分组管理连接
- **标签系统**: 为连接添加自定义标签便于分类

### 🎨 界面体验
- **现代化UI**: 基于Electron + React + TypeScript构建
- **主题系统**: 内置100多个配色方案，支持自定义主题
- **平滑字体**: 支持JetBrains Mono、Fira Code等编程字体
- **响应式设计**: 自适应不同屏幕尺寸
- **动画效果**: 流畅的过渡动画和交互反馈

### 💻 终端功能
- **xterm.js终端**: 功能完整的终端模拟器
- **命令历史**: 支持命令历史记录和快速选择
- **智能补全**: 命令自动提示和智能匹配
- **多标签**: 每个连接独立的终端标签页
- **终端设置**: 可自定义字体、大小、颜色等

### 📁 文件管理
- **SFTP支持**: 内置SFTP文件管理器
- **同屏显示**: 终端和SFTP同屏显示，同步切换目录
- **快速操作**: 拖拽上传、右键菜单、批量操作
- **文件预览**: 支持文本文件预览和编辑

### 📊 系统监控
- **实时监控**: CPU、内存、磁盘使用率实时监控
- **网络状态**: Ping延迟、丢包率、Trace路由监控
- **进程管理**: 查看和管理系统进程
- **性能图表**: 直观的性能数据可视化

### 🚀 高级功能
- **代理支持**: SSH和RDP均支持代理服务器
- **加速连接**: 内置海外服务器加速，操作流畅无卡顿
- **文件传输**: 支持rz/sz (zmodem)协议
- **压缩传输**: 自动压缩解压，提高传输效率
- **命令面板**: 快捷命令面板，可同时显示数十个命令
- **文本编辑器**: 内置支持语法高亮的文本编辑器

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **桌面应用**: Electron 27
- **构建工具**: Vite
- **状态管理**: Zustand
- **样式方案**: Styled Components
- **终端模拟器**: xterm.js
- **SSH连接**: node-ssh / ssh2
- **RDP连接**: node-rdp
- **文件传输**: ssh2-sftp-client
- **代码编辑器**: Monaco Editor

## 🚀 快速开始

### 方式1: Docker部署（推荐）

#### 环境要求
- Docker 20.10+
- Docker Compose 2.0+

#### 快速启动
```bash
# 1. 运行Docker设置脚本
npm run docker:setup

# 2. 启动应用
npm run docker:up

# 3. 访问应用
# Web界面: http://localhost:3000
# API接口: http://localhost:8080
```

#### Docker命令
```bash
npm run docker:up      # 启动容器
npm run docker:down    # 停止容器
npm run docker:logs    # 查看日志
npm run docker:shell   # 进入容器
```

### 方式2: 本地开发

#### 环境要求
- Node.js 18+
- npm 或 yarn

#### 安装依赖
```bash
# 方法1: 使用设置脚本（推荐）
npm run setup

# 方法2: 手动安装
npm install
```

#### 开发模式
```bash
npm run dev
```

#### 构建应用
```bash
# 构建所有平台
npm run build

# 构建特定平台
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

## ⚠️ 常见问题

### 依赖安装失败
如果遇到依赖安装失败的问题，请尝试以下解决方案：

1. **清理缓存**:
   ```bash
   npm cache clean --force
   ```

2. **删除node_modules和package-lock.json**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **使用yarn替代npm**:
   ```bash
   yarn install
   ```

4. **手动安装核心依赖**:
   ```bash
   npm install react react-dom react-router-dom
   npm install xterm xterm-addon-fit xterm-addon-web-links
   npm install styled-components lucide-react zustand
   npm install monaco-editor react-hot-toast
   ```

### 网络问题
如果遇到网络问题，可以尝试使用国内镜像：
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

## 📦 项目结构

```
ssh-terminal-tool/
├── main/                    # Electron主进程
│   ├── main.ts             # 主进程入口
│   ├── preload.ts          # 预加载脚本
│   └── utils.ts            # 工具函数
├── src/                    # 渲染进程源码
│   ├── components/         # React组件
│   │   ├── Connection/     # 连接管理组件
│   │   ├── Terminal/       # 终端组件
│   │   ├── SFTP/          # SFTP组件
│   │   ├── Monitoring/    # 监控组件
│   │   ├── Settings/      # 设置组件
│   │   └── Layout/        # 布局组件
│   ├── stores/            # 状态管理
│   ├── styles/            # 样式文件
│   └── main.tsx           # 渲染进程入口
├── assets/                # 静态资源
├── dist/                  # 构建输出
└── release/               # 打包输出
```

## 🎯 功能规划

### 已完成 ✅
- [x] 项目基础架构搭建
- [x] Electron主框架
- [x] React UI界面
- [x] 连接管理系统
- [x] 主题配色系统
- [x] 多标签页管理
- [x] 终端基础框架

### 开发中 🚧
- [ ] SSH连接实现
- [ ] 终端功能完善
- [ ] SFTP文件管理器

### 计划中 📋
- [ ] RDP远程桌面连接
- [ ] 系统监控功能
- [ ] 命令提示和补全
- [ ] 内置文本编辑器
- [ ] 代理服务器支持
- [ ] 文件传输优化
- [ ] 性能监控
- [ ] 快捷键系统

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目！

### 开发规范
- 使用TypeScript进行类型检查
- 遵循ESLint代码规范
- 组件使用函数式组件和Hooks
- 样式使用Styled Components
- 提交信息遵循Conventional Commits规范

## 📄 许可证

MIT License

## 🙏 致谢

感谢以下开源项目的支持：
- [Electron](https://electronjs.org/)
- [React](https://reactjs.org/)
- [xterm.js](https://xtermjs.org/)
- [node-ssh](https://github.com/steelbrain/node-ssh)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

**注意**: 这是一个开发中的项目，部分功能仍在实现中。欢迎关注项目进展！
