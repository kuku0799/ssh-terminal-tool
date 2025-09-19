# 🐳 SSH Terminal Tool - Docker版本

这是一个功能强大的SSH和远程桌面管理工具的Docker版本，支持多平台部署。

## ✨ 特性

- 🐳 **Docker容器化**: 一键部署，环境隔离
- 🔧 **数据持久化**: 配置、日志、连接数据持久保存
- 🌐 **Web界面**: 通过浏览器访问，支持多设备
- 🔐 **SSH密钥挂载**: 自动挂载主机SSH密钥
- 📊 **资源监控**: 内置资源使用监控
- 🔄 **自动重启**: 容器异常时自动重启
- 🛡️ **安全配置**: 非root用户运行，安全隔离

## 🚀 快速开始

### 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少2GB内存
- 至少1GB磁盘空间

### 1. 克隆项目

```bash
git clone <repository-url>
cd ssh-terminal-tool
```

### 2. 运行Docker设置脚本

```bash
npm run docker:setup
```

### 3. 启动应用

```bash
# 使用Docker Compose（推荐）
npm run docker:up

# 或者直接运行Docker容器
npm run docker:run
```

### 4. 访问应用

- **Web界面**: http://localhost:3000
- **API接口**: http://localhost:8080
- **VNC连接**: localhost:5900 (可选)

## 📁 目录结构

```
ssh-terminal-tool/
├── docker-compose.yml      # Docker Compose配置
├── Dockerfile             # Docker镜像构建文件
├── docker-entrypoint.sh   # 容器启动脚本
├── .dockerignore          # Docker忽略文件
├── data/                  # 数据持久化目录
│   ├── connections/       # 连接配置
│   ├── logs/             # 日志文件
│   └── config/           # 配置文件
├── logs/                  # 主机日志目录
├── config/                # 主机配置目录
└── mount/                 # 挂载目录
```

## 🔧 配置说明

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `NODE_ENV` | production | 运行环境 |
| `DISPLAY` | :99 | X11显示器 |
| `ENABLE_VNC` | false | 是否启用VNC |
| `TZ` | Asia/Shanghai | 时区设置 |

### 端口映射

| 端口 | 说明 |
|------|------|
| 3000 | Web界面 |
| 8080 | API接口 |
| 5900 | VNC连接（可选） |

### 数据挂载

| 主机路径 | 容器路径 | 说明 |
|----------|----------|------|
| `./data` | `/app/data` | 应用数据 |
| `./logs` | `/app/logs` | 日志文件 |
| `./config` | `/app/config` | 配置文件 |
| `~/.ssh` | `/home/sshuser/.ssh` | SSH密钥 |
| `./mount` | `/app/mount` | 自定义挂载 |

## 🛠️ 常用命令

### Docker Compose命令

```bash
# 启动服务
npm run docker:up

# 停止服务
npm run docker:down

# 查看日志
npm run docker:logs

# 进入容器
npm run docker:shell

# 重启服务
docker-compose restart

# 查看状态
docker-compose ps
```

### Docker命令

```bash
# 构建镜像
npm run docker:build

# 运行容器
npm run docker:run

# 查看容器
docker ps

# 查看日志
docker logs ssh-terminal-tool

# 进入容器
docker exec -it ssh-terminal-tool sh
```

## 🔐 安全配置

### SSH密钥管理

1. **自动挂载**: 主机的 `~/.ssh` 目录会自动挂载到容器
2. **权限设置**: 确保SSH密钥文件权限正确
   ```bash
   chmod 600 ~/.ssh/id_rsa
   chmod 644 ~/.ssh/id_rsa.pub
   ```

### 网络安全

- 容器运行在隔离的网络中
- 只暴露必要的端口
- 使用非root用户运行
- 启用安全选项

## 📊 监控和日志

### 查看日志

```bash
# 实时查看日志
npm run docker:logs

# 查看特定服务日志
docker-compose logs -f ssh-tool

# 查看错误日志
docker-compose logs --tail=100 ssh-tool | grep ERROR
```

### 资源监控

```bash
# 查看容器资源使用
docker stats ssh-terminal-tool

# 查看容器详细信息
docker inspect ssh-terminal-tool
```

## 🔄 更新和维护

### 更新应用

```bash
# 停止服务
npm run docker:down

# 拉取最新代码
git pull

# 重新构建镜像
npm run docker:build

# 启动服务
npm run docker:up
```

### 备份数据

```bash
# 备份数据目录
tar -czf ssh-tool-backup-$(date +%Y%m%d).tar.gz data/

# 恢复数据
tar -xzf ssh-tool-backup-20240101.tar.gz
```

## 🐛 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep :3000
   
   # 修改docker-compose.yml中的端口映射
   ```

2. **权限问题**
   ```bash
   # 修复数据目录权限
   sudo chown -R 1001:1001 data/
   ```

3. **容器无法启动**
   ```bash
   # 查看详细错误信息
   docker-compose logs ssh-tool
   
   # 检查配置文件
   docker-compose config
   ```

4. **SSH连接失败**
   ```bash
   # 检查SSH密钥权限
   ls -la ~/.ssh/
   
   # 测试SSH连接
   ssh -i ~/.ssh/id_rsa user@host
   ```

### 日志分析

```bash
# 查看应用日志
tail -f logs/app.log

# 查看错误日志
grep ERROR logs/app.log

# 查看连接日志
grep "SSH" logs/app.log
```

## 🌐 生产环境部署

### 使用Docker Swarm

```bash
# 初始化Swarm
docker swarm init

# 部署服务
docker stack deploy -c docker-compose.yml ssh-tool

# 查看服务状态
docker service ls
```

### 使用Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ssh-terminal-tool
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ssh-terminal-tool
  template:
    metadata:
      labels:
        app: ssh-terminal-tool
    spec:
      containers:
      - name: ssh-tool
        image: ssh-terminal-tool:latest
        ports:
        - containerPort: 3000
        - containerPort: 8080
        volumeMounts:
        - name: data
          mountPath: /app/data
        - name: ssh-keys
          mountPath: /home/sshuser/.ssh
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: ssh-tool-data
      - name: ssh-keys
        secret:
          secretName: ssh-keys
```

## 📞 支持

如果遇到问题，请：

1. 查看日志文件
2. 检查Docker和Docker Compose版本
3. 确认系统资源充足
4. 提交Issue或联系支持

## 📄 许可证

MIT License
