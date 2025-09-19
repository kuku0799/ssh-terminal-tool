#!/bin/bash

# Docker启动脚本
echo "🐳 启动SSH Terminal Tool Docker容器..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 检查镜像是否存在
if ! docker image inspect ssh-terminal-tool > /dev/null 2>&1; then
    echo "📦 构建Docker镜像..."
    docker build -t ssh-terminal-tool .
    if [ $? -ne 0 ]; then
        echo "❌ 镜像构建失败"
        exit 1
    fi
fi

# 创建必要的目录
mkdir -p data/connections data/logs data/config mount

# 设置权限
chmod 755 data mount
chmod 700 data/connections data/config

# 启动容器
echo "🚀 启动容器..."
docker-compose up -d

# 等待容器启动
echo "⏳ 等待容器启动..."
sleep 5

# 检查容器状态
if docker-compose ps | grep -q "Up"; then
    echo "✅ 容器启动成功！"
    echo ""
    echo "🌐 访问地址:"
    echo "  Web界面: http://localhost:3000"
    echo "  API接口: http://localhost:8080"
    echo "  VNC连接: localhost:5900 (如果启用)"
    echo ""
    echo "📋 常用命令:"
    echo "  查看日志: npm run docker:logs"
    echo "  进入容器: npm run docker:shell"
    echo "  停止容器: npm run docker:down"
else
    echo "❌ 容器启动失败"
    echo "查看日志: npm run docker:logs"
    exit 1
fi
