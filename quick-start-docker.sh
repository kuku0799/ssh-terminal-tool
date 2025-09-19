#!/bin/bash

# SSH Terminal Tool Docker快速启动脚本
echo "🚀 SSH Terminal Tool Docker快速启动"
echo "=================================="

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    echo "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    echo "安装指南: https://docs.docker.com/compose/install/"
    exit 1
fi

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

echo "✅ Docker环境检查通过"

# 创建必要目录
echo "📁 创建必要目录..."
mkdir -p data/connections data/logs data/config mount

# 设置权限
chmod 755 data mount
chmod 700 data/connections data/config

# 构建镜像
echo "🔨 构建Docker镜像..."
docker build -t ssh-terminal-tool .

if [ $? -ne 0 ]; then
    echo "❌ 镜像构建失败"
    exit 1
fi

# 启动容器
echo "🚀 启动容器..."
docker-compose up -d

# 等待启动
echo "⏳ 等待容器启动..."
sleep 10

# 检查状态
if docker-compose ps | grep -q "Up"; then
    echo "✅ 启动成功！"
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
    echo "  健康检查: npm run docker:health"
    echo ""
    echo "🎉 享受使用SSH Terminal Tool！"
else
    echo "❌ 启动失败"
    echo "查看日志: npm run docker:logs"
    exit 1
fi
