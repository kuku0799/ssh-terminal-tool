#!/bin/bash

echo "🚀 SSH Terminal Tool 一键安装"
echo "============================"

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 请先安装Docker"
    echo "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker已安装"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

echo "✅ Docker正在运行"

# 克隆项目
echo "📥 下载项目..."
git clone https://github.com/kuku0799/ssh-terminal-tool.git
cd ssh-terminal-tool

# 创建必要目录
echo "📁 创建必要目录..."
mkdir -p data logs config mount

# 构建Docker镜像
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
    echo "✅ 安装完成！"
    echo ""
    echo "🌐 访问地址:"
    echo "  Web界面: http://localhost:3000"
    echo "  API接口: http://localhost:8080"
    echo "  VNC连接: localhost:5900 (如果启用)"
    echo ""
    echo "📋 常用命令:"
    echo "  查看日志: docker-compose logs -f"
    echo "  进入容器: docker-compose exec ssh-tool sh"
    echo "  停止容器: docker-compose down"
    echo ""
    echo "🎉 享受使用SSH Terminal Tool！"
else
    echo "❌ 启动失败"
    echo "查看日志: docker-compose logs"
    exit 1
fi
