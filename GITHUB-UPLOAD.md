# 📤 GitHub上传指南

## 🚀 快速上传步骤

### 1. 在GitHub上创建仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `ssh-terminal-tool`
   - **Description**: `功能强大的SSH和远程桌面管理工具 - Docker版本`
   - **Visibility**: 选择 Public 或 Private
   - **不要勾选** "Add a README file"（我们已经有了）
4. 点击 "Create repository"

### 2. 上传代码

在项目根目录打开PowerShell或命令提示符，运行以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: SSH Terminal Tool with Docker support"

# 添加远程仓库（替换为您的GitHub用户名）
git remote add origin https://github.com/您的用户名/ssh-terminal-tool.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 3. 更新README中的链接

上传成功后，需要更新README.md中的GitHub链接：

1. 打开 `README.md` 文件
2. 将所有 `https://github.com/您的用户名/ssh-terminal-tool.git` 替换为您的实际GitHub仓库地址
3. 将所有 `https://raw.githubusercontent.com/您的用户名/ssh-terminal-tool/main/` 替换为您的实际GitHub仓库地址

## 📋 上传后的文件结构

```
ssh-terminal-tool/
├── README.md                 # 项目说明
├── README-Docker.md         # Docker专用说明
├── DOCKER-GUIDE.md          # Docker部署指南
├── GITHUB-UPLOAD.md         # 本文件
├── package.json             # 项目配置
├── Dockerfile               # Docker镜像构建
├── docker-compose.yml       # Docker Compose配置
├── docker-entrypoint.sh     # 容器启动脚本
├── .dockerignore            # Docker忽略文件
├── env.docker               # 环境变量配置
├── install.bat              # Windows安装脚本
├── install.sh               # Linux/Mac安装脚本
├── quick-start-docker.sh    # 一键启动脚本
├── src/                     # 源代码目录
├── main/                    # Electron主进程
├── scripts/                 # 各种脚本
├── config/                  # 配置文件
└── assets/                  # 资源文件
```

## 🌐 用户安装命令

### Windows用户
```bash
# 方法1: 直接下载安装脚本
curl -o install.bat https://raw.githubusercontent.com/您的用户名/ssh-terminal-tool/main/install.bat
install.bat

# 方法2: 手动安装
git clone https://github.com/您的用户名/ssh-terminal-tool.git
cd ssh-terminal-tool
docker-compose up -d
```

### Linux/Mac用户
```bash
# 方法1: 一键安装
curl -sSL https://raw.githubusercontent.com/您的用户名/ssh-terminal-tool/main/install.sh | bash

# 方法2: 手动安装
git clone https://github.com/您的用户名/ssh-terminal-tool.git
cd ssh-terminal-tool
docker-compose up -d
```

## 🔧 后续维护

### 更新代码
```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push origin main
```

### 创建Release
1. 在GitHub仓库页面点击 "Releases"
2. 点击 "Create a new release"
3. 填写版本号和发布说明
4. 上传编译好的文件（可选）

### 添加CI/CD
可以添加GitHub Actions来自动构建和部署：

```yaml
# .github/workflows/docker.yml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build Docker image
      run: docker build -t ssh-terminal-tool .
    - name: Test Docker image
      run: docker run --rm ssh-terminal-tool --version
```

## 📞 支持

如果遇到上传问题，请检查：

1. **Git配置**: 确保已配置用户名和邮箱
   ```bash
   git config --global user.name "您的用户名"
   git config --global user.email "您的邮箱"
   ```

2. **SSH密钥**: 如果使用SSH，确保已配置SSH密钥

3. **网络连接**: 确保网络连接正常

4. **权限问题**: 确保有仓库的写入权限

## 🎉 完成

上传完成后，您的项目就可以通过以下方式被其他人使用了：

- **GitHub仓库**: `https://github.com/您的用户名/ssh-terminal-tool`
- **一键安装**: 用户可以直接运行安装脚本
- **Docker Hub**: 可以推送到Docker Hub供用户直接拉取镜像
