# 🐳 SSH Terminal Tool Docker部署指南

## 📋 目录

- [快速开始](#快速开始)
- [Docker命令](#docker命令)
- [配置说明](#配置说明)
- [数据管理](#数据管理)
- [监控和维护](#监控和维护)
- [故障排除](#故障排除)
- [生产环境部署](#生产环境部署)

## 🚀 快速开始

### 1. 一键启动（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd ssh-terminal-tool

# 运行快速启动脚本
chmod +x quick-start-docker.sh
./quick-start-docker.sh
```

### 2. 分步启动

```bash
# 1. 运行Docker设置
npm run docker:setup

# 2. 启动容器
npm run docker:up

# 3. 访问应用
# Web界面: http://localhost:3000
# API接口: http://localhost:8080
```

## 🐳 Docker命令

### 基本命令

```bash
# 构建镜像
npm run docker:build

# 启动容器
npm run docker:up

# 停止容器
npm run docker:down

# 查看日志
npm run docker:logs

# 进入容器
npm run docker:shell
```

### 高级命令

```bash
# 完整启动（包含检查）
npm run docker:start

# 监控状态
npm run docker:monitor

# 健康检查
npm run docker:health

# 备份数据
npm run docker:backup

# 恢复数据
npm run docker:restore
```

## ⚙️ 配置说明

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `NODE_ENV` | production | 运行环境 |
| `DISPLAY` | :99 | X11显示器 |
| `ENABLE_VNC` | false | 是否启用VNC |
| `TZ` | Asia/Shanghai | 时区设置 |

### 端口映射

| 端口 | 说明 | 协议 |
|------|------|------|
| 3000 | Web界面 | HTTP |
| 8080 | API接口 | HTTP |
| 5900 | VNC连接 | VNC |

### 数据挂载

| 主机路径 | 容器路径 | 说明 |
|----------|----------|------|
| `./data` | `/app/data` | 应用数据 |
| `./logs` | `/app/logs` | 日志文件 |
| `./config` | `/app/config` | 配置文件 |
| `~/.ssh` | `/home/sshuser/.ssh` | SSH密钥 |
| `./mount` | `/app/mount` | 自定义挂载 |

## 📁 数据管理

### 目录结构

```
ssh-terminal-tool/
├── data/                  # 数据目录
│   ├── connections/       # 连接配置
│   ├── logs/             # 日志文件
│   └── config/           # 配置文件
├── logs/                  # 主机日志
├── config/                # 主机配置
├── mount/                 # 挂载目录
└── backups/               # 备份目录
```

### 备份和恢复

```bash
# 备份数据
npm run docker:backup

# 恢复数据
npm run docker:restore

# 手动备份
tar -czf backup.tar.gz data/ config/ logs/

# 手动恢复
tar -xzf backup.tar.gz
```

## 📊 监控和维护

### 状态监控

```bash
# 查看容器状态
docker-compose ps

# 查看资源使用
docker stats ssh-terminal-tool

# 查看日志
npm run docker:logs

# 健康检查
npm run docker:health
```

### 日志管理

```bash
# 实时查看日志
npm run docker:logs

# 查看特定服务日志
docker-compose logs -f ssh-tool

# 查看错误日志
docker-compose logs --tail=100 ssh-tool | grep ERROR

# 清理日志
docker-compose logs --tail=0 -f | head -n 0
```

### 资源监控

```bash
# 查看容器资源使用
docker stats ssh-terminal-tool

# 查看容器详细信息
docker inspect ssh-terminal-tool

# 查看容器进程
docker-compose exec ssh-tool ps aux
```

## 🔧 故障排除

### 常见问题

#### 1. 容器无法启动

```bash
# 查看详细错误
docker-compose logs ssh-tool

# 检查配置文件
docker-compose config

# 重新构建镜像
npm run docker:build
```

#### 2. 端口被占用

```bash
# 检查端口占用
netstat -tulpn | grep :3000

# 修改端口映射
# 编辑 docker-compose.yml
```

#### 3. 权限问题

```bash
# 修复数据目录权限
sudo chown -R 1001:1001 data/

# 修复SSH密钥权限
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

#### 4. 网络问题

```bash
# 检查网络连接
docker network ls

# 重建网络
docker-compose down
docker-compose up -d
```

### 调试模式

```bash
# 进入容器调试
npm run docker:shell

# 查看容器内部
docker-compose exec ssh-tool sh

# 查看容器日志
docker logs ssh-terminal-tool
```

## 🏭 生产环境部署

### 使用Docker Swarm

```bash
# 初始化Swarm
docker swarm init

# 部署服务
docker stack deploy -c docker-compose.yml ssh-tool

# 查看服务状态
docker service ls

# 扩展服务
docker service scale ssh-tool_ssh-tool=3
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
        env:
        - name: NODE_ENV
          value: "production"
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: ssh-tool-data
      - name: ssh-keys
        secret:
          secretName: ssh-keys
```

### 使用Docker Compose Override

```yaml
# docker-compose.override.yml
version: '3.8'
services:
  ssh-tool:
    environment:
      - NODE_ENV=production
      - ENABLE_VNC=true
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'
        reservations:
          memory: 1G
          cpus: '1.0'
    restart: always
```

## 🔐 安全配置

### 网络安全

```yaml
# docker-compose.yml
services:
  ssh-tool:
    networks:
      - ssh-network
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE

networks:
  ssh-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### 数据安全

```bash
# 加密备份
gpg --symmetric --cipher-algo AES256 backup.tar.gz

# 设置文件权限
chmod 700 data/connections
chmod 600 data/connections/*.json
```

## 📈 性能优化

### 资源限制

```yaml
# docker-compose.yml
services:
  ssh-tool:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
```

### 缓存优化

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app

# 复制package.json并安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build
```

## 🆘 支持

如果遇到问题，请：

1. 查看日志文件
2. 运行健康检查
3. 检查Docker和Docker Compose版本
4. 确认系统资源充足
5. 提交Issue或联系支持

## 📄 许可证

MIT License
